/**
 * full.stack.e2e.test.js
 * Retail ERP Enterprise — Full-Stack End-to-End Login Flow Tests
 *
 * Drives the COMPLETE application flow from AuthController.loginDirect()
 * all the way through DB → Auth Service → Session Service → getSessionDirect()
 * → Home guard check → logoutDirect() → session null verification.
 *
 * Uses a real isolated SQLite database — no mocks for the backend layer.
 *
 * End-to-End Flow Verified:
 *   Application Startup (DB init)
 *     ↓
 *   Login Page (client validation — verified in login.controller.e2e.test.js)
 *     ↓
 *   IPC Communication (loginDirect → authService.login)
 *     ↓
 *   Authentication Service (credential check)
 *     ↓
 *   Repository Layer (user lookup, login history, updateLastLogin)
 *     ↓
 *   SQLite Database (real queries, WAL mode, FK enforcement)
 *     ↓
 *   Password Verification (bcrypt roundtrip)
 *     ↓
 *   Session Creation (in-memory + optional electron-store)
 *     ↓
 *   Home Page Guard (getSessionDirect → success/null)
 *     ↓
 *   Logout (logoutDirect → session destroyed)
 *     ↓
 *   Return to Login (session null)
 *
 * Phase 6 — Step 3: End-to-End Login Testing
 */

'use strict';

const test   = require('node:test');
const assert = require('node:assert');
const fs     = require('fs');
const path   = require('path');
const bcrypt = require('bcryptjs');

const TEST_DB_DIR  = path.resolve('./database/test-e2e');
const TEST_DB_FILE = 'retail_erp_e2e_test.db';
const TEST_DB_PATH = path.join(TEST_DB_DIR, TEST_DB_FILE);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function resetModules() {
  const mods = [
    '../../src/backend/database',
    '../../src/config/database.config',
    '../../src/backend/services/session.service',
    '../../src/backend/services/auth.service',
    '../../src/backend/services/password.service',
    '../../src/backend/controllers/auth.controller',
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
// MAIN E2E SUITE — Full Stack Flow
// ─────────────────────────────────────────────────────────────────────────────

test('Full-Stack E2E — Complete Login Module Flow', async (t) => {

  let dbService;
  let authController;
  let sessionService;
  let userRepository;
  let loginHistoryRepository;

  // ── Global Setup ──────────────────────────────────────────────────────────
  t.before(() => {
    cleanTestDb();
    process.env.DB_PATH = TEST_DB_DIR;
    process.env.DB_NAME = TEST_DB_FILE;
    process.env.DB_SEED = 'true';
    resetModules();

    dbService              = require('../../src/backend/database');
    authController         = require('../../src/backend/controllers/auth.controller');
    sessionService         = require('../../src/backend/services/session.service');
    userRepository         = require('../../src/backend/repositories/user.repository');
    loginHistoryRepository = require('../../src/backend/repositories/loginHistory.repository');

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

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 1: Application Startup
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[STARTUP] Database initializes and all tables exist', () => {
    const db     = dbService.getConnection();
    const tables = ['roles', 'permissions', 'role_permissions', 'users', 'company', 'settings', 'login_history'];
    for (const table of tables) {
      const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table);
      assert.ok(row, `Table "${table}" must exist after startup`);
    }
  });

  await t.test('[STARTUP] Default admin account is seeded and active', () => {
    const admin = userRepository.findByUsername('admin');
    assert.ok(admin,                           'Admin user must exist after seeding');
    assert.strictEqual(admin.status, 'ACTIVE', 'Admin must be ACTIVE');
    assert.ok(admin.password_hash,             'Admin must have a password hash');
    assert.strictEqual(admin.username, 'admin');
  });

  await t.test('[STARTUP] WAL mode and FK enforcement are active', () => {
    const db   = dbService.getConnection();
    const mode = db.pragma('journal_mode', { simple: true });
    const fk   = db.pragma('foreign_keys', { simple: true });
    assert.strictEqual(mode, 'wal', 'WAL mode must be active on startup');
    assert.strictEqual(fk, 1,       'Foreign key enforcement must be ON');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 2: Login Page Display (IPC readiness)
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[LOGIN PAGE] getSessionDirect() returns null when no session is active', () => {
    sessionService.destroySession();
    const session = authController.getSessionDirect();
    assert.strictEqual(session, null, 'Home guard must see no session before login');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 3: User Input → Client Validation (backend mirror check)
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[CLIENT VALIDATION] Empty username is rejected before IPC (service-level guard)', async () => {
    const result = await authController.loginDirect({ username: '', password: 'Admin@12345' });
    assert.strictEqual(result.success, false,
      'Empty username must be rejected at the service layer');
  });

  await t.test('[CLIENT VALIDATION] Empty password is rejected before IPC (service-level guard)', async () => {
    const result = await authController.loginDirect({ username: 'admin', password: '' });
    assert.strictEqual(result.success, false,
      'Empty password must be rejected at the service layer');
  });

  await t.test('[CLIENT VALIDATION] Null credentials object is handled gracefully', async () => {
    const result = await authController.loginDirect(null);
    assert.strictEqual(result.success, false);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 4: IPC Communication → Authentication Service
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[IPC → AUTH] Valid admin credentials flow through IPC to Auth Service', async () => {
    sessionService.destroySession();
    const result = await authController.loginDirect(
      { username: 'admin', password: 'Admin@12345' },
      { ipAddress: '127.0.0.1', userAgent: 'E2E-Test/1.0' }
    );

    assert.strictEqual(result.success, true,            'Login must succeed via loginDirect()');
    assert.strictEqual(result.user.username, 'admin',   'Returned user must match credentials');
    assert.strictEqual(result.message, 'Login successful.');
  });

  await t.test('[IPC → AUTH] Login result contains session data', async () => {
    const result = await authController.loginDirect(
      { username: 'admin', password: 'Admin@12345' },
      { ipAddress: '127.0.0.1' }
    );
    assert.ok(result.session, 'Must return session object');
    assert.ok(result.session.createdAt, 'Session must have createdAt');
    assert.ok(result.session.expiresAt, 'Session must have expiresAt');
    assert.ok(result.session.expiresAt > result.session.createdAt,
      'expiresAt must be after createdAt');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 5: Repository Layer
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[REPOSITORY] Login history is recorded on successful login', async () => {
    const admin  = userRepository.findByUsername('admin');
    const before = loginHistoryRepository.findLatest(admin.id, 100).length;

    await authController.loginDirect(
      { username: 'admin', password: 'Admin@12345' },
      { ipAddress: '192.168.0.1', userAgent: 'E2E-History/1.0' }
    );

    const after = loginHistoryRepository.findLatest(admin.id, 100).length;
    assert.ok(after > before, 'Login history count must increase after successful login');
  });

  await t.test('[REPOSITORY] Login history is also recorded on failed login attempt', async () => {
    const admin  = userRepository.findByUsername('admin');
    const before = loginHistoryRepository.findLatest(admin.id, 100).length;

    await authController.loginDirect({ username: 'admin', password: 'WrongPassword!99' });

    const after = loginHistoryRepository.findLatest(admin.id, 100).length;
    assert.ok(after > before, 'Failed login must also be recorded in login history');
  });

  await t.test('[REPOSITORY] last_login timestamp is updated after successful login', async () => {
    await authController.loginDirect({ username: 'admin', password: 'Admin@12345' });
    const admin = userRepository.findByUsername('admin');
    assert.ok(admin.last_login, 'last_login must be updated after login');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 6: SQLite Database Layer
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[DATABASE] User lookup uses parameterized queries (SQL injection safe)', async () => {
    const injectionPayloads = [
      "admin' OR '1'='1",
      "' OR 1=1 --",
      "admin; DROP TABLE users; --",
      "admin'--",
    ];

    for (const payload of injectionPayloads) {
      const result = await authController.loginDirect({
        username: payload,
        password: 'Admin@12345',
      });
      assert.strictEqual(result.success, false,
        `SQL injection in username must not succeed: ${payload}`);
    }
  });

  await t.test('[DATABASE] Password SQL injection is blocked by prepared statements', async () => {
    const result = await authController.loginDirect({
      username: 'admin',
      password: "' OR '1'='1",
    });
    assert.strictEqual(result.success, false,
      'Password SQL injection must not authenticate');
  });

  await t.test('[DATABASE] Users table still intact after injection attempts', () => {
    const admin = userRepository.findByUsername('admin');
    assert.ok(admin, 'Admin user must still exist after SQL injection attempts');
    assert.strictEqual(admin.status, 'ACTIVE');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 7: Password Verification
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[PASSWORD] Correct password verifies successfully via bcrypt', async () => {
    const result = await authController.loginDirect({
      username: 'admin',
      password: 'Admin@12345',
    });
    assert.strictEqual(result.success, true, 'Correct password must pass bcrypt verification');
  });

  await t.test('[PASSWORD] Wrong password fails bcrypt verification', async () => {
    const result = await authController.loginDirect({
      username: 'admin',
      password: 'TotallyWrongPassword!999',
    });
    assert.strictEqual(result.success, false, 'Wrong password must fail bcrypt verification');
  });

  await t.test('[PASSWORD] Similar but incorrect password fails verification', async () => {
    // Test that bcrypt doesn't have off-by-one tolerance
    const result = await authController.loginDirect({
      username: 'admin',
      password: 'Admin@1234', // Missing final '5'
    });
    assert.strictEqual(result.success, false);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 8: Session Creation
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[SESSION CREATE] Session is created in memory after successful login', async () => {
    sessionService.destroySession();
    await authController.loginDirect({ username: 'admin', password: 'Admin@12345' });

    const session = sessionService.getSession();
    assert.ok(session,                              'Session must be in memory after login');
    assert.strictEqual(session.user.username, 'admin');
  });

  await t.test('[SESSION CREATE] Session has valid expiry in future', async () => {
    const session = sessionService.getSession();
    if (!session) {
      await authController.loginDirect({ username: 'admin', password: 'Admin@12345' });
    }
    const active = sessionService.getSession();
    assert.ok(active, 'Session must exist');
    assert.ok(active.expiresAt > Date.now(), 'Session must expire in the future');
  });

  await t.test('[SESSION CREATE] Session contains correct user snapshot', async () => {
    const active = sessionService.getSession();
    assert.ok(active, 'Session must exist');
    assert.ok(active.user.id,        'Session user must have id');
    assert.ok(active.user.uuid,      'Session user must have uuid');
    assert.ok(active.user.username,  'Session user must have username');
    assert.ok(active.user.email,     'Session user must have email');
    assert.ok(active.user.full_name, 'Session user must have full_name');
    assert.ok(active.user.role_id,   'Session user must have role_id');
    assert.strictEqual(active.user.status, 'ACTIVE');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 9: Home Page Guard (getSessionDirect)
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[HOME GUARD] getSessionDirect() returns session data after login', () => {
    const sessionData = authController.getSessionDirect();
    assert.ok(sessionData,               'getSessionDirect must return data after login');
    assert.strictEqual(sessionData.success, true);
    assert.ok(sessionData.user,          'Must include user object');
    assert.ok(sessionData.expiresAt,     'Must include expiresAt');
    assert.strictEqual(sessionData.user.username, 'admin');
  });

  await t.test('[HOME GUARD] validateSession() returns true while session is active', () => {
    assert.strictEqual(sessionService.validateSession(), true,
      'validateSession() must return true for active session');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 10: Logout → Session Destroy → Return to Login
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[LOGOUT] logoutDirect() returns success', () => {
    const result = authController.logoutDirect();
    assert.strictEqual(result.success, true, 'logoutDirect() must return success');
    assert.ok(result.message);
  });

  await t.test('[LOGOUT] Session is null after logoutDirect()', () => {
    const session = sessionService.getSession();
    assert.strictEqual(session, null, 'Session must be null after logout');
  });

  await t.test('[LOGOUT] getSessionDirect() returns null after logout', () => {
    const result = authController.getSessionDirect();
    assert.strictEqual(result, null, 'Home guard check must return null after logout');
  });

  await t.test('[LOGOUT] validateSession() returns false after logout', () => {
    assert.strictEqual(sessionService.validateSession(), false,
      'validateSession() must return false after logout');
  });

  await t.test('[LOGOUT] Session timeout monitor is stopped after logout', () => {
    assert.strictEqual(sessionService.timeoutCheckInterval, null,
      'Timeout monitor must be cleared after logout');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPLETE LIFECYCLE: Login → Session → Logout → Re-login
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[FULL LIFECYCLE] Complete flow: Login → Guard → Logout → Guard null', async () => {
    sessionService.destroySession();

    // 1. Login
    const loginResult = await authController.loginDirect(
      { username: 'admin', password: 'Admin@12345' },
      { ipAddress: '127.0.0.1' }
    );
    assert.strictEqual(loginResult.success, true, '1. Login must succeed');

    // 2. Home guard passes
    const sessionCheck = authController.getSessionDirect();
    assert.ok(sessionCheck,                  '2. Home guard must pass after login');
    assert.strictEqual(sessionCheck.success, true);

    // 3. Session valid
    assert.strictEqual(sessionService.validateSession(), true, '3. Session must be valid');

    // 4. Logout
    const logoutResult = authController.logoutDirect();
    assert.strictEqual(logoutResult.success, true, '4. Logout must succeed');

    // 5. Home guard fails (no session)
    const postLogout = authController.getSessionDirect();
    assert.strictEqual(postLogout, null, '5. Home guard must return null after logout');

    // 6. Session invalid
    assert.strictEqual(sessionService.validateSession(), false, '6. Session must be invalid after logout');
  });

  await t.test('[FULL LIFECYCLE] Can re-login after logout', async () => {
    // Session was destroyed in previous test
    const result = await authController.loginDirect(
      { username: 'admin', password: 'Admin@12345' },
      { ipAddress: '127.0.0.1' }
    );
    assert.strictEqual(result.success, true, 'Must be able to re-login after previous logout');
    assert.ok(sessionService.getSession(), 'New session must be created after re-login');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SCENARIO: Inactive / Suspended Users
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[INACTIVE USER] SUSPENDED user cannot login', async () => {
    const db     = dbService.getConnection();
    const roleId = db.prepare("SELECT id FROM roles WHERE name='Cashier'").get().id;
    const hash   = bcrypt.hashSync('Suspended@E2E1', 10);

    userRepository.create({
      username:      'e2e_suspended',
      email:         'e2e_suspended@retailerp.local',
      password_hash: hash,
      full_name:     'E2E Suspended User',
      role_id:       roleId,
      status:        'SUSPENDED',
    });

    const result = await authController.loginDirect({
      username: 'e2e_suspended',
      password: 'Suspended@E2E1',
    });

    assert.strictEqual(result.success, false,
      'SUSPENDED user must not be able to login');
    assert.strictEqual(result.message, 'Invalid username or password.',
      'Must use generic error message — no status disclosure');
  });

  await t.test('[INACTIVE USER] INACTIVE user cannot login', async () => {
    const db     = dbService.getConnection();
    const roleId = db.prepare("SELECT id FROM roles WHERE name='Viewer'").get().id;
    const hash   = bcrypt.hashSync('Inactive@E2E1', 10);

    userRepository.create({
      username:      'e2e_inactive',
      email:         'e2e_inactive@retailerp.local',
      password_hash: hash,
      full_name:     'E2E Inactive User',
      role_id:       roleId,
      status:        'INACTIVE',
    });

    const result = await authController.loginDirect({
      username: 'e2e_inactive',
      password: 'Inactive@E2E1',
    });

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, 'Invalid username or password.');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SCENARIO: Rapid Login Attempts — Stability
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[RAPID ATTEMPTS] 5 rapid valid logins remain stable', async () => {
    for (let i = 0; i < 5; i++) {
      sessionService.destroySession();
      const result = await authController.loginDirect({ username: 'admin', password: 'Admin@12345' });
      assert.strictEqual(result.success, true, `Rapid login attempt ${i + 1} must succeed`);
    }
  });

  await t.test('[RAPID ATTEMPTS] 10 rapid failed logins remain stable', async () => {
    const results = [];
    for (let i = 0; i < 10; i++) {
      const res = await authController.loginDirect({ username: 'admin', password: `WrongPass${i}@E2E!` });
      results.push(res);
    }
    assert.strictEqual(results.length, 10);
    for (const r of results) {
      assert.strictEqual(r.success, false);
    }
    // Verify service still works correctly
    const valid = await authController.loginDirect({ username: 'admin', password: 'Admin@12345' });
    assert.strictEqual(valid.success, true, 'Valid login must succeed after rapid failures');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SCENARIO: Session Restore (rememberMe)
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[SESSION RESTORE] rememberMe=true persists session across memory loss', async () => {
    sessionService.destroySession();

    await authController.loginDirect(
      { username: 'admin', password: 'Admin@12345', rememberMe: true },
      { ipAddress: '127.0.0.1' }
    );

    // Simulate in-memory loss
    sessionService.currentSession = null;
    sessionService.stopSessionTimeoutMonitor();

    // Restore from store
    const restored = sessionService.restoreSession();
    assert.ok(restored,                             'Session must restore from electron-store');
    assert.strictEqual(restored.user.username, 'admin');
    assert.strictEqual(restored.rememberMe, true);

    sessionService.destroySession();
  });

  await t.test('[SESSION RESTORE] rememberMe=false does NOT persist session', async () => {
    sessionService.destroySession();

    await authController.loginDirect(
      { username: 'admin', password: 'Admin@12345', rememberMe: false },
      { ipAddress: '127.0.0.1' }
    );

    // Simulate memory loss
    sessionService.currentSession = null;
    sessionService.stopSessionTimeoutMonitor();

    const restored = sessionService.restoreSession();
    assert.strictEqual(restored, null, 'Session must NOT restore when rememberMe=false');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SCENARIO: Database Restart (Application Restart Simulation)
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[DB RESTART] Database re-initializes cleanly after close', () => {
    sessionService.destroySession();
    dbService.close();

    const db = dbService.initialize();
    assert.ok(db, 'Database must re-initialize after close (application restart)');

    const admin = db.prepare("SELECT * FROM users WHERE username='admin'").get();
    assert.ok(admin, 'Admin user must persist across DB restart');
    assert.strictEqual(admin.status, 'ACTIVE');
  });

  await t.test('[DB RESTART] Auth flow works normally after DB restart', async () => {
    const result = await authController.loginDirect({ username: 'admin', password: 'Admin@12345' });
    assert.strictEqual(result.success, true, 'Login must work after DB restart');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Error Scenario: Non-existent User
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[ERROR] Non-existent username returns generic error', async () => {
    const result = await authController.loginDirect({
      username: 'totally_unknown_user_e2e',
      password: 'Any@Password1',
    });
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, 'Invalid username or password.',
      'Must use generic message — never disclose whether user exists');
    assert.strictEqual(result.user, undefined);
  });

  await t.test('[ERROR] Whitespace-only username is rejected', async () => {
    const result = await authController.loginDirect({ username: '   ', password: 'Admin@12345' });
    assert.strictEqual(result.success, false);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Security: Information Disclosure Prevention
  // ═══════════════════════════════════════════════════════════════════════════

  await t.test('[SECURITY] Error messages never disclose whether username is valid', async () => {
    const withBadUser = await authController.loginDirect({ username: 'ghost_xyz', password: 'Admin@12345' });
    const withBadPass = await authController.loginDirect({ username: 'admin',     password: 'BadPass!99'  });

    // Both must use the EXACT same message
    assert.strictEqual(withBadUser.message, withBadPass.message,
      'Error messages must be identical regardless of which credential is wrong');
    assert.strictEqual(withBadUser.message, 'Invalid username or password.');
  });

  await t.test('[SECURITY] Error messages never disclose account status (suspended vs active)', async () => {
    const withSuspended = await authController.loginDirect({ username: 'e2e_suspended', password: 'Suspended@E2E1' });
    const withBadPass   = await authController.loginDirect({ username: 'admin',         password: 'WrongPass@99'   });

    assert.strictEqual(withSuspended.message, withBadPass.message,
      'Suspended account error must be identical to invalid password error');
  });

  await t.test('[SECURITY] Password hash is never returned in login response', async () => {
    const result = await authController.loginDirect({ username: 'admin', password: 'Admin@12345' });
    assert.ok(result.success);

    const userObj = JSON.stringify(result);
    assert.ok(!userObj.includes('password_hash'), 'password_hash must never appear in login response');
    assert.ok(!userObj.includes('$2b$'),           'bcrypt hash prefix must never appear in login response');
  });
});
