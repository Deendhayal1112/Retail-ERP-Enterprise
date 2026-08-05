--
-- roles.sql
-- Retail ERP Enterprise — Roles Definition Schema
--
-- Defines access roles in the application.
--
-- Phase 4 — Step 2: Database Schema Design
--

CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE CHECK(name IN ('Administrator', 'Manager', 'Cashier', 'Viewer')),
  description TEXT,
  is_system INTEGER DEFAULT 0 CHECK(is_system IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to auto-update the updated_at timestamp
CREATE TRIGGER IF NOT EXISTS tr_roles_updated_at
AFTER UPDATE ON roles
FOR EACH ROW
BEGIN
  UPDATE roles SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
