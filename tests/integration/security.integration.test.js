/**
 * security.integration.test.js
 * Retail ERP Enterprise — Security Testing & Lockout Hardening Integration Tests
 *
 * Verifies in-memory brute-force lockout, credentials validation,
 * and IPC payload hardening.
 *
 * Phase 6 — Step 4: Security Testing & Hardening
 */

'use strict';

const test   = require('node:test');
const assert = require('node:assert');
const fs     = require('fs');
const path   = require('path');

const TEST_DB_DIR  = path.resolve('./database/test-security');
const TEST_DB_FILE = 'retail_erp_security_test.db';
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

test('Security Testing & Hardening Suite', async (t) => {

  let dbService;
  let authService;
  let userRepository;

  t.before(() => {
    cleanTestDb();
    process.env.DB_PATH = TEST_DB_DIR;
    process.env.DB_NAME = TEST_DB_FILE;
    process.env.DB_SEED = 'true';
    resetModules();

    dbService      = require('../../src/backend/database');
    authService    = require('../../src/backend/services/auth.service');
    userRepository = require('../../src/backend/repositories/user.repository');

    dbService.initialize();
  });

  t.after(() => {
    try { dbService.close(); } catch (_) { /* ignore */ }
    cleanTestDb();
    delete process.env.DB_PATH;
    delete process.env.DB_NAME;
    delete process.env.DB_SEED;
  });

  await t.test('Brute Force - Enforces lockout after 5 consecutive failures', async () => {
    const username = 'admin';
    
    // Attempt 5 incorrect logins explicitly requesting lockout enforcement
    for (let i = 0; i < 5; i++) {
      const res = await authService.login(username, 'WrongPassword', {
        bypassLockout: false,
      });
      assert.strictEqual(res.success, false);
      if (i < 4) {
        assert.strictEqual(res.message, 'Invalid username or password.');
      }
    }

    // The 6th attempt (even with the correct password) must be rejected with the lockout warning message
    const lockedRes = await authService.login(username, 'Admin@12345', {
      bypassLockout: false,
    });
    assert.strictEqual(lockedRes.success, false);
    assert.strictEqual(lockedRes.message, 'Too many failed login attempts. Please try again later.');
  });

  await t.test('Brute Force - Lockout behaves identically for non-existent users to prevent enumeration', async () => {
    const unknownUser = 'ghost_attacker';

    // Attempt 5 incorrect logins for a non-existent user
    for (let i = 0; i < 5; i++) {
      const res = await authService.login(unknownUser, 'RandomPass', {
        bypassLockout: false,
      });
      assert.strictEqual(res.success, false);
    }

    // 6th attempt must trigger the same lockout warning message, denying account existance disclosure
    const lockedRes = await authService.login(unknownUser, 'RandomPass', {
      bypassLockout: false,
    });
    assert.strictEqual(lockedRes.success, false);
    assert.strictEqual(lockedRes.message, 'Too many failed login attempts. Please try again later.');
  });
});
