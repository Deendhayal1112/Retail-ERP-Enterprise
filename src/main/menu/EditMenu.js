/**
 * EditMenu.js
 * Retail ERP Enterprise — Desktop Native Menu Bar (Edit Menu Options)
 *
 * Implements:
 * - Edit menu items configurations definitions
 * - Placeholders mapping accelerators keys
 */

"use strict";

export default class EditMenu {
  constructor(logger = console) {
    this.logger = logger;
  }

  getTemplate() {
    return {
      label: "Edit",
      submenu: [
        { label: "Undo", role: "undo", accelerator: "CmdOrCtrl+Z" },
        { label: "Redo", role: "redo", accelerator: "CmdOrCtrl+Y" },
        { type: "separator" },
        { label: "Cut", role: "cut", accelerator: "CmdOrCtrl+X" },
        { label: "Copy", role: "copy", accelerator: "CmdOrCtrl+C" },
        { label: "Paste", role: "paste", accelerator: "CmdOrCtrl+V" },
        { type: "separator" },
        { label: "Find", accelerator: "CmdOrCtrl+F", click: () => this.logger.info("[Menu Action] Edit: Find triggered") },
        { label: "Preferences", accelerator: "CmdOrCtrl+,", click: () => this.logger.info("[Menu Action] Edit: Preferences triggered") }
      ]
    };
  }
}
