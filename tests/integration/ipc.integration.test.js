/**
 * ipc.integration.test.js
 * Retail ERP Enterprise — AuthController Direct IPC Integration Tests
 *
 * Verifies AuthController.loginDirect, logoutDirect, and getSessionDirect
 * without requiring an active Electron process. Uses a real SQLite DB.
 *
 * Phase 6 — Step 2: Integration Testing
 */

'use strict';

const test   = require('node:test');
const assert = require('node:assert');
const fs     = require('fs');
const path   = require('path');

const TEST_DB_DIR  = path.resolve('./database/test-ipc');
const TEST_DB_FILE = 'retail_erp_ipc_test.db';
const TEST_DB_PATH = path.join(TEST_DB_DIR, TEST_DB_FILE);

function resetModules() {
  const mods = [
    '../../src/backend/database',
    '../../src/config/database.config',
    '../../src/backend/services/session.service',
    '../../src/backend/services/auth.service',
    '../../src/backend/controllers/auth.controller',
    '../../src/backend/repositories/user.repository',
    '../../src/backend/repositories/loginHistory.repository',
  ];
  for (const m of mods) {
    try { delete require.cache[require.resolve(m)]; } catch (_) { /* ignore */ }
  }
}

function cleanTestDb() {
  try {
    for (const ext of ['', '-wal', '-shm']) {
      const f = TEST_DB_PATH + ext;
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
    if (fs.existsSync(TEST_DB_DIR)) fs.rmdirSync(TEST_DB_DIR, { recursive: true });
  } catch (_) { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Suite 1 — loginDirect()
// ─────────────────────────────────────────────────────────────────────────────

test('AuthController - loginDirect()', async (t) => {

  let authController;
  let sessionService;

  t.before(() => {
    cleanTestDb();
    process.env.DB_PATH = TEST_DB_DIR;
    process.env.DB_NAME = TEST_DB_FILE;
    process.env.DB_SEED = 'true';
    resetModules();
    const dbService = require('../../src/backend/database');
    dbService.initialize();
    authController = require('../../src/backend/controllers/auth.controller');
    sessionService = require('../../src/backend/services/session.service');
  });

  t.after(() => {
    sessionService.destroySession();
    try {
      const dbService = require('../../src/backend/database');
      dbService.close();
    } catch (_) { /* ignore */ }
    cleanTestDb();
    delete process.env.DB_PATH;
    delete process.env.DB_NAME;
    delete process.env.DB_SEED;
  });

  await t.test('should successfully authenticate admin credentials', async () => {
    const result = await authController.loginDirect(
      { username: 'admin', password: 'Admin@12345' },
      { ipAddress: '127.0.0.1', userAgent: 'IPC-Test/1.0' }
    );

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.user.username, 'admin');
    assert.ok(result.session, 'must return session data');
    assert.strictEqual(result.message, 'Login successful.');
  });

  await t.test('should return failure for wrong password', async () => {
    const result = await authController.loginDirect({
      username: 'admin',
      password: 'WrongPass!999',
    });

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, 'Invalid username or password.');
    assert.strictEqual(result.user, undefined);
  });

  await t.test('should return failure for non-existent user', async () => {
    const result = await authController.loginDirect({
      username: 'ghost_user_999',
      password: 'Any@Password1',
    });

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, 'Invalid username or password.');
  });

  await t.test('should return failure for empty username', async () => {
    const result = await authController.loginDirect({
      username: '',
      password: 'Admin@12345',
    });

    assert.strictEqual(result.success, false);
  });

  await t.test('should return failure for empty password', async () => {
    const result = await authController.loginDirect({
      username: 'admin',
      password: '',
    });

    assert.strictEqual(result.success, false);
  });

  await t.test('should handle null credentials gracefully', async () => {
    const result = await authController.loginDirect(null);
    assert.strictEqual(result.success, false);
    // Must not throw — controller must absorb the error
  });

  await t.test('should handle undefined credentials gracefully', async () => {
    const result = await authController.loginDirect(undefined);
    assert.strictEqual(result.success, false);
  });

  await t.test('should be resilient to SQL injection-style username inputs', async () => {
    const sqlPayload = "admin' OR '1'='1";
    const result = await authController.loginDirect({
      username: sqlPayload,
      password: 'AnyPassword@1',
    });

    // Must fail cleanly — prepared statements neutralize injections
    assert.strictEqual(result.success, false,
      'SQL injection payload must not authenticate');
  });

  await t.test('should be resilient to SQL injection-style password inputs', async () => {
    const result = await authController.loginDirect({
      username: 'admin',
      password: "' OR '1'='1' --",
    });

    assert.strictEqual(result.success, false,
      'SQL injection in password must not succeed');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 2 — logoutDirect() & getSessionDirect()
// ─────────────────────────────────────────────────────────────────────────────

test('AuthController - logoutDirect() & getSessionDirect()', async (t) => {

  let authController;
  let sessionService;

  t.before(() => {
    cleanTestDb();
    process.env.DB_PATH = TEST_DB_DIR;
    process.env.DB_NAME = TEST_DB_FILE;
    process.env.DB_SEED = 'true';
    resetModules();
    const dbService = require('../../src/backend/database');
    dbService.initialize();
    authController = require('../../src/backend/controllers/auth.controller');
    sessionService = require('../../src/backend/services/session.service');
  });

  t.after(() => {
    sessionService.destroySession();
    try {
      const dbService = require('../../src/backend/database');
      dbService.close();
    } catch (_) { /* ignore */ }
    cleanTestDb();
    delete process.env.DB_PATH;
    delete process.env.DB_NAME;
    delete process.env.DB_SEED;
  });

  await t.test('getSessionDirect() should return null when no session is active', () => {
    sessionService.destroySession();
    const result = authController.getSessionDirect();
    assert.strictEqual(result, null);
  });

  await t.test('getSessionDirect() should return session data after login', async () => {
    await authController.loginDirect({
      username: 'admin',
      password: 'Admin@12345',
    });

    const session = authController.getSessionDirect();
    assert.ok(session,          'getSessionDirect must return session after login');
    assert.strictEqual(session.success, true);
    assert.ok(session.user,     'must include user');
    assert.ok(session.expiresAt, 'must include expiresAt');
  });

  await t.test('logoutDirect() should return success', () => {
    const result = authController.logoutDirect();
    assert.strictEqual(result.success, true);
  });

  await t.test('getSessionDirect() should return null after logout', () => {
    const session = authController.getSessionDirect();
    assert.strictEqual(session, null, 'No session must exist after logout');
  });

  await t.test('logoutDirect() should not throw when no session is active', () => {
    // Session already destroyed — calling again must be safe
    assert.doesNotThrow(() => authController.logoutDirect());
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 3 — Rapid Login Attempts (Correctness Under Repeated Calls)
// ─────────────────────────────────────────────────────────────────────────────

test('AuthController - Rapid Sequential Login Attempts', async (t) => {

  let authController;
  let sessionService;

  t.before(() => {
    cleanTestDb();
    process.env.DB_PATH = TEST_DB_DIR;
    process.env.DB_NAME = TEST_DB_FILE;
    process.env.DB_SEED = 'true';
    resetModules();
    const dbService = require('../../src/backend/database');
    dbService.initialize();
    authController = require('../../src/backend/controllers/auth.controller');
    sessionService = require('../../src/backend/services/session.service');
  });

  t.after(() => {
    sessionService.destroySession();
    try {
      const dbService = require('../../src/backend/database');
      dbService.close();
    } catch (_) { /* ignore */ }
    cleanTestDb();
    delete process.env.DB_PATH;
    delete process.env.DB_NAME;
    delete process.env.DB_SEED;
  });

  await t.test('should correctly handle 5 rapid failed login attempts without crashing', async () => {
    const attempts = 5;
    const results = [];

    for (let i = 0; i < attempts; i++) {
      const res = await authController.loginDirect({
        username: 'admin',
        password: `WrongPass${i}!`,
      });
      results.push(res);
    }

    assert.strictEqual(results.length, attempts, `Must have exactly ${attempts} results`);
    for (const res of results) {
      assert.strictEqual(res.success, false, 'All attempts with wrong passwords must fail');
    }
  });

  await t.test('should succeed after multiple failures when correct credentials are used', async () => {
    // Make 3 bad attempts first
    for (let i = 0; i < 3; i++) {
      await authController.loginDirect({ username: 'admin', password: 'Wrong@Pass!' });
    }

    // Now try with correct credentials
    const result = await authController.loginDirect({
      username: 'admin',
      password: 'Admin@12345',
    });

    assert.strictEqual(result.success, true, 'Valid credentials must succeed after failed attempts');
  });
});
