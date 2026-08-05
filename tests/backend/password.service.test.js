/**
 * password.service.test.js
 * Retail ERP Enterprise — Password Service Unit Tests
 *
 * Phase 6 — Step 1: Unit Testing & Code Quality
 */

'use strict';

const test = require('node:test');
const assert = require('node:assert');
const passwordService = require('../../src/backend/services/password.service');

test('Password Service - Hashing & Verification', async (t) => {
  await t.test('should successfully hash and verify a valid password', async () => {
    const password = 'SecurePassword@123!';
    const hash = await passwordService.hashPassword(password);
    
    assert.ok(hash, 'Hash should not be empty');
    assert.ok(hash.startsWith('$2b$'), 'Hash should be a bcrypt formatted string');
    
    const isMatch = await passwordService.verifyPassword(password, hash);
    assert.strictEqual(isMatch, true, 'Correct password should match the hash');
    
    const isWrongMatch = await passwordService.verifyPassword('WrongPassword123!', hash);
    assert.strictEqual(isWrongMatch, false, 'Incorrect password should not match the hash');
  });

  await t.test('should return false if password or hash is missing', async () => {
    const isMatch1 = await passwordService.verifyPassword('', '$2b$12$somehash');
    const isMatch2 = await passwordService.verifyPassword('password', '');
    
    assert.strictEqual(isMatch1, false);
    assert.strictEqual(isMatch2, false);
  });
});

test('Password Service - Complexity Policy Validation', async (t) => {
  await t.test('should validate strong passwords successfully', () => {
    const result = passwordService.validatePasswordStrength('Admin@123!');
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.errors.length, 0);
  });

  await t.test('should reject short passwords', () => {
    const result = passwordService.validatePasswordStrength('Sh@123');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(err => err.includes('at least 8 characters')));
  });

  await t.test('should reject passwords missing uppercase letters', () => {
    const result = passwordService.validatePasswordStrength('lowercase@123');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(err => err.includes('uppercase letter')));
  });

  await t.test('should reject passwords missing lowercase letters', () => {
    const result = passwordService.validatePasswordStrength('UPPERCASE@123');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(err => err.includes('lowercase letter')));
  });

  await t.test('should reject passwords missing numbers', () => {
    const result = passwordService.validatePasswordStrength('NoNumbersHere!');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(err => err.includes('numerical digit')));
  });

  await t.test('should reject passwords missing special characters', () => {
    const result = passwordService.validatePasswordStrength('StrongPassword123');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(err => err.includes('special character')));
  });
});
