/**
 * HelpMenu.js
 * Retail ERP Enterprise — Desktop Native Menu Bar (Help Menu Options)
 *
 * Implements:
 * - Help menu items configurations definitions
 * - Placeholders mapping accelerators keys
 */

"use strict";

export default class HelpMenu {
  constructor(logger = console) {
    this.logger = logger;
  }

  getTemplate() {
    return {
      label: "Help",
      submenu: [
        { label: "Documentation", click: () => this.logger.info("[Menu Action] Help: Documentation triggered") },
        { label: "Keyboard Shortcuts", click: () => this.logger.info("[Menu Action] Help: Keyboard Shortcuts triggered") },
        { label: "Release Notes", click: () => this.logger.info("[Menu Action] Help: Release Notes triggered") },
        { type: "separator" },
        { label: "Check for Updates", click: () => this.logger.info("[Menu Action] Help: Check for Updates triggered") },
        { type: "separator" },
        { label: "About Retail ERP", click: () => this.logger.info("[Menu Action] Help: About triggered") }
      ]
    };
  }
}
