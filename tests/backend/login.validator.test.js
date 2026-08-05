/**
 * login.validator.test.js
 * Retail ERP Enterprise — Login Validator Unit Tests
 *
 * Phase 6 — Step 1: Unit Testing & Code Quality
 */

'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { validateLogin } = require('../../src/backend/validators/login.validator');

test('Login Validator - Inputs Validation Schema', async (t) => {
  await t.test('should pass with a valid payload', () => {
    const payload = { username: 'cashier_user', password: 'Password@123!' };
    const result = validateLogin(payload);
    
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.errors, undefined);
  });

  await t.test('should reject usernames that are too short', () => {
    const payload = { username: 'jo', password: 'Password@123!' };
    const result = validateLogin(payload);
    
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(err => err.includes('Username must be at least 3 characters')));
  });

  await t.test('should reject missing usernames', () => {
    const payload = { password: 'Password@123!' };
    const result = validateLogin(payload);
    
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(err => err.includes('Username is required')));
  });

  await t.test('should reject passwords that are too short', () => {
    const payload = { username: 'cashier_user', password: 'short' };
    const result = validateLogin(payload);
    
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(err => err.includes('Password must be at least 8 characters')));
  });

  await t.test('should reject missing passwords', () => {
    const payload = { username: 'cashier_user' };
    const result = validateLogin(payload);
    
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(err => err.includes('Password is required')));
  });
});
