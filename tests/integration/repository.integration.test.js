/**
 * repository.integration.test.js
 * Retail ERP Enterprise — Repository Layer Integration Tests
 *
 * Verifies all repository methods against a fresh, isolated SQLite instance:
 * UserRepository, LoginHistoryRepository, RoleRepository, SettingsRepository.
 *
 * Phase 6 — Step 2: Integration Testing
 */

'use strict';

const test   = require('node:test');
const assert = require('node:assert');
const fs     = require('fs');
const path   = require('path');
const bcrypt = require('bcryptjs');

const TEST_DB_DIR  = path.resolve('./database/test-repo');
const TEST_DB_FILE = 'retail_erp_repo_test.db';
const TEST_DB_PATH = path.join(TEST_DB_DIR, TEST_DB_FILE);

function resetModules() {
  const mods = [
    '../../src/backend/database',
    '../../src/config/database.config',
    '../../src/backend/repositories/user.repository',
    '../../src/backend/repositories/loginHistory.repository',
    '../../src/backend/repositories/role.repository',
    '../../src/backend/repositories/settings.repository',
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

// Global test state — one DB shared across all suites in this file
let dbService;
let userRepo;
let loginHistoryRepo;
let roleRepo;
let settingsRepo;

test('Repository Layer — Global Setup', async (t) => {

  t.before(() => {
    cleanTestDb();
    process.env.DB_PATH = TEST_DB_DIR;
    process.env.DB_NAME = TEST_DB_FILE;
    process.env.DB_SEED = 'true';
    resetModules();
    dbService       = require('../../src/backend/database');
    userRepo        = require('../../src/backend/repositories/user.repository');
    loginHistoryRepo = require('../../src/backend/repositories/loginHistory.repository');
    roleRepo        = require('../../src/backend/repositories/role.repository');
    settingsRepo    = require('../../src/backend/repositories/settings.repository');
    dbService.initialize();
  });

  t.after(() => {
    try { dbService.close(); } catch (_) { /* ignore */ }
    cleanTestDb();
    delete process.env.DB_PATH;
    delete process.env.DB_NAME;
    delete process.env.DB_SEED;
  });

  // ─────────────────────────────────────────────────────────────────────────
  // RoleRepository
  // ─────────────────────────────────────────────────────────────────────────

  await t.test('RoleRepository - should return all seeded roles', () => {
    const roles = roleRepo.findAll();
    assert.ok(Array.isArray(roles), 'findAll must return an array');
    assert.ok(roles.length >= 4, 'Must have at least 4 seeded roles');
  });

  await t.test('RoleRepository - should find Administrator by ID 1', () => {
    const role = roleRepo.findById(1);
    assert.ok(role, 'Role with ID 1 must exist');
    assert.strictEqual(role.name, 'Administrator');
  });

  await t.test('RoleRepository - should find Manager by name', () => {
    const role = roleRepo.findByName('Manager');
    assert.ok(role, 'Manager role must exist');
    assert.ok(role.id > 0);
  });

  await t.test('RoleRepository - should return null for non-existent role ID', () => {
    const role = roleRepo.findById(99999);
    assert.strictEqual(role, null);
  });

  await t.test('RoleRepository - should return null for non-existent role name', () => {
    const role = roleRepo.findByName('GhostRole');
    assert.strictEqual(role, null);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // SettingsRepository
  // ─────────────────────────────────────────────────────────────────────────

  await t.test('SettingsRepository - should return all seeded settings', () => {
    const settings = settingsRepo.findAll();
    assert.ok(Array.isArray(settings), 'findAll must return an array');
    assert.ok(settings.length > 0, 'Must have at least one setting');
  });

  await t.test('SettingsRepository - should find app.currency setting', () => {
    const setting = settingsRepo.find('app.currency');
    assert.ok(setting, 'app.currency must exist');
    assert.strictEqual(setting.value, 'USD');
  });

  await t.test('SettingsRepository - should return null for unknown key', () => {
    const setting = settingsRepo.find('nonexistent.key.xyz');
    assert.strictEqual(setting, null);
  });

  await t.test('SettingsRepository - should update an existing setting value', () => {
    settingsRepo.update('app.currency', 'EUR');
    const updated = settingsRepo.find('app.currency');
    assert.strictEqual(updated.value, 'EUR');
    // Restore original value
    settingsRepo.update('app.currency', 'USD');
  });

  await t.test('SettingsRepository - should insert a new setting via upsert', () => {
    settingsRepo.update('test.repo.key', 'test-value');
    const inserted = settingsRepo.find('test.repo.key');
    assert.ok(inserted, 'New upserted key must exist');
    assert.strictEqual(inserted.value, 'test-value');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // UserRepository
  // ─────────────────────────────────────────────────────────────────────────

  await t.test('UserRepository - should find seeded admin by username', () => {
    const user = userRepo.findByUsername('admin');
    assert.ok(user, 'admin user must exist');
    assert.strictEqual(user.username, 'admin');
    assert.strictEqual(user.status, 'ACTIVE');
  });

  await t.test('UserRepository - should find seeded admin by email', () => {
    const user = userRepo.findByEmail('admin@retailerp.local');
    assert.ok(user, 'admin user must be findable by email');
    assert.strictEqual(user.email, 'admin@retailerp.local');
  });

  await t.test('UserRepository - should find seeded admin by ID', () => {
    const byUsername = userRepo.findByUsername('admin');
    const byId = userRepo.findById(byUsername.id);
    assert.ok(byId, 'findById must return user');
    assert.strictEqual(byId.username, 'admin');
  });

  await t.test('UserRepository - should return null for non-existent username', () => {
    const user = userRepo.findByUsername('totally_unknown_user');
    assert.strictEqual(user, null);
  });

  await t.test('UserRepository - should return null for non-existent email', () => {
    const user = userRepo.findByEmail('nobody@nowhere.example');
    assert.strictEqual(user, null);
  });

  await t.test('UserRepository - should return null for non-existent ID', () => {
    const user = userRepo.findById(99999);
    assert.strictEqual(user, null);
  });

  await t.test('UserRepository - should create a new user record', () => {
    const adminRole = roleRepo.findByName('Administrator');
    const hash = bcrypt.hashSync('Test@12345', 10);
    const created = userRepo.create({
      username:      'repo_test_user',
      email:         'repo_test_user@retailerp.local',
      password_hash: hash,
      full_name:     'Repository Test User',
      role_id:       adminRole.id,
      status:        'ACTIVE',
    });

    assert.ok(created,                    'create() must return the new user');
    assert.strictEqual(created.username,  'repo_test_user');
    assert.strictEqual(created.status,    'ACTIVE');
    assert.ok(created.id > 0,            'created user must have a numeric ID');
    assert.ok(created.uuid,              'created user must have a UUID');
  });

  await t.test('UserRepository - should confirm user exists by username or email', () => {
    const exists = userRepo.exists('repo_test_user', 'repo_test_user@retailerp.local');
    assert.strictEqual(exists, true);
  });

  await t.test('UserRepository - should return false for non-existent combination', () => {
    const exists = userRepo.exists('nobody123', 'nobody@example.com');
    assert.strictEqual(exists, false);
  });

  await t.test('UserRepository - should update a user field via update()', () => {
    const user = userRepo.findByUsername('repo_test_user');
    const updated = userRepo.update(user.id, { full_name: 'Updated Name' });
    assert.strictEqual(updated.full_name, 'Updated Name');
  });

  await t.test('UserRepository - update() should return null for non-existent ID', () => {
    const result = userRepo.update(99999, { full_name: 'Ghost' });
    assert.strictEqual(result, null);
  });

  await t.test('UserRepository - should update last_login timestamp', () => {
    const user = userRepo.findByUsername('repo_test_user');
    const success = userRepo.updateLastLogin(user.id);
    assert.strictEqual(success, true);
    const updated = userRepo.findById(user.id);
    assert.ok(updated.last_login, 'last_login must be set after update');
  });

  await t.test('UserRepository - should soft-delete user by setting deleted_at', () => {
    const user    = userRepo.findByUsername('repo_test_user');
    const deleted = userRepo.update(user.id, { deleted_at: new Date().toISOString() });
    assert.ok(deleted.deleted_at, 'deleted_at must be set');

    // Without includeDeleted, user should not be found
    const notFound = userRepo.findByUsername('repo_test_user');
    assert.strictEqual(notFound, null, 'Soft-deleted user must not appear in standard queries');

    // With includeDeleted=true, user should still be found
    const found = userRepo.findByUsername('repo_test_user', true);
    assert.ok(found, 'Soft-deleted user must be found with includeDeleted=true');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // LoginHistoryRepository
  // ─────────────────────────────────────────────────────────────────────────

  await t.test('LoginHistoryRepository - should create a login history record', () => {
    const admin  = userRepo.findByUsername('admin');
    const record = loginHistoryRepo.create({
      user_id:    admin.id,
      ip_address: '192.168.1.100',
      user_agent: 'Integration-Test-Agent/1.0',
    });

    assert.ok(record,                           'create() must return the inserted record');
    assert.strictEqual(record.user_id, admin.id);
    assert.strictEqual(record.ip_address, '192.168.1.100');
    assert.strictEqual(record.user_agent, 'Integration-Test-Agent/1.0');
    assert.ok(record.id > 0);
  });

  await t.test('LoginHistoryRepository - should create record with null ip_address and user_agent', () => {
    const admin  = userRepo.findByUsername('admin');
    const record = loginHistoryRepo.create({ user_id: admin.id });
    assert.ok(record);
    assert.strictEqual(record.ip_address, null);
    assert.strictEqual(record.user_agent, null);
  });

  await t.test('LoginHistoryRepository - should retrieve latest records ordered descending', () => {
    const admin   = userRepo.findByUsername('admin');
    // Insert two more entries
    loginHistoryRepo.create({ user_id: admin.id, ip_address: '10.0.0.1' });
    loginHistoryRepo.create({ user_id: admin.id, ip_address: '10.0.0.2' });

    const records = loginHistoryRepo.findLatest(admin.id, 5);
    assert.ok(Array.isArray(records), 'findLatest must return an array');
    assert.ok(records.length >= 2, 'Must return at least 2 records');

    // Verify descending order by ID
    for (let i = 0; i < records.length - 1; i++) {
      assert.ok(records[i].id >= records[i + 1].id, 'Records must be sorted descending by ID');
    }
  });

  await t.test('LoginHistoryRepository - should respect limit parameter', () => {
    const admin   = userRepo.findByUsername('admin');
    const records = loginHistoryRepo.findLatest(admin.id, 2);
    assert.ok(records.length <= 2, 'Must not exceed specified limit');
  });

  await t.test('LoginHistoryRepository - should return empty array for user with no history', () => {
    const records = loginHistoryRepo.findLatest(99999, 10);
    assert.deepStrictEqual(records, []);
  });
});
