/**
 * WindowMenu.js
 * Retail ERP Enterprise — Desktop Native Menu Bar (Window Menu Options)
 *
 * Implements:
 * - Window menu items configurations definitions
 * - Placeholders mapping accelerators keys
 */

"use strict";

export default class WindowMenu {
  constructor(logger = console) {
    this.logger = logger;
  }

  getTemplate() {
    return {
      label: "Window",
      submenu: [
        { label: "Minimize", role: "minimize", accelerator: "CmdOrCtrl+M" },
        { label: "Maximize", role: "zoom", click: () => this.logger.info("[Menu Action] Window: Maximize triggered") },
        { label: "Close", role: "close", accelerator: "CmdOrCtrl+W" },
        { type: "separator" },
        { label: "Reset Layout", click: () => this.logger.info("[Menu Action] Window: Reset Layout triggered") }
      ]
    };
  }
}
