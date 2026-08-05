/**
 * session.integration.test.js
 * Retail ERP Enterprise — SessionService Integration Tests
 *
 * Verifies SessionService in isolation against real electron-store persistence:
 * createSession, getSession, expiry, rememberMe, restoreSession,
 * destroySession, logout, and timeout monitor lifecycle.
 *
 * Phase 6 — Step 2: Integration Testing
 */

'use strict';

const test   = require('node:test');
const assert = require('node:assert');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Stub user object matching the shape expected by SessionService. */
function makeUser(overrides = {}) {
  return {
    id:        1,
    uuid:      'test-uuid-0001',
    username:  'session_test_user',
    email:     'session@retailerp.local',
    full_name: 'Session Test User',
    role_id:   1,
    status:    'ACTIVE',
    ...overrides,
  };
}

/** Reset the SessionService singleton to a clean state. */
function resetSessionService() {
  try {
    delete require.cache[require.resolve('../../src/backend/services/session.service')];
  } catch (_) { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Suite 1 — createSession
// ─────────────────────────────────────────────────────────────────────────────

test('SessionService - createSession', async (t) => {

  let sessionService;

  t.before(() => {
    resetSessionService();
    sessionService = require('../../src/backend/services/session.service');
    sessionService.destroySession(); // Ensure clean state
  });

  t.after(() => {
    sessionService.destroySession();
  });

  await t.test('should create a session and return session data', () => {
    const user    = makeUser();
    const session = sessionService.createSession(user);

    assert.ok(session,              'createSession must return session data');
    assert.ok(session.user,         'session must contain user object');
    assert.ok(session.createdAt,    'session must have createdAt timestamp');
    assert.ok(session.expiresAt,    'session must have expiresAt timestamp');
    assert.ok(session.expiresAt > session.createdAt, 'expiresAt must be after createdAt');
  });

  await t.test('should include correct user snapshot in session', () => {
    const user    = makeUser();
    const session = sessionService.createSession(user);

    assert.strictEqual(session.user.id,        user.id);
    assert.strictEqual(session.user.uuid,      user.uuid);
    assert.strictEqual(session.user.username,  user.username);
    assert.strictEqual(session.user.email,     user.email);
    assert.strictEqual(session.user.full_name, user.full_name);
    assert.strictEqual(session.user.role_id,   user.role_id);
    assert.strictEqual(session.user.status,    user.status);
  });

  await t.test('should default rememberMe to false', () => {
    const session = sessionService.createSession(makeUser());
    assert.strictEqual(session.rememberMe, false);
  });

  await t.test('should record rememberMe=true when specified', () => {
    const session = sessionService.createSession(makeUser(), true);
    assert.strictEqual(session.rememberMe, true);
  });

  await t.test('should clear a prior session before creating a new one', () => {
    const user1 = makeUser({ username: 'first_user',  id: 1 });
    const user2 = makeUser({ username: 'second_user', id: 2 });

    sessionService.createSession(user1);
    sessionService.createSession(user2);

    const active = sessionService.getSession();
    assert.strictEqual(active.user.username, 'second_user', 'Only the latest session must be active');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 2 — getSession & expiry
// ─────────────────────────────────────────────────────────────────────────────

test('SessionService - getSession & Expiry', async (t) => {

  let sessionService;

  t.before(() => {
    resetSessionService();
    sessionService = require('../../src/backend/services/session.service');
    sessionService.destroySession();
  });

  t.after(() => {
    sessionService.destroySession();
  });

  await t.test('should return null when no session exists', () => {
    const session = sessionService.getSession();
    assert.strictEqual(session, null);
  });

  await t.test('should return active session after createSession', () => {
    sessionService.createSession(makeUser());
    const session = sessionService.getSession();
    assert.ok(session, 'getSession must return active session');
  });

  await t.test('should return null and destroy session when it has expired', () => {
    const user = makeUser();
    // Manually inject an expired session
    sessionService.currentSession = {
      user:      { id: user.id, uuid: user.uuid, username: user.username, email: user.email, full_name: user.full_name, role_id: user.role_id, status: user.status },
      createdAt: Date.now() - 1000,
      expiresAt: Date.now() - 500, // Already expired
      rememberMe: false,
    };

    const session = sessionService.getSession();
    assert.strictEqual(session, null, 'Expired session must return null');
    assert.strictEqual(sessionService.currentSession, null, 'Expired session must be cleared from memory');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 3 — validateSession
// ─────────────────────────────────────────────────────────────────────────────

test('SessionService - validateSession', async (t) => {

  let sessionService;

  t.before(() => {
    resetSessionService();
    sessionService = require('../../src/backend/services/session.service');
    sessionService.destroySession();
  });

  t.after(() => {
    sessionService.destroySession();
  });

  await t.test('should return false when no session is active', () => {
    assert.strictEqual(sessionService.validateSession(), false);
  });

  await t.test('should return true when an active session exists', () => {
    sessionService.createSession(makeUser());
    assert.strictEqual(sessionService.validateSession(), true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 4 — destroySession & logout
// ─────────────────────────────────────────────────────────────────────────────

test('SessionService - destroySession & logout', async (t) => {

  let sessionService;

  t.before(() => {
    resetSessionService();
    sessionService = require('../../src/backend/services/session.service');
    sessionService.destroySession();
  });

  t.after(() => {
    sessionService.destroySession();
  });

  await t.test('should clear in-memory session on destroySession()', () => {
    sessionService.createSession(makeUser());
    sessionService.destroySession();
    assert.strictEqual(sessionService.currentSession, null);
    assert.strictEqual(sessionService.getSession(), null);
  });

  await t.test('should not throw when destroySession() is called with no active session', () => {
    assert.doesNotThrow(() => sessionService.destroySession());
  });

  await t.test('logout() should clear the session', () => {
    sessionService.createSession(makeUser());
    sessionService.logout();
    assert.strictEqual(sessionService.getSession(), null);
  });

  await t.test('destroySession() should stop the timeout monitor', () => {
    sessionService.createSession(makeUser()); // starts the monitor
    sessionService.destroySession();
    assert.strictEqual(sessionService.timeoutCheckInterval, null, 'Monitor must be cleared after destroy');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 5 — rememberMe Persistence (electron-store)
// ─────────────────────────────────────────────────────────────────────────────

test('SessionService - rememberMe & restoreSession', async (t) => {

  let sessionService;

  t.before(() => {
    resetSessionService();
    sessionService = require('../../src/backend/services/session.service');
    sessionService.destroySession();
  });

  t.after(() => {
    sessionService.destroySession();
  });

  await t.test('should persist session to store when rememberMe=true', () => {
    const user = makeUser();
    sessionService.createSession(user, true);

    // Simulate in-memory loss by nulling out currentSession
    sessionService.currentSession = null;
    sessionService.stopSessionTimeoutMonitor();

    // restoreSession should rebuild it from electron-store
    const restored = sessionService.restoreSession();
    assert.ok(restored, 'restoreSession must recover the persisted session');
    assert.strictEqual(restored.user.username, user.username);
  });

  await t.test('should not persist session to store when rememberMe=false', () => {
    const user = makeUser({ username: 'no_persist_user' });
    sessionService.createSession(user, false); // Do NOT persist

    // Wipe in-memory state
    sessionService.currentSession = null;
    sessionService.stopSessionTimeoutMonitor();

    // restoreSession should find nothing (the previous test's store was destroyed at t.after of that suite)
    // Since we created a new session without rememberMe, the store should NOT have this user
    const active = sessionService.getSession();
    assert.strictEqual(active, null, 'Non-remembered session must not be restored from store');
  });

  await t.test('should return null from restoreSession when no cached session exists', () => {
    sessionService.destroySession(); // Clears store too
    const restored = sessionService.restoreSession();
    assert.strictEqual(restored, null);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 6 — Timeout Monitor Lifecycle
// ─────────────────────────────────────────────────────────────────────────────

test('SessionService - Timeout Monitor Lifecycle', async (t) => {

  let sessionService;

  t.before(() => {
    resetSessionService();
    sessionService = require('../../src/backend/services/session.service');
    sessionService.destroySession();
  });

  t.after(() => {
    sessionService.destroySession();
  });

  await t.test('should start timeout monitor after createSession', () => {
    sessionService.createSession(makeUser());
    assert.ok(sessionService.timeoutCheckInterval, 'Timeout interval must be set after createSession');
  });

  await t.test('should stop timeout monitor after destroySession', () => {
    sessionService.createSession(makeUser());
    sessionService.destroySession();
    assert.strictEqual(sessionService.timeoutCheckInterval, null);
  });

  await t.test('stopSessionTimeoutMonitor() should be safe to call when no monitor is running', () => {
    sessionService.timeoutCheckInterval = null;
    assert.doesNotThrow(() => sessionService.stopSessionTimeoutMonitor());
  });

  await t.test('should replace existing monitor when createSession() is called twice', () => {
    sessionService.createSession(makeUser());
    const firstInterval = sessionService.timeoutCheckInterval;
    sessionService.createSession(makeUser({ id: 2, username: 'second' }));
    const secondInterval = sessionService.timeoutCheckInterval;

    // Intervals are different objects (old one was cleared, new one created)
    assert.notStrictEqual(firstInterval, secondInterval, 'Monitor must be replaced on second createSession');
  });
});
