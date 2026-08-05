/**
 * auth.service.test.js
 * Retail ERP Enterprise — Authentication Service Integration Tests
 *
 * Phase 6 — Step 1: Unit Testing & Code Quality
 */

'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const dbConfig = require('../../src/config/database.config');
const dbService = require('../../src/backend/database');
const userRepository = require('../../src/backend/repositories/user.repository');
const authService = require('../../src/backend/services/auth.service');
const sessionService = require('../../src/backend/services/session.service');

test('Authentication Service - Credentials & Status Handlers', async (t) => {
  const dbPath = dbConfig.filePath;

  // 1. Setup Database before tests
  t.before(() => {
    dbService.close();
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    dbService.initialize();
  });

  // 2. Teardown Database after tests
  t.after(() => {
    sessionService.destroySession();
    dbService.close();
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  await t.test('should authenticate active admin with correct password', async () => {
    const res = await authService.login('admin', 'Admin@12345', {
      ipAddress: '127.0.0.1',
      userAgent: 'Integration Test Unit'
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.user.username, 'admin');
    assert.ok(res.session);
    assert.strictEqual(res.message, 'Login successful.');
  });

  await t.test('should refuse authentication with wrong password', async () => {
    const res = await authService.login('admin', 'WrongPass123');

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.message, 'Invalid username or password.');
    assert.strictEqual(res.user, undefined);
  });

  await t.test('should refuse authentication for non-existent users', async () => {
    const res = await authService.login('non_existent_username', 'AnyPass123');

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.message, 'Invalid username or password.');
  });

  await t.test('should refuse access to suspended users', async () => {
    // Create a suspended user directly using repository
    const bcrypt = require('bcryptjs');
    userRepository.create({
      username: 'cashier_suspended_unit',
      email: 'suspended_unit@retailerp.local',
      password_hash: bcrypt.hashSync('Suspended@123', 10),
      full_name: 'Suspended Worker',
      role_id: 3,
      status: 'SUSPENDED'
    });

    const res = await authService.login('cashier_suspended_unit', 'Suspended@123');

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.message, 'Invalid username or password.');
  });
});
