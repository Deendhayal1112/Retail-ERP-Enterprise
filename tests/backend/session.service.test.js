/**
 * session.service.test.js
 * Retail ERP Enterprise — Session Service Unit Tests
 *
 * Phase 6 — Step 1: Unit Testing & Code Quality
 */

'use strict';

const test = require('node:test');
const assert = require('node:assert');
const sessionService = require('../../src/backend/services/session.service');

test('Session Service - Lifecycles & Caching', async (t) => {
  // Ensure we start from a clean slate
  sessionService.destroySession();

  await t.test('should successfully establish in-memory session object', () => {
    const user = {
      id: 99,
      uuid: 'test-user-uuid-12345',
      username: 'tester',
      email: 'tester@retailerp.local',
      full_name: 'QA Tester',
      role_id: 2,
      status: 'ACTIVE'
    };

    const session = sessionService.createSession(user, false);
    
    assert.strictEqual(sessionService.validateSession(), true);
    const active = sessionService.getSession();
    assert.ok(active);
    assert.strictEqual(active.user.username, 'tester');
    assert.strictEqual(active.user.role_id, 2);
  });

  await t.test('should clear variables on session destruction', () => {
    sessionService.destroySession();
    assert.strictEqual(sessionService.validateSession(), false);
    assert.strictEqual(sessionService.getSession(), null);
  });

  await t.test('should restore rememberMe session after purging in-memory state', () => {
    const user = {
      id: 99,
      uuid: 'test-user-uuid-12345',
      username: 'tester',
      email: 'tester@retailerp.local',
      full_name: 'QA Tester',
      role_id: 2,
      status: 'ACTIVE'
    };

    // Create session with rememberMe active
    sessionService.createSession(user, true);

    // Simulate main process memory recycle / boot restoration by purging in-memory instance
    sessionService.currentSession = null;

    // Retrieve should restore from Persistent cache automatically
    const restored = sessionService.getSession();
    assert.ok(restored);
    assert.strictEqual(restored.user.username, 'tester');
    assert.strictEqual(sessionService.validateSession(), true);

    // Clean up
    sessionService.destroySession();
  });
});
