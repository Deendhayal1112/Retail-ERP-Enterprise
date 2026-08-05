/**
 * auth.flow.integration.test.js
 * Retail ERP Enterprise — End-to-End Authentication Flow Integration Tests
 *
 * Tests the complete authentication pipeline:
 * DB → UserRepository → PasswordService → AuthService → SessionService
 *
 * Covers all 14 test scenarios from the Phase 6 Step 2 brief:
 *   Application Launch, Database Connection, Admin Login,
 *   Invalid Username, Invalid Password, Inactive User,
 *   Empty Username, Empty Password, SQL Injection Attempt,
 *   Rapid Login Attempts, Logout, Session Restore,
 *   Window Reload (session check), Application Restart (session lifecycle)
 *
 * Phase 6 — Step 2: Integration Testing
 */

'use strict';

const test   = require('node:test');
const assert = require('node:assert');
const fs     = require('fs');
const path   = require('path');
const bcrypt = require('bcryptjs');

const TEST_DB_DIR  = path.resolve('./database/test-flow');
const TEST_DB_FILE = 'retail_erp_flow_test.db';
const TEST_DB_PATH = path.join(TEST_DB_DIR, TEST_DB_FILE);

function resetModules() {
  const mods = [
    '../../src/backend/database',
    '../../src/config/database.config',
    '../../src/backend/services/session.service',
    '../../src/backend/services/auth.service',
    '../../src/backend/services/password.service',
    '../../src/backend/repositories/user.repository',
    '../../src/backend/repositories/loginHistory.repository',
    '../../src/backend/repositories/role.repository',
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
// Main Integration Suite — Full Stack Auth Flow
// ─────────────────────────────────────────────────────────────────────────────

test('Auth Flow - Complete End-to-End Integration', async (t) => {

  let dbService;
  let authService;
  let sessionService;
  let userRepository;
  let loginHistoryRepository;
  let passwordService;

  // ── Global Setup ──────────────────────────────────────────────────────────
  t.before(() => {
    cleanTestDb();
    process.env.DB_PATH = TEST_DB_DIR;
    process.env.DB_NAME = TEST_DB_FILE;
    process.env.DB_SEED = 'true';
    resetModules();

    dbService            = require('../../src/backend/database');
    authService          = require('../../src/backend/services/auth.service');
    sessionService       = require('../../src/backend/services/session.service');
    userRepository       = require('../../src/backend/repositories/user.repository');
    loginHistoryRepository = require('../../src/backend/repositories/loginHistory.repository');
    passwordService      = require('../../src/backend/services/password.service');

    dbService.initialize();
  });

  // ── Global Teardown ───────────────────────────────────────────────────────
  t.after(() => {
    sessionService.destroySession();
    try { dbService.close(); } catch (_) { /* ignore */ }
    cleanTestDb();
    delete process.env.DB_PATH;
    delete process.env.DB_NAME;
    delete process.env.DB_SEED;
  });

  // ── Scenario 1: Application Launch — Database Connection ─────────────────
  await t.test('[SCENARIO 1] Application Launch — Database connects successfully', () => {
    const db = dbService.getConnection();
    assert.ok(db, 'Database connection must be available');
    assert.strictEqual(typeof db.prepare, 'function');
  });

  // ── Scenario 2: Database Connection — Schema Integrity ───────────────────
  await t.test('[SCENARIO 2] Database Connection — All required tables exist', () => {
    const db = dbService.getConnection();
    const expected = ['roles', 'permissions', 'role_permissions', 'users', 'company', 'settings', 'login_history'];
    for (const table of expected) {
      const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table);
      assert.ok(row, `Required table "${table}" must exist`);
    }
  });

  // ── Scenario 3: Admin Login — Full Success Path ───────────────────────────
  await t.test('[SCENARIO 3] Admin Login — Full success path through Auth → Session', async () => {
    const result = await authService.login('admin', 'Admin@12345', {
      ipAddress: '127.0.0.1',
      userAgent: 'Full-Flow-Test/1.0',
    });

    assert.strictEqual(result.success, true,          'Login must succeed');
    assert.strictEqual(result.user.username, 'admin', 'Username must match');
    assert.strictEqual(result.message, 'Login successful.');
    assert.ok(result.session.createdAt,               'Session createdAt must be set');
    assert.ok(result.session.expiresAt,               'Session expiresAt must be set');
    assert.ok(result.session.expiresAt > result.session.createdAt);
  });

  // ── Scenario 3a: Admin Login — Session is accessible via getSession() ─────
  await t.test('[SCENARIO 3a] Admin Login — Session retrievable after login', async () => {
    // Login first
    await authService.login('admin', 'Admin@12345', { ipAddress: '127.0.0.1' });

    const session = sessionService.getSession();
    assert.ok(session,                              'Session must be in memory after login');
    assert.strictEqual(session.user.username, 'admin');
  });

  // ── Scenario 3b: Admin Login — Login history is recorded ─────────────────
  await t.test('[SCENARIO 3b] Admin Login — Login event is logged in history', async () => {
    const admin = userRepository.findByUsername('admin');
    const before = loginHistoryRepository.findLatest(admin.id, 50).length;

    await authService.login('admin', 'Admin@12345', { ipAddress: '127.0.0.1', userAgent: 'History-Test/1.0' });

    const after = loginHistoryRepository.findLatest(admin.id, 50).length;
    assert.ok(after > before, 'Login history must be incremented after successful login');
  });

  // ── Scenario 3c: Admin Login — last_login timestamp is updated ────────────
  await t.test('[SCENARIO 3c] Admin Login — last_login timestamp is updated in DB', async () => {
    await authService.login('admin', 'Admin@12345', { ipAddress: '127.0.0.1' });
    const admin = userRepository.findByUsername('admin');
    assert.ok(admin.last_login, 'last_login must be set after authentication');
  });

  // ── Scenario 4: Invalid Username ──────────────────────────────────────────
  await t.test('[SCENARIO 4] Invalid Username — returns generic failure, no disclosure', async () => {
    const result = await authService.login('totally_unknown_xyz', 'Any@Password1');

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, 'Invalid username or password.',
      'Must use generic message — never reveal whether username exists');
    assert.strictEqual(result.user, undefined);
  });

  // ── Scenario 5: Invalid Password ─────────────────────────────────────────
  await t.test('[SCENARIO 5] Invalid Password — valid user, wrong password', async () => {
    const result = await authService.login('admin', 'Wrong@Password999');

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, 'Invalid username or password.');
  });

  // ── Scenario 5a: Invalid Password — login history is recorded ────────────
  await t.test('[SCENARIO 5a] Invalid Password — failed login is recorded in history', async () => {
    const admin  = userRepository.findByUsername('admin');
    const before = loginHistoryRepository.findLatest(admin.id, 50).length;

    await authService.login('admin', 'Wrong@Password999');

    const after = loginHistoryRepository.findLatest(admin.id, 50).length;
    assert.ok(after > before, 'Failed login event must be recorded in history');
  });

  // ── Scenario 6: Inactive / Suspended User ────────────────────────────────
  await t.test('[SCENARIO 6] Inactive User — SUSPENDED status blocks login', async () => {
    // Create a suspended test user
    const hash = bcrypt.hashSync('Suspended@Flow1', 10);
    const roleId = dbService.getConnection().prepare("SELECT id FROM roles WHERE name='Cashier'").get().id;

    userRepository.create({
      username:      'suspended_flow_user',
      email:         'suspended_flow@retailerp.local',
      password_hash: hash,
      full_name:     'Suspended Flow User',
      role_id:       roleId,
      status:        'SUSPENDED',
    });

    const result = await authService.login('suspended_flow_user', 'Suspended@Flow1');

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, 'Invalid username or password.',
      'Suspended user must receive generic error — no status disclosure');
  });

  await t.test('[SCENARIO 6a] Inactive User — INACTIVE status blocks login', async () => {
    const hash   = bcrypt.hashSync('Inactive@Flow1', 10);
    const roleId = dbService.getConnection().prepare("SELECT id FROM roles WHERE name='Viewer'").get().id;

    userRepository.create({
      username:      'inactive_flow_user',
      email:         'inactive_flow@retailerp.local',
      password_hash: hash,
      full_name:     'Inactive Flow User',
      role_id:       roleId,
      status:        'INACTIVE',
    });

    const result = await authService.login('inactive_flow_user', 'Inactive@Flow1');

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, 'Invalid username or password.');
  });

  // ── Scenario 7: Empty Username ────────────────────────────────────────────
  await t.test('[SCENARIO 7] Empty Username — rejected at service layer', async () => {
    const result = await authService.login('', 'Admin@12345');
    assert.strictEqual(result.success, false);
  });

  await t.test('[SCENARIO 7a] Null Username — rejected at service layer', async () => {
    const result = await authService.login(null, 'Admin@12345');
    assert.strictEqual(result.success, false);
  });

  await t.test('[SCENARIO 7b] Username with only whitespace — treated as empty/invalid', async () => {
    const result = await authService.login('   ', 'Admin@12345');
    // Whitespace-only normalizes to '' after trim — should fail to find user
    assert.strictEqual(result.success, false);
  });

  // ── Scenario 8: Empty Password ────────────────────────────────────────────
  await t.test('[SCENARIO 8] Empty Password — rejected at service layer', async () => {
    const result = await authService.login('admin', '');
    assert.strictEqual(result.success, false);
  });

  await t.test('[SCENARIO 8a] Null Password — rejected at service layer', async () => {
    const result = await authService.login('admin', null);
    assert.strictEqual(result.success, false);
  });

  // ── Scenario 9: SQL Injection Attempts ───────────────────────────────────
  await t.test('[SCENARIO 9] SQL Injection — username injection payload is rejected', async () => {
    const payloads = [
      "admin' --",
      "admin' OR '1'='1",
      "admin; DROP TABLE users; --",
      "' OR 1=1 --",
      "admin'/*",
    ];

    for (const payload of payloads) {
      const result = await authService.login(payload, 'Admin@12345');
      assert.strictEqual(result.success, false,
        `SQL injection payload must not succeed: ${payload}`);
    }
  });

  await t.test('[SCENARIO 9a] SQL Injection — password injection payload is rejected', async () => {
    const payloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' OR 1=1 --",
    ];

    for (const payload of payloads) {
      const result = await authService.login('admin', payload);
      assert.strictEqual(result.success, false,
        `Password SQL injection must not succeed: ${payload}`);
    }
  });

  // ── Scenario 10: Rapid Login Attempts ────────────────────────────────────
  await t.test('[SCENARIO 10] Rapid Login Attempts — 10 consecutive failures remain stable', async () => {
    const results = [];
    for (let i = 0; i < 10; i++) {
      const res = await authService.login('admin', `WrongPass${i}@Test`);
      results.push(res);
    }

    assert.strictEqual(results.length, 10);
    for (const r of results) {
      assert.strictEqual(r.success, false, 'All rapid failures must return success=false');
    }

    // Service must still work correctly after many failures
    const validResult = await authService.login('admin', 'Admin@12345');
    assert.strictEqual(validResult.success, true, 'Valid login must still succeed after rapid failures');
  });

  // ── Scenario 11: Logout ───────────────────────────────────────────────────
  await t.test('[SCENARIO 11] Logout — session is destroyed after logout', async () => {
    // Login first
    await authService.login('admin', 'Admin@12345', { ipAddress: '127.0.0.1' });
    assert.ok(sessionService.getSession(), 'Session must exist before logout');

    // Logout
    sessionService.logout();

    assert.strictEqual(sessionService.getSession(), null, 'Session must be null after logout');
  });

  // ── Scenario 12: Session Restore (rememberMe) ─────────────────────────────
  await t.test('[SCENARIO 12] Session Restore — rememberMe=true allows session to be restored', async () => {
    // Login with rememberMe
    await authService.login('admin', 'Admin@12345', {
      ipAddress: '127.0.0.1',
      rememberMe: true,
    });

    // Simulate in-memory loss (e.g., process restart without quitting electron-store)
    sessionService.currentSession = null;
    sessionService.stopSessionTimeoutMonitor();

    // Restore from persistent store
    const restored = sessionService.restoreSession();
    assert.ok(restored,                             'Session must be restorable from persistent store');
    assert.strictEqual(restored.user.username, 'admin');
    assert.strictEqual(restored.rememberMe, true);

    sessionService.destroySession(); // cleanup
  });

  await t.test('[SCENARIO 12a] Session Restore — rememberMe=false yields no persisted session', async () => {
    await authService.login('admin', 'Admin@12345', {
      ipAddress: '127.0.0.1',
      rememberMe: false,
    });

    sessionService.currentSession = null;
    sessionService.stopSessionTimeoutMonitor();

    const restored = sessionService.restoreSession();
    assert.strictEqual(restored, null, 'Non-remembered session must not restore from store');
  });

  // ── Scenario 13: Window Reload (session check) ────────────────────────────
  await t.test('[SCENARIO 13] Window Reload — getSession() returns null after logout and reload simulation', () => {
    // After logout session should be gone even if getSession() is called again
    sessionService.destroySession();
    const session = sessionService.getSession();
    assert.strictEqual(session, null, 'Simulated window reload: session must be null after destroy');
  });

  // ── Scenario 14: Application Restart ─────────────────────────────────────
  await t.test('[SCENARIO 14] Application Restart — DB re-initializes cleanly after close', () => {
    dbService.close();

    // Re-initialize (simulates application restart)
    const db = dbService.initialize();
    assert.ok(db, 'DB must re-initialize after close');

    // Schema must still be present
    const adminUser = db.prepare("SELECT * FROM users WHERE username='admin'").get();
    assert.ok(adminUser, 'Admin user must persist across DB re-initialization');
  });

  // ── Password Service Roundtrip in Auth Context ────────────────────────────
  await t.test('Password Roundtrip — hash and verify through PasswordService', async () => {
    const plain = 'Integration@Test99!';
    const hash  = await passwordService.hashPassword(plain);

    assert.ok(hash,                                 'Hash must be generated');
    assert.notStrictEqual(hash, plain,              'Hash must not equal plain text');

    const isValid   = await passwordService.verifyPassword(plain, hash);
    const isInvalid = await passwordService.verifyPassword('WrongPass!1', hash);

    assert.strictEqual(isValid,   true,  'Correct password must verify successfully');
    assert.strictEqual(isInvalid, false, 'Wrong password must not verify');
  });

  // ── Full Flow: Login → GetSession → Logout → GetSession ──────────────────
  await t.test('Full Flow: Login → GetSession → Logout → GetSession lifecycle', async () => {
    // 1. Login
    const loginResult = await authService.login('admin', 'Admin@12345', { ipAddress: '127.0.0.1' });
    assert.strictEqual(loginResult.success, true);

    // 2. Get active session
    const session = sessionService.getSession();
    assert.ok(session,                              'Session must be active after login');
    assert.strictEqual(session.user.username, 'admin');

    // 3. Validate session
    const isValid = sessionService.validateSession();
    assert.strictEqual(isValid, true,               'Session must be valid');

    // 4. Logout
    sessionService.logout();

    // 5. Verify cleared
    assert.strictEqual(sessionService.getSession(), null, 'Session must be null after logout');
    assert.strictEqual(sessionService.validateSession(), false, 'validateSession must return false after logout');
  });
});
