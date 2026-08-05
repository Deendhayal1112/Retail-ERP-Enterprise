/**
 * ViewMenu.js
 * Retail ERP Enterprise — Desktop Native Menu Bar (View Menu Options)
 *
 * Implements:
 * - View menu items configurations definitions
 * - Placeholders mapping accelerators keys
 */

"use strict";

export default class ViewMenu {
  constructor(logger = console) {
    this.logger = logger;
  }

  getTemplate() {
    return {
      label: "View",
      submenu: [
        { label: "Dashboard", click: () => this.logger.info("[Menu Action] View: Dashboard triggered") },
        { label: "Products", click: () => this.logger.info("[Menu Action] View: Products triggered") },
        { label: "Inventory", click: () => this.logger.info("[Menu Action] View: Inventory triggered") },
        { label: "Customers", click: () => this.logger.info("[Menu Action] View: Customers triggered") },
        { label: "Sales", click: () => this.logger.info("[Menu Action] View: Sales triggered") },
        { label: "Reports", click: () => this.logger.info("[Menu Action] View: Reports triggered") },
        { type: "separator" },
        { label: "Toggle Sidebar", click: () => this.logger.info("[Menu Action] View: Toggle Sidebar triggered") },
        { label: "Toggle Fullscreen", role: "togglefullscreen", accelerator: "F11" },
        { label: "Reload", role: "reload", accelerator: "CmdOrCtrl+R" },
        { type: "separator" },
        { label: "Zoom In", role: "zoomin", accelerator: "CmdOrCtrl+=" },
        { label: "Zoom Out", role: "zoomout", accelerator: "CmdOrCtrl+-" },
        { label: "Reset Zoom", role: "resetzoom", accelerator: "CmdOrCtrl+0" }
      ]
    };
  }
}
