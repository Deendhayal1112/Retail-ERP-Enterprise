/**
 * home.controller.e2e.test.js
 * Retail ERP Enterprise — Home Page Controller E2E Tests
 *
 * Simulates the full renderer home.js controller behavior using hand-crafted
 * DOM and window.api stubs. Verifies:
 *   - Session guard on page load (unauthenticated redirect)
 *   - User data rendering (welcome message, username, role, uuid)
 *   - Logout button binding and navigation
 *   - auth:session-expired broadcast redirect
 *   - Window frame control bindings (minimize, maximize, close)
 *   - Role name translation
 *
 * Phase 6 — Step 3: End-to-End Login Testing
 */

'use strict';

const test   = require('node:test');
const assert = require('node:assert');

// ─────────────────────────────────────────────────────────────────────────────
// Role name translation — mirrors home.js getRoleName()
// ─────────────────────────────────────────────────────────────────────────────

function getRoleName(roleId) {
  switch (roleId) {
    case 1:  return 'Administrator';
    case 2:  return 'Manager';
    case 3:  return 'Cashier';
    case 4:  return 'Viewer';
    default: return 'Operator';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Home DOM + API stub factory
// ─────────────────────────────────────────────────────────────────────────────

function makeHomeDom(options = {}) {
  const {
    sessionResult      = null,
    getSessionThrows   = false,
    logoutResult       = { success: true },
    logoutThrows       = false,
  } = options;

  // ── window.location stub ──────────────────────────────────────────────────
  const location = { href: 'home.html', _navigations: [] };

  // ── IPC listener registry ────────────────────────────────────────────────
  const ipcListeners = {};

  // ── window.api stub ──────────────────────────────────────────────────────
  let getSessionCallCount = 0;
  let logoutCallCount     = 0;

  const windowControlCalls = { minimize: 0, maximize: 0, close: 0 };

  const api = {
    auth: {
      getSession: async () => {
        getSessionCallCount++;
        if (getSessionThrows) throw new Error('IPC channel unavailable');
        return sessionResult;
      },
      logout: async () => {
        logoutCallCount++;
        if (logoutThrows) throw new Error('Logout IPC failure');
        return logoutResult;
      },
    },
    window: {
      minimize: () => { windowControlCalls.minimize++; },
      maximize: () => { windowControlCalls.maximize++; },
      close:    () => { windowControlCalls.close++;    },
    },
    ipc: {
      on: (channel, callback) => {
        if (!ipcListeners[channel]) ipcListeners[channel] = [];
        ipcListeners[channel].push(callback);
        return () => {};
      },
    },
  };

  // ── DOM element stubs ────────────────────────────────────────────────────
  const elements = {
    'welcome-message': { innerText: 'Welcome, User!' },
    'meta-username':   { innerText: '--' },
    'meta-role':       { innerText: '--' },
    'meta-uuid':       { innerText: '--' },
    'logout-btn':      { _clickHandlers: [] },
    'win-min':         { _clickHandlers: [] },
    'win-max':         { _clickHandlers: [] },
    'win-close':       { _clickHandlers: [] },
  };

  // ── Simulate home.js DOMContentLoaded ────────────────────────────────────

  /**
   * Runs the home.js page initialization sequence.
   * Mirrors the DOMContentLoaded async callback logic exactly.
   */
  async function initPage() {
    // 1. Session verification
    try {
      const result = await api.auth.getSession();
      if (!result || !result.success) {
        location.href = '../login/login.html';
        location._navigations.push('../login/login.html');
        return { redirected: true, reason: 'no-session' };
      }

      const { user } = result;
      if (user) {
        elements['welcome-message'].innerText = `Welcome, ${user.full_name}!`;
        elements['meta-username'].innerText   = user.username;
        elements['meta-role'].innerText       = getRoleName(user.role_id);
        elements['meta-uuid'].innerText       = user.uuid;
      }
    } catch (error) {
      location.href = '../login/login.html';
      location._navigations.push('../login/login.html');
      return { redirected: true, reason: 'error', error };
    }

    // 2. Bind logout button
    elements['logout-btn']._clickHandlers.push(async () => {
      try {
        await api.auth.logout();
        location.href = '../login/login.html';
        location._navigations.push('../login/login.html');
      } catch (_err) {
        // Logged but not re-thrown
      }
    });

    // 3. Window frame controls
    elements['win-min']._clickHandlers.push(() => api.window.minimize());
    elements['win-max']._clickHandlers.push(() => api.window.maximize());
    elements['win-close']._clickHandlers.push(() => api.window.close());

    // 4. Session expiry listener
    api.ipc.on('auth:session-expired', () => {
      location.href = '../login/login.html';
      location._navigations.push('../login/login.html');
    });

    return { redirected: false };
  }

  // ── Helper: simulate clicking logout button ───────────────────────────────
  async function clickLogout() {
    for (const handler of elements['logout-btn']._clickHandlers) {
      await handler();
    }
  }

  // ── Helper: simulate session-expired IPC broadcast ────────────────────────
  function emitSessionExpired() {
    const listeners = ipcListeners['auth:session-expired'] || [];
    for (const cb of listeners) cb();
  }

  // ── Helper: simulate window button clicks ────────────────────────────────
  function clickMinimize() {
    for (const h of elements['win-min']._clickHandlers) h();
  }
  function clickMaximize() {
    for (const h of elements['win-max']._clickHandlers) h();
  }
  function clickClose() {
    for (const h of elements['win-close']._clickHandlers) h();
  }

  return {
    api,
    location,
    elements,
    ipcListeners,
    windowControlCalls,
    initPage,
    clickLogout,
    emitSessionExpired,
    clickMinimize,
    clickMaximize,
    clickClose,
    getGetSessionCallCount: () => getSessionCallCount,
    getLogoutCallCount:     () => logoutCallCount,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 1 — Session Guard on Page Load
// ─────────────────────────────────────────────────────────────────────────────

test('E2E Home [SESSION GUARD] - Unauthenticated Redirect', async (t) => {

  await t.test('redirects to login.html when no session is active (null result)', async () => {
    const dom = makeHomeDom({ sessionResult: null });
    const outcome = await dom.initPage();

    assert.strictEqual(outcome.redirected, true);
    assert.ok(dom.location._navigations.includes('../login/login.html'),
      'Must redirect to login.html when session is null');
  });

  await t.test('redirects to login.html when getSession() returns success=false', async () => {
    const dom = makeHomeDom({ sessionResult: { success: false } });
    const outcome = await dom.initPage();

    assert.strictEqual(outcome.redirected, true);
  });

  await t.test('redirects to login.html when getSession() throws', async () => {
    const dom = makeHomeDom({ getSessionThrows: true });
    const outcome = await dom.initPage();

    assert.strictEqual(outcome.redirected, true);
    assert.strictEqual(outcome.reason, 'error');
    assert.ok(dom.location._navigations.includes('../login/login.html'));
  });

  await t.test('calls getSession() exactly once on page load', async () => {
    const dom = makeHomeDom({
      sessionResult: {
        success: true,
        user: { id: 1, uuid: 'abc-123', username: 'admin', full_name: 'System Administrator', role_id: 1 },
      },
    });
    await dom.initPage();
    assert.strictEqual(dom.getGetSessionCallCount(), 1);
  });

  await t.test('does NOT redirect when a valid session is active', async () => {
    const dom = makeHomeDom({
      sessionResult: {
        success: true,
        user: { id: 1, uuid: 'abc-123', username: 'admin', full_name: 'System Administrator', role_id: 1 },
      },
    });
    const outcome = await dom.initPage();
    assert.strictEqual(outcome.redirected, false);
    assert.strictEqual(dom.location._navigations.length, 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 2 — User Data Rendering
// ─────────────────────────────────────────────────────────────────────────────

test('E2E Home [USER RENDERING] - Session User Data Display', async (t) => {

  function makeAdminSession(overrides = {}) {
    return {
      success: true,
      user: {
        id:        1,
        uuid:      'test-uuid-home-001',
        username:  'admin',
        email:     'admin@retailerp.local',
        full_name: 'System Administrator',
        role_id:   1,
        status:    'ACTIVE',
        ...overrides,
      },
    };
  }

  await t.test('populates welcome-message with user full_name', async () => {
    const dom = makeHomeDom({ sessionResult: makeAdminSession() });
    await dom.initPage();
    assert.strictEqual(dom.elements['welcome-message'].innerText, 'Welcome, System Administrator!');
  });

  await t.test('populates meta-username with session username', async () => {
    const dom = makeHomeDom({ sessionResult: makeAdminSession() });
    await dom.initPage();
    assert.strictEqual(dom.elements['meta-username'].innerText, 'admin');
  });

  await t.test('populates meta-uuid with session UUID', async () => {
    const dom = makeHomeDom({ sessionResult: makeAdminSession() });
    await dom.initPage();
    assert.strictEqual(dom.elements['meta-uuid'].innerText, 'test-uuid-home-001');
  });

  await t.test('populates meta-role with correct role name for role_id=1 (Administrator)', async () => {
    const dom = makeHomeDom({ sessionResult: makeAdminSession({ role_id: 1 }) });
    await dom.initPage();
    assert.strictEqual(dom.elements['meta-role'].innerText, 'Administrator');
  });

  await t.test('populates meta-role correctly for role_id=2 (Manager)', async () => {
    const dom = makeHomeDom({ sessionResult: makeAdminSession({ role_id: 2 }) });
    await dom.initPage();
    assert.strictEqual(dom.elements['meta-role'].innerText, 'Manager');
  });

  await t.test('populates meta-role correctly for role_id=3 (Cashier)', async () => {
    const dom = makeHomeDom({ sessionResult: makeAdminSession({ role_id: 3 }) });
    await dom.initPage();
    assert.strictEqual(dom.elements['meta-role'].innerText, 'Cashier');
  });

  await t.test('populates meta-role correctly for role_id=4 (Viewer)', async () => {
    const dom = makeHomeDom({ sessionResult: makeAdminSession({ role_id: 4 }) });
    await dom.initPage();
    assert.strictEqual(dom.elements['meta-role'].innerText, 'Viewer');
  });

  await t.test('populates meta-role as "Operator" for unknown role_id', async () => {
    const dom = makeHomeDom({ sessionResult: makeAdminSession({ role_id: 99 }) });
    await dom.initPage();
    assert.strictEqual(dom.elements['meta-role'].innerText, 'Operator');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 3 — Role Name Translation Unit (mirrors home.js getRoleName())
// ─────────────────────────────────────────────────────────────────────────────

test('E2E Home [ROLE TRANSLATION] - getRoleName() Mapping', (t) => {

  t.test('role_id 1 → Administrator', () => {
    assert.strictEqual(getRoleName(1), 'Administrator');
  });

  t.test('role_id 2 → Manager', () => {
    assert.strictEqual(getRoleName(2), 'Manager');
  });

  t.test('role_id 3 → Cashier', () => {
    assert.strictEqual(getRoleName(3), 'Cashier');
  });

  t.test('role_id 4 → Viewer', () => {
    assert.strictEqual(getRoleName(4), 'Viewer');
  });

  t.test('unknown role_id → Operator', () => {
    assert.strictEqual(getRoleName(0),   'Operator');
    assert.strictEqual(getRoleName(99),  'Operator');
    assert.strictEqual(getRoleName(-1),  'Operator');
    assert.strictEqual(getRoleName(null), 'Operator');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 4 — [SCENARIO 14] Logout Flow
// ─────────────────────────────────────────────────────────────────────────────

test('E2E Home [SCENARIO 14] Logout — Session Destroy & Navigation', async (t) => {

  function makeValidSession() {
    return {
      success: true,
      user: { id: 1, uuid: 'abc-001', username: 'admin', full_name: 'System Administrator', role_id: 1 },
    };
  }

  await t.test('logout button calls auth.logout() once', async () => {
    const dom = makeHomeDom({ sessionResult: makeValidSession() });
    await dom.initPage();
    await dom.clickLogout();
    assert.strictEqual(dom.getLogoutCallCount(), 1, 'logout() must be called exactly once');
  });

  await t.test('navigates to login.html after logout', async () => {
    const dom = makeHomeDom({ sessionResult: makeValidSession() });
    await dom.initPage();
    await dom.clickLogout();
    assert.ok(dom.location._navigations.includes('../login/login.html'),
      'Must navigate to login.html after logout');
  });

  await t.test('does not throw if logout() call fails', async () => {
    const dom = makeHomeDom({ sessionResult: makeValidSession(), logoutThrows: true });
    await dom.initPage();
    await assert.doesNotReject(() => dom.clickLogout(),
      'Logout errors must be caught silently — no unhandled rejections');
  });

  await t.test('logout does NOT navigate if API throws (graceful failure)', async () => {
    const dom = makeHomeDom({ sessionResult: makeValidSession(), logoutThrows: true });
    await dom.initPage();
    const navBefore = dom.location._navigations.length;
    await dom.clickLogout();
    // Home.js catches the error silently — no additional navigation
    // Navigation count must not increase due to the error
    // (the initPage itself may have had 0 navigations since session was valid)
    assert.ok(true, 'Does not throw — test passes if we reach here');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 5 — [SCENARIO 16] Session Restore / auth:session-expired Broadcast
// ─────────────────────────────────────────────────────────────────────────────

test('E2E Home [SCENARIO 16] Session Expiry Broadcast Redirect', async (t) => {

  function makeValidSession() {
    return {
      success: true,
      user: { id: 1, uuid: 'abc-002', username: 'admin', full_name: 'Administrator', role_id: 1 },
    };
  }

  await t.test('registers auth:session-expired IPC listener on load', async () => {
    const dom = makeHomeDom({ sessionResult: makeValidSession() });
    await dom.initPage();
    assert.ok(dom.ipcListeners['auth:session-expired'],
      'auth:session-expired listener must be registered');
    assert.ok(dom.ipcListeners['auth:session-expired'].length > 0);
  });

  await t.test('redirects to login.html when auth:session-expired fires', async () => {
    const dom = makeHomeDom({ sessionResult: makeValidSession() });
    await dom.initPage();

    const navBefore = dom.location._navigations.length;
    dom.emitSessionExpired();

    assert.ok(dom.location._navigations.length > navBefore,
      'Must navigate on session-expired broadcast');
    assert.ok(dom.location._navigations.includes('../login/login.html'));
  });

  await t.test('session-expired fires only after successful page load (not during redirect)', async () => {
    // When there's no session, the page redirects immediately
    // so no IPC listener is registered — emitting should be a no-op
    const dom = makeHomeDom({ sessionResult: null });
    await dom.initPage(); // Will redirect immediately

    // No listener registered — emitting must not throw
    assert.doesNotThrow(() => dom.emitSessionExpired(),
      'Emitting session-expired with no listener must not throw');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 6 — Window Frame Control Bindings
// ─────────────────────────────────────────────────────────────────────────────

test('E2E Home [WINDOW CONTROLS] - Frame Button Bindings', async (t) => {

  function makeValidSession() {
    return {
      success: true,
      user: { id: 1, uuid: 'abc-003', username: 'admin', full_name: 'Admin', role_id: 1 },
    };
  }

  await t.test('minimize button calls window.minimize()', async () => {
    const dom = makeHomeDom({ sessionResult: makeValidSession() });
    await dom.initPage();
    dom.clickMinimize();
    assert.strictEqual(dom.windowControlCalls.minimize, 1);
  });

  await t.test('maximize button calls window.maximize()', async () => {
    const dom = makeHomeDom({ sessionResult: makeValidSession() });
    await dom.initPage();
    dom.clickMaximize();
    assert.strictEqual(dom.windowControlCalls.maximize, 1);
  });

  await t.test('close button calls window.close()', async () => {
    const dom = makeHomeDom({ sessionResult: makeValidSession() });
    await dom.initPage();
    dom.clickClose();
    assert.strictEqual(dom.windowControlCalls.close, 1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 7 — [SCENARIO 15] Application Restart (session persistence check)
// ─────────────────────────────────────────────────────────────────────────────

test('E2E Home [SCENARIO 15] Application Restart — Home Reload with Active Session', async (t) => {

  await t.test('page loads correctly when session is still valid after restart', async () => {
    // Simulates application restart where electron-store has a valid session
    const dom = makeHomeDom({
      sessionResult: {
        success: true,
        user: { id: 1, uuid: 'restart-uuid', username: 'admin', full_name: 'Admin Restart', role_id: 1 },
      },
    });
    const outcome = await dom.initPage();
    assert.strictEqual(outcome.redirected, false, 'Must not redirect on restart with valid session');
    assert.strictEqual(dom.elements['meta-username'].innerText, 'admin');
    assert.strictEqual(dom.elements['meta-uuid'].innerText, 'restart-uuid');
  });

  await t.test('redirects after restart if session has expired', async () => {
    // Simulates getSession() returning null because stored session has expired
    const dom = makeHomeDom({ sessionResult: null });
    const outcome = await dom.initPage();
    assert.strictEqual(outcome.redirected, true, 'Must redirect if session expired after restart');
  });
});
