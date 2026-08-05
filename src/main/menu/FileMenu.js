/**
 * FileMenu.js
 * Retail ERP Enterprise — Desktop Native Menu Bar (File Menu Options)
 *
 * Implements:
 * - File menu items configurations definitions
 * - Placeholders mapping accelerators keys
 */

"use strict";

export default class FileMenu {
  constructor(logger = console) {
    this.logger = logger;
  }

  getTemplate() {
    return {
      label: "File",
      submenu: [
        { label: "New Sale", accelerator: "CmdOrCtrl+N", click: () => this.logger.info("[Menu Action] File: New Sale triggered") },
        { label: "New Product", accelerator: "CmdOrCtrl+Shift+P", click: () => this.logger.info("[Menu Action] File: New Product triggered") },
        { label: "New Customer", accelerator: "CmdOrCtrl+Shift+C", click: () => this.logger.info("[Menu Action] File: New Customer triggered") },
        { type: "separator" },
        { label: "Open", accelerator: "CmdOrCtrl+O", click: () => this.logger.info("[Menu Action] File: Open triggered") },
        { label: "Save", accelerator: "CmdOrCtrl+S", click: () => this.logger.info("[Menu Action] File: Save triggered") },
        { type: "separator" },
        { label: "Backup Database", click: () => this.logger.info("[Menu Action] File: Backup Database triggered") },
        { label: "Restore Database", click: () => this.logger.info("[Menu Action] File: Restore Database triggered") },
        { type: "separator" },
        { label: "Print", accelerator: "CmdOrCtrl+P", click: () => this.logger.info("[Menu Action] File: Print triggered") },
        { label: "Export PDF", accelerator: "CmdOrCtrl+E", click: () => this.logger.info("[Menu Action] File: Export PDF triggered") },
        { type: "separator" },
        { label: "Exit", role: "quit", accelerator: "CmdOrCtrl+Q" }
      ]
    };
  }
}
