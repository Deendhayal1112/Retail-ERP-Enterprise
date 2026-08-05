--
-- permissions.sql
-- Retail ERP Enterprise — Permissions & Role Mapping Schema
--
-- Implements flexible permission identifiers for future POS, Inventory,
-- and Billing modules alongside many-to-many mapping relations.
--
-- Phase 4 — Step 2: Database Schema Design
--

-- Permissions Definition Table
CREATE TABLE IF NOT EXISTS permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  module TEXT NOT NULL CHECK(module IN ('users', 'billing', 'inventory', 'reports', 'settings')),
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Junction Table relating Roles and Permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);

-- Indexing for relational mapping speed optimization
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_perm ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_permissions_code ON permissions(code);
