--
-- settings.sql
-- Retail ERP Enterprise — Key-Value Application Settings Schema
--
-- Implements general, system, POS, and print settings.
--
-- Phase 4 — Step 2: Database Schema Design
--

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT,
  group_name TEXT NOT NULL DEFAULT 'GENERAL' CHECK(group_name IN ('GENERAL', 'SYSTEM', 'POS', 'PRINTER', 'SECURITY')),
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for settings lookup optimization
CREATE INDEX IF NOT EXISTS idx_settings_group ON settings(group_name);

-- Trigger to auto-update the updated_at timestamp
CREATE TRIGGER IF NOT EXISTS tr_settings_updated_at
AFTER UPDATE ON settings
FOR EACH ROW
BEGIN
  UPDATE settings SET updated_at = CURRENT_TIMESTAMP WHERE key = OLD.key;
END;
