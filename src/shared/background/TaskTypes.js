/**
 * TaskTypes.js
 * Retail ERP Enterprise — Background Task Types Registry
 */

"use strict";

const TaskTypes = {
  BACKUP: "backup",
  RESTORE: "restore",
  DB_MAINTENANCE: "db_maintenance",
  IMPORT: "import",
  EXPORT: "export",
  REPORT_GEN: "report_gen",
  PDF_GEN: "pdf_gen",
  SYNC: "sync",
  UPDATE_CHECK: "update_check",
  NOTIFICATION: "notification",
  SCHEDULED: "scheduled",
  FILE_PROCESS: "file_process",
  ANALYTICS: "analytics",
  QUEUE_PROCESS: "queue_process"
};

module.exports = TaskTypes;
