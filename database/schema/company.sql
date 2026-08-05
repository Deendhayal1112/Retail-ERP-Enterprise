--
-- company.sql
-- Retail ERP Enterprise — Company Details Configuration Schema
--
-- Stores metadata about the enterprise company workspace.
--
-- Phase 4 — Step 2: Database Schema Design
--

CREATE TABLE IF NOT EXISTS company (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  legal_name TEXT,
  tax_id TEXT,
  email TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  logo_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to auto-update the updated_at timestamp
CREATE TRIGGER IF NOT EXISTS tr_company_updated_at
AFTER UPDATE ON company
FOR EACH ROW
BEGIN
  UPDATE company SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
