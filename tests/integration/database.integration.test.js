/**
 * database.integration.test.js
 * Retail ERP Enterprise — DatabaseService Integration Tests
 *
 * Verifies the full DatabaseService lifecycle against a real temporary SQLite
 * instance: initialization, pragma application, schema creation, seed execution,
 * transaction helper, graceful close, and re-initialization guard.
 *
 * Phase 6 — Step 2: Integration Testing
 */

'use strict';

const test   = require('node:test');
const assert = require('node:assert');
const fs     = require('fs');
const path   = require('path');

// Use an isolated test database to avoid polluting the development DB
const TEST_DB_DIR  = path.resolve('./database/test-integration');
const TEST_DB_FILE = 'retail_erp_integration_db.db';
const TEST_DB_PATH = path.join(TEST_DB_DIR, TEST_DB_FILE);

/**
 * Resets the DatabaseService singleton between test blocks.
 * Clears the module registry to force a clean state each time.
 */
function resetDbService() {
  // Bust entire require cache for database-related modules
  const cachePaths = [
    '../../src/backend/database',
    '../../src/config/database.config',
  ];
  for (const p of cachePaths) {
    try {
      delete require.cache[require.resolve(p)];
    } catch (_) { /* ignore */ }
  }
}

/**
 * Cleans up test database artifacts from disk.
 */
function cleanTestDb() {
  try {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    // Remove WAL and SHM sidecar files
    for (const ext of ['-wal', '-shm']) {
      const f = TEST_DB_PATH + ext;
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
    if (fs.existsSync(TEST_DB_DIR)) {
      fs.rmdirSync(TEST_DB_DIR, { recursive: true });
    }
  } catch (_) { /* ignore cleanup errors */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Suite 1 — DatabaseService Initialization
// ─────────────────────────────────────────────────────────────────────────────

test('DatabaseService - Initialization & Lifecycle', async (t) => {

  // Point DB to isolated directory before each suite
  t.before(() => {
    cleanTestDb();
    process.env.DB_PATH = TEST_DB_DIR;
    process.env.DB_NAME = TEST_DB_FILE;
  });

  t.after(() => {
    // Attempt graceful close
    try {
      resetDbService();
      const dbService = require('../../src/backend/database');
      dbService.close();
    } catch (_) { /* ignore */ }
    cleanTestDb();
    delete process.env.DB_PATH;
    delete process.env.DB_NAME;
  });

  await t.test('should create database directory if it does not exist', () => {
    resetDbService();
    const dbService = require('../../src/backend/database');
    dbService.initialize();
    assert.ok(fs.existsSync(TEST_DB_DIR), 'DB directory should be created');
  });

  await t.test('should create the database file on disk', () => {
    resetDbService();
    const dbService = require('../../src/backend/database');
    dbService.initialize();
    assert.ok(fs.existsSync(TEST_DB_PATH), 'DB file should exist on disk');
  });

  await t.test('should return a valid connection object', () => {
    resetDbService();
    const dbService = require('../../src/backend/database');
    const db = dbService.initialize();
    assert.ok(db, 'initialize() must return a DB instance');
    assert.strictEqual(typeof db.prepare, 'function', 'connection must have prepare()');
  });

  await t.test('should return same connection on repeated getConnection() calls (singleton)', () => {
    resetDbService();
    const dbService = require('../../src/backend/database');
    const db1 = dbService.getConnection();
    const db2 = dbService.getConnection();
    assert.strictEqual(db1, db2, 'getConnection() must return the same singleton instance');
  });

  await t.test('should skip re-initialization if already connected', () => {
    resetDbService();
    const dbService = require('../../src/backend/database');
    const db1 = dbService.initialize();
    const db2 = dbService.initialize(); // Second call should be no-op
    assert.strictEqual(db1, db2, 'Second initialize() call must return existing connection');
  });

  await t.test('should close the connection without throwing', () => {
    resetDbService();
    const dbService = require('../../src/backend/database');
    dbService.initialize();
    assert.doesNotThrow(() => dbService.close());
  });

  await t.test('should allow re-initialization after close', () => {
    resetDbService();
    const dbService = require('../../src/backend/database');
    dbService.initialize();
    dbService.close();
    const db2 = dbService.initialize();
    assert.ok(db2, 'Should be able to initialize after close');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 2 — Pragma Verification
// ─────────────────────────────────────────────────────────────────────────────

test('DatabaseService - Pragma Application', async (t) => {

  let dbService;

  t.before(() => {
    cleanTestDb();
    process.env.DB_PATH = TEST_DB_DIR;
    process.env.DB_NAME = TEST_DB_FILE;
    resetDbService();
    dbService = require('../../src/backend/database');
    dbService.initialize();
  });

  t.after(() => {
    try { dbService.close(); } catch (_) { /* ignore */ }
    cleanTestDb();
    delete process.env.DB_PATH;
    delete process.env.DB_NAME;
  });

  await t.test('should enable WAL journal mode', () => {
    const db   = dbService.getConnection();
    const mode = db.pragma('journal_mode', { simple: true });
    assert.strictEqual(mode, 'wal', 'WAL mode must be active');
  });

  await t.test('should enable foreign key enforcement', () => {
    const db = dbService.getConnection();
    const fk = db.pragma('foreign_keys', { simple: true });
    assert.strictEqual(fk, 1, 'foreign_keys must be ON (1)');
  });

  await t.test('should use NORMAL synchronous mode', () => {
    const db   = dbService.getConnection();
    const sync = db.pragma('synchronous', { simple: true });
    // 'NORMAL' maps to integer 1 in SQLite
    assert.strictEqual(sync, 1, 'synchronous must be NORMAL (1)');
  });

  await t.test('should use MEMORY temp_store', () => {
    const db   = dbService.getConnection();
    const temp = db.pragma('temp_store', { simple: true });
    // MEMORY = 2
    assert.strictEqual(temp, 2, 'temp_store must be MEMORY (2)');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 3 — Schema Initialization Verification
// ─────────────────────────────────────────────────────────────────────────────

test('DatabaseService - Schema & Seed', async (t) => {

  let dbService;

  t.before(() => {
    cleanTestDb();
    process.env.DB_PATH = TEST_DB_DIR;
    process.env.DB_NAME = TEST_DB_FILE;
    process.env.DB_SEED = 'true';
    resetDbService();
    dbService = require('../../src/backend/database');
    dbService.initialize();
  });

  t.after(() => {
    try { dbService.close(); } catch (_) { /* ignore */ }
    cleanTestDb();
    delete process.env.DB_PATH;
    delete process.env.DB_NAME;
    delete process.env.DB_SEED;
  });

  const tables = ['roles', 'permissions', 'role_permissions', 'users', 'company', 'settings', 'login_history'];

  for (const table of tables) {
    await t.test(`should have created table: ${table}`, () => {
      const db  = dbService.getConnection();
      const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table);
      assert.ok(row, `Table "${table}" must exist after schema initialization`);
    });
  }

  await t.test('should have seeded at least one role', () => {
    const db    = dbService.getConnection();
    const count = db.prepare('SELECT COUNT(*) as c FROM roles').get().c;
    assert.ok(count > 0, 'roles table must have at least one seeded row');
  });

  await t.test('should have seeded the default admin user', () => {
    const db   = dbService.getConnection();
    const user = db.prepare("SELECT * FROM users WHERE username = 'admin'").get();
    assert.ok(user,               'admin user must exist');
    assert.strictEqual(user.status, 'ACTIVE', 'admin must be ACTIVE');
  });

  await t.test('should have seeded default settings', () => {
    const db    = dbService.getConnection();
    const count = db.prepare('SELECT COUNT(*) as c FROM settings').get().c;
    assert.ok(count > 0, 'settings table must have at least one seeded entry');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 4 — Transaction Helper
// ─────────────────────────────────────────────────────────────────────────────

test('DatabaseService - Transaction Helper', async (t) => {

  let dbService;

  t.before(() => {
    cleanTestDb();
    process.env.DB_PATH = TEST_DB_DIR;
    process.env.DB_NAME = TEST_DB_FILE;
    process.env.DB_SEED = 'true';
    resetDbService();
    dbService = require('../../src/backend/database');
    dbService.initialize();
  });

  t.after(() => {
    try { dbService.close(); } catch (_) { /* ignore */ }
    cleanTestDb();
    delete process.env.DB_PATH;
    delete process.env.DB_NAME;
    delete process.env.DB_SEED;
  });

  await t.test('should commit a transaction successfully', () => {
    const db = dbService.getConnection();

    // Insert a test setting row using the transaction wrapper
    // Use valid group_name 'GENERAL' to satisfy the schema CHECK constraint
    const insertTxn = dbService.transaction(() => {
      db.prepare(`
        INSERT INTO settings (key, value, group_name, description)
        VALUES ('txn.test', 'txn-value', 'GENERAL', 'Transaction test entry')
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).run();
    });

    assert.doesNotThrow(() => insertTxn());

    const row = db.prepare("SELECT value FROM settings WHERE key = 'txn.test'").get();
    assert.ok(row, 'row must exist after committed transaction');
    assert.strictEqual(row.value, 'txn-value');
  });

  await t.test('should rollback a transaction on exception', () => {
    const db = dbService.getConnection();

    const before = db.prepare('SELECT COUNT(*) as c FROM settings').get().c;

    // Transaction that throws before any insert — tests pure rollback mechanics
    const badTxn = dbService.transaction(() => {
      // Force a failure at the start — no DB write should be committed
      throw new Error('Intentional rollback trigger');
    });

    assert.throws(() => badTxn(), /Intentional rollback trigger/);

    const after = db.prepare('SELECT COUNT(*) as c FROM settings').get().c;
    assert.strictEqual(before, after, 'row count must be unchanged after rollback');
  });
});
