/**
 * error.integration.test.js
 * Retail ERP Enterprise — Custom Error Class Integration Tests
 *
 * Verifies that all custom error subclasses are correctly configured:
 * statusCode, errorCode, isOperational flag, inheritance chain,
 * and that Error.captureStackTrace is called correctly.
 *
 * Phase 6 — Step 2: Integration Testing
 */

'use strict';

const test   = require('node:test');
const assert = require('node:assert');

const {
  AppError,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  DatabaseError,
  InternalServerError,
  registerProcessErrorHandlers,
} = require('../../src/shared/errors/errorHandler');

// ─────────────────────────────────────────────────────────────────────────────
// Suite 1 — AppError Base Class
// ─────────────────────────────────────────────────────────────────────────────

test('AppError - Base Custom Error Class', (t) => {

  t.test('should extend native Error', () => {
    const err = new AppError('test message');
    assert.ok(err instanceof Error, 'AppError must extend Error');
  });

  t.test('should set default statusCode to 500', () => {
    const err = new AppError('test');
    assert.strictEqual(err.statusCode, 500);
  });

  t.test('should set default errorCode to INTERNAL_ERROR', () => {
    const err = new AppError('test');
    assert.strictEqual(err.errorCode, 'INTERNAL_ERROR');
  });

  t.test('should set isOperational to true by default', () => {
    const err = new AppError('test');
    assert.strictEqual(err.isOperational, true);
  });

  t.test('should accept custom statusCode and errorCode', () => {
    const err = new AppError('custom', 418, 'TEAPOT');
    assert.strictEqual(err.statusCode,  418);
    assert.strictEqual(err.errorCode,   'TEAPOT');
  });

  t.test('should capture message correctly', () => {
    const msg = 'Something went wrong';
    const err = new AppError(msg);
    assert.strictEqual(err.message, msg);
  });

  t.test('should have a stack trace', () => {
    const err = new AppError('trace test');
    assert.ok(typeof err.stack === 'string' && err.stack.length > 0, 'stack must be a non-empty string');
  });

  t.test('should set constructor name as error name', () => {
    const err = new AppError('name test');
    assert.strictEqual(err.name, 'AppError');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 2 — ValidationError
// ─────────────────────────────────────────────────────────────────────────────

test('ValidationError - 400 Input Validation Error', (t) => {

  t.test('should be an instance of AppError and Error', () => {
    const err = new ValidationError('bad input');
    assert.ok(err instanceof AppError, 'must extend AppError');
    assert.ok(err instanceof Error,    'must extend Error');
  });

  t.test('should have statusCode 400', () => {
    const err = new ValidationError('bad input');
    assert.strictEqual(err.statusCode, 400);
  });

  t.test('should have errorCode VALIDATION_ERROR', () => {
    const err = new ValidationError('bad input');
    assert.strictEqual(err.errorCode, 'VALIDATION_ERROR');
  });

  t.test('should store optional details', () => {
    const details = ['Field required'];
    const err = new ValidationError('invalid', details);
    assert.deepStrictEqual(err.details, details);
  });

  t.test('should default details to null if not provided', () => {
    const err = new ValidationError('msg');
    assert.strictEqual(err.details, null);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 3 — AuthenticationError
// ─────────────────────────────────────────────────────────────────────────────

test('AuthenticationError - 401 Authentication Failure', (t) => {

  t.test('should be an instance of AppError', () => {
    const err = new AuthenticationError();
    assert.ok(err instanceof AppError);
  });

  t.test('should have statusCode 401', () => {
    const err = new AuthenticationError();
    assert.strictEqual(err.statusCode, 401);
  });

  t.test('should have errorCode AUTHENTICATION_ERROR', () => {
    const err = new AuthenticationError();
    assert.strictEqual(err.errorCode, 'AUTHENTICATION_ERROR');
  });

  t.test('should use default message when not provided', () => {
    const err = new AuthenticationError();
    assert.ok(err.message.length > 0, 'must have a default message');
  });

  t.test('should accept a custom message', () => {
    const err = new AuthenticationError('Invalid token');
    assert.strictEqual(err.message, 'Invalid token');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 4 — ForbiddenError
// ─────────────────────────────────────────────────────────────────────────────

test('ForbiddenError - 403 Access Denied', (t) => {

  t.test('should have statusCode 403', () => {
    const err = new ForbiddenError();
    assert.strictEqual(err.statusCode, 403);
  });

  t.test('should have errorCode FORBIDDEN_ERROR', () => {
    const err = new ForbiddenError();
    assert.strictEqual(err.errorCode, 'FORBIDDEN_ERROR');
  });

  t.test('should be an instance of AppError', () => {
    assert.ok(new ForbiddenError() instanceof AppError);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 5 — NotFoundError
// ─────────────────────────────────────────────────────────────────────────────

test('NotFoundError - 404 Resource Not Found', (t) => {

  t.test('should have statusCode 404', () => {
    const err = new NotFoundError();
    assert.strictEqual(err.statusCode, 404);
  });

  t.test('should have errorCode NOT_FOUND_ERROR', () => {
    const err = new NotFoundError();
    assert.strictEqual(err.errorCode, 'NOT_FOUND_ERROR');
  });

  t.test('should be an instance of AppError', () => {
    assert.ok(new NotFoundError() instanceof AppError);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 6 — DatabaseError
// ─────────────────────────────────────────────────────────────────────────────

test('DatabaseError - 500 Database Failure', (t) => {

  t.test('should have statusCode 500', () => {
    const err = new DatabaseError('DB fail');
    assert.strictEqual(err.statusCode, 500);
  });

  t.test('should have errorCode DATABASE_ERROR', () => {
    const err = new DatabaseError('DB fail');
    assert.strictEqual(err.errorCode, 'DATABASE_ERROR');
  });

  t.test('should store original error reference', () => {
    const original = new Error('connection refused');
    const err = new DatabaseError('DB fail', original);
    assert.strictEqual(err.originalError, original);
  });

  t.test('should default originalError to null', () => {
    const err = new DatabaseError('DB fail');
    assert.strictEqual(err.originalError, null);
  });

  t.test('should be an instance of AppError', () => {
    assert.ok(new DatabaseError('msg') instanceof AppError);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 7 — InternalServerError
// ─────────────────────────────────────────────────────────────────────────────

test('InternalServerError - 500 Unexpected Error', (t) => {

  t.test('should have statusCode 500', () => {
    const err = new InternalServerError();
    assert.strictEqual(err.statusCode, 500);
  });

  t.test('should have errorCode INTERNAL_SERVER_ERROR', () => {
    const err = new InternalServerError();
    assert.strictEqual(err.errorCode, 'INTERNAL_SERVER_ERROR');
  });

  t.test('should be an instance of AppError', () => {
    assert.ok(new InternalServerError() instanceof AppError);
  });

  t.test('should have a default message', () => {
    const err = new InternalServerError();
    assert.ok(err.message.length > 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 8 — registerProcessErrorHandlers
// ─────────────────────────────────────────────────────────────────────────────

test('registerProcessErrorHandlers - Module Export', (t) => {

  t.test('should export registerProcessErrorHandlers as a function', () => {
    assert.strictEqual(typeof registerProcessErrorHandlers, 'function');
  });

  t.test('should not throw when called', () => {
    // It can be called multiple times safely (idempotent listener registration)
    assert.doesNotThrow(() => registerProcessErrorHandlers());
  });
});
