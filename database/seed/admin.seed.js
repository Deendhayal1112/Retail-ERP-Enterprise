/**
 * admin.seed.js
 * Retail ERP Enterprise — Database Master & Administrator Seeder
 *
 * Seeds initial lookup tables, including standard roles, default permissions,
 * and inserts a secure default System Administrator user with a salted bcrypt password hash.
 *
 * Phase 4 — Step 3: Admin User Seeder
 */

'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../src/shared/logger/logger');

// Salt rounds for bcrypt hashing
const SALT_ROUNDS = 10;

/**
 * Runs the database seeding operations inside a transactional block.
 * @param {Database} db Active better-sqlite3 database connection.
 */
function run(db) {
  logger.info('Database seeder execution starting...');

  // 1. Seed Roles (Administrator, Manager, Cashier, Viewer)
  const roles = [
    { name: 'Administrator', description: 'Full system authorization controls', is_system: 1 },
    { name: 'Manager', description: 'Manage sales registers, configurations, and inventory keys', is_system: 1 },
    { name: 'Cashier', description: 'Run customer checkout transactions and POS sessions', is_system: 1 },
    { name: 'Viewer', description: 'Read-only access to inventory metrics and reports views', is_system: 1 }
  ];

  const insertRoleStmt = db.prepare(`
    INSERT INTO roles (name, description, is_system)
    VALUES (?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET
      description = excluded.description,
      is_system = excluded.is_system
  `);

  for (const role of roles) {
    insertRoleStmt.run(role.name, role.description, role.is_system);
  }
  logger.info('✔ Master roles seeded.');

  // Fetch role IDs for mapping permissions and users
  const adminRoleId = db.prepare("SELECT id FROM roles WHERE name = 'Administrator'").get().id;
  const managerRoleId = db.prepare("SELECT id FROM roles WHERE name = 'Manager'").get().id;
  const cashierRoleId = db.prepare("SELECT id FROM roles WHERE name = 'Cashier'").get().id;
  const viewerRoleId = db.prepare("SELECT id FROM roles WHERE name = 'Viewer'").get().id;

  // 2. Seed Default Permissions
  const permissions = [
    // Users module
    { code: 'users:create', name: 'Create Users', module: 'users', description: 'Add new operator profiles' },
    { code: 'users:read', name: 'View Users', module: 'users', description: 'View current operators list' },
    { code: 'users:update', name: 'Modify Users', module: 'users', description: 'Update profile permissions and flags' },
    { code: 'users:delete', name: 'Soft-Delete Users', module: 'users', description: 'Archive users from system access' },

    // Billing module
    { code: 'billing:create', name: 'Create Invoices', module: 'billing', description: 'Generate POS sales checkout bills' },
    { code: 'billing:read', name: 'View Billing Logs', module: 'billing', description: 'Search transaction logs' },

    // Inventory module
    { code: 'inventory:read', name: 'View Stock levels', module: 'inventory', description: 'Inspect inventory catalogs' },
    { code: 'inventory:write', name: 'Update Stock entries', module: 'inventory', description: 'Modify catalogs and item prices' },

    // Reports module
    { code: 'reports:read', name: 'Read Store Analytics', module: 'reports', description: 'Examine sales profit metrics' },

    // Settings module
    { code: 'settings:write', name: 'Update Preferences', module: 'settings', description: 'Modify printer, printer IPs, and theme settings' }
  ];

  const insertPermStmt = db.prepare(`
    INSERT INTO permissions (code, name, module, description)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(code) DO UPDATE SET
      name = excluded.name,
      module = excluded.module,
      description = excluded.description
  `);

  for (const perm of permissions) {
    insertPermStmt.run(perm.code, perm.name, perm.module, perm.description);
  }
  logger.info('✔ Permissions dictionary seeded.');

  // Clear pre-existing role mappings to avoid duplicate constraints on reset
  db.prepare("DELETE FROM role_permissions").run();

  const allPerms = db.prepare("SELECT id, code FROM permissions").all();
  const insertMappingStmt = db.prepare("INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)");

  // Administrator Role gets ALL permissions
  for (const p of allPerms) {
    insertMappingStmt.run(adminRoleId, p.id);
  }

  // Manager Role mappings
  const managerPermsList = [
    'users:read', 'billing:read', 'inventory:read', 'inventory:write', 'reports:read', 'settings:write'
  ];
  const managerPerms = allPerms.filter(p => managerPermsList.includes(p.code));
  for (const p of managerPerms) {
    insertMappingStmt.run(managerRoleId, p.id);
  }

  // Cashier Role mappings
  const cashierPermsList = ['billing:create', 'billing:read', 'inventory:read'];
  const cashierPerms = allPerms.filter(p => cashierPermsList.includes(p.code));
  for (const p of cashierPerms) {
    insertMappingStmt.run(cashierRoleId, p.id);
  }

  // Viewer Role mappings
  const viewerPermsList = ['users:read', 'billing:read', 'inventory:read', 'reports:read'];
  const viewerPerms = allPerms.filter(p => viewerPermsList.includes(p.code));
  for (const p of viewerPerms) {
    insertMappingStmt.run(viewerRoleId, p.id);
  }

  logger.info('✔ Permission role mappings seeded.');

  // 3. Seed Company Details
  const companyCount = db.prepare("SELECT COUNT(*) as count FROM company").get().count;
  if (companyCount === 0) {
    db.prepare(`
      INSERT INTO company (name, legal_name, tax_id, email, phone, address_line1, city, state, postal_code, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Retail ERP Enterprise',
      'Retail ERP Corp LLC',
      'US-TAX-123456789',
      'billing@retailerp.local',
      '+1-555-0199',
      '100 Broadway Suite 4',
      'New York',
      'NY',
      '10005',
      'USA'
    );
    logger.info('✔ Default company profile initialized.');
  } else {
    logger.info('✔ Company details already exists. Skipping...');
  }

  // 4. Seed Default Settings
  const defaultSettings = [
    { key: 'app.currency', value: 'USD', group: 'GENERAL', desc: 'Active system trade currency symbol' },
    { key: 'app.timezone', value: 'UTC', group: 'GENERAL', desc: 'Universal calendar log timezone' },
    { key: 'pos.receipt_printer', value: 'Mock-POS-Printer', group: 'PRINTER', desc: 'POSIX network printing name' },
    { key: 'security.password_min_length', value: '6', group: 'SECURITY', desc: 'Minimum system passwords characters length' }
  ];

  const insertSettingStmt = db.prepare(`
    INSERT INTO settings (key, value, group_name, description)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      description = excluded.description
  `);

  for (const s of defaultSettings) {
    insertSettingStmt.run(s.key, s.value, s.group, s.desc);
  }
  logger.info('✔ Application settings seeded.');

  // 5. Seed Default Administrator Account
  const adminUserCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE username = 'admin'").get().count;
  if (adminUserCount === 0) {
    // Generate secure salted bcrypt hash
    const adminPasswordHash = bcrypt.hashSync('Admin@12345', SALT_ROUNDS);
    const adminUuid = uuidv4();

    db.prepare(`
      INSERT INTO users (uuid, username, email, password_hash, full_name, role_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      adminUuid,
      'admin',
      'admin@retailerp.local',
      adminPasswordHash,
      'System Administrator',
      adminRoleId,
      'ACTIVE'
    );
    logger.info('✔ Default administrator account generated (Username: admin, Password: Admin@12345).');
  } else {
    logger.info('✔ Administrator account already exists. Skipping...');
  }

  logger.info('Database seeder successfully completed.');
}

module.exports = {
  run
};
