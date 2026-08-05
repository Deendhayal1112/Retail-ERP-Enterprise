/**
 * config.integration.test.js
 * Retail ERP Enterprise — Configuration Integration Tests
 *
 * Verifies that AppConfig validates correctly in the test environment,
 * rejects invalid APP_ENV / SERVER_PORT values, and that DatabaseConfig
 * resolves paths consistently.
 *
 * Phase 6 — Step 2: Integration Testing
 */

'use strict';

const test   = require('node:test');
const assert = require('node:assert');
const path   = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// Suite 1 — App Configuration Validation
// ─────────────────────────────────────────────────────────────────────────────

test('AppConfig - Environment & Validation', (t) => {

  t.test('should load with valid development environment', () => {
    const originalEnv = process.env.APP_ENV;
    process.env.APP_ENV = 'development';

    // Re-require to pick up new env value
    delete require.cache[require.resolve('../../src/config/app.config')];
    const appConfig = require('../../src/config/app.config');

    assert.doesNotThrow(() => appConfig.validate());
    assert.strictEqual(appConfig.app.environment, 'development');
    assert.strictEqual(appConfig.isDevelopment, true);
    assert.strictEqual(appConfig.isProduction, false);

    process.env.APP_ENV = originalEnv;
  });

  t.test('should load with valid test environment', () => {
    const originalEnv = process.env.APP_ENV;
    process.env.APP_ENV = 'test';

    delete require.cache[require.resolve('../../src/config/app.config')];
    const appConfig = require('../../src/config/app.config');

    assert.doesNotThrow(() => appConfig.validate());
    assert.strictEqual(appConfig.app.environment, 'test');

    process.env.APP_ENV = originalEnv;
  });

  t.test('should throw for an invalid APP_ENV value', () => {
    const originalEnv = process.env.APP_ENV;
    process.env.APP_ENV = 'staging'; // Not in allowed list

    delete require.cache[require.resolve('../../src/config/app.config')];
    const appConfig = require('../../src/config/app.config');

    assert.throws(
      () => appConfig.validate(),
      /Invalid APP_ENV/
    );

    process.env.APP_ENV = originalEnv;
  });

  t.test('should throw for a SERVER_PORT below valid range', () => {
    const originalPort = process.env.SERVER_PORT;
    const originalEnv  = process.env.APP_ENV;

    process.env.APP_ENV    = 'development';
    process.env.SERVER_PORT = '80'; // Below minimum 1024

    delete require.cache[require.resolve('../../src/config/app.config')];
    const appConfig = require('../../src/config/app.config');

    assert.throws(
      () => appConfig.validate(),
      /Invalid SERVER_PORT/
    );

    process.env.SERVER_PORT = originalPort;
    process.env.APP_ENV     = originalEnv;
  });

  t.test('should throw for a SERVER_PORT above valid range', () => {
    const originalPort = process.env.SERVER_PORT;
    const originalEnv  = process.env.APP_ENV;

    process.env.APP_ENV     = 'development';
    process.env.SERVER_PORT  = '99999'; // Above maximum 65535

    delete require.cache[require.resolve('../../src/config/app.config')];
    const appConfig = require('../../src/config/app.config');

    assert.throws(
      () => appConfig.validate(),
      /Invalid SERVER_PORT/
    );

    process.env.SERVER_PORT = originalPort;
    process.env.APP_ENV     = originalEnv;
  });

  t.test('should resolve app name and version from environment', () => {
    const originalName    = process.env.APP_NAME;
    const originalVersion = process.env.APP_VERSION;

    process.env.APP_NAME    = 'Test ERP';
    process.env.APP_VERSION = '9.9.9';

    delete require.cache[require.resolve('../../src/config/app.config')];
    const appConfig = require('../../src/config/app.config');

    assert.strictEqual(appConfig.app.name, 'Test ERP');
    assert.strictEqual(appConfig.app.version, '9.9.9');

    process.env.APP_NAME    = originalName;
    process.env.APP_VERSION = originalVersion;
  });

  t.test('should fall back to defaults when env vars are absent', () => {
    const saved = {
      APP_NAME:    process.env.APP_NAME,
      APP_VERSION: process.env.APP_VERSION,
      APP_ENV:     process.env.APP_ENV,
      SERVER_PORT: process.env.SERVER_PORT,
    };

    delete process.env.APP_NAME;
    delete process.env.APP_VERSION;
    process.env.APP_ENV     = 'development';
    process.env.SERVER_PORT = '3721';

    delete require.cache[require.resolve('../../src/config/app.config')];
    const appConfig = require('../../src/config/app.config');

    assert.strictEqual(appConfig.app.name,    'Retail ERP Enterprise');
    assert.strictEqual(appConfig.app.version, '0.2.0');

    Object.assign(process.env, saved);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 2 — Database Configuration Path Resolution
// ─────────────────────────────────────────────────────────────────────────────

test('DatabaseConfig - Path Resolution & Pragma Definitions', (t) => {

  t.test('should resolve absolute database directory path', () => {
    const dbConfig = require('../../src/config/database.config');
    assert.ok(path.isAbsolute(dbConfig.directory), 'directory must be absolute');
  });

  t.test('should produce a filePath combining directory and filename', () => {
    const dbConfig = require('../../src/config/database.config');
    const expected = path.join(dbConfig.directory, dbConfig.filename);
    assert.strictEqual(dbConfig.filePath, expected);
  });

  t.test('should have all required pragma keys defined', () => {
    const dbConfig = require('../../src/config/database.config');
    const requiredPragmas = ['journal_mode', 'synchronous', 'foreign_keys', 'cache_size', 'temp_store', 'mmap_size'];
    for (const key of requiredPragmas) {
      assert.ok(
        Object.prototype.hasOwnProperty.call(dbConfig.pragmas, key),
        `Missing pragma: ${key}`
      );
    }
  });

  t.test('should enforce WAL journal mode', () => {
    const dbConfig = require('../../src/config/database.config');
    assert.strictEqual(dbConfig.pragmas.journal_mode, 'WAL');
  });

  t.test('should enforce foreign keys ON', () => {
    const dbConfig = require('../../src/config/database.config');
    assert.strictEqual(dbConfig.pragmas.foreign_keys, 'ON');
  });

  t.test('should resolve schema and seed directories as absolute paths', () => {
    const dbConfig = require('../../src/config/database.config');
    assert.ok(path.isAbsolute(dbConfig.schema.directory),     'schema.directory must be absolute');
    assert.ok(path.isAbsolute(dbConfig.seed.directory),       'seed.directory must be absolute');
    assert.ok(path.isAbsolute(dbConfig.migrations.directory), 'migrations.directory must be absolute');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 3 — Auth Configuration Structure
// ─────────────────────────────────────────────────────────────────────────────

test('AuthConfig - Structure & Policy Defaults', (t) => {

  t.test('should have bcrypt rounds defined and numeric', () => {
    const authConfig = require('../../src/config/auth.config');
    assert.strictEqual(typeof authConfig.bcrypt.rounds, 'number');
    assert.ok(authConfig.bcrypt.rounds >= 10, 'bcrypt rounds must be >= 10');
  });

  t.test('should have session cookie maxAge defined', () => {
    const authConfig = require('../../src/config/auth.config');
    assert.ok(authConfig.session.cookie.maxAge > 0, 'maxAge must be positive');
  });

  t.test('should have login min/max length constraints defined', () => {
    const authConfig = require('../../src/config/auth.config');
    assert.ok(authConfig.login.usernameMinLength >= 1);
    assert.ok(authConfig.login.usernameMaxLength > authConfig.login.usernameMinLength);
    assert.ok(authConfig.login.passwordMinLength >= 8, 'password minimum must be at least 8');
    assert.ok(authConfig.login.passwordMaxLength > authConfig.login.passwordMinLength);
  });

  t.test('should have all four roles defined', () => {
    const authConfig = require('../../src/config/auth.config');
    assert.ok(authConfig.roles.ADMIN);
    assert.ok(authConfig.roles.MANAGER);
    assert.ok(authConfig.roles.CASHIER);
    assert.ok(authConfig.roles.VIEWER);
  });
});
