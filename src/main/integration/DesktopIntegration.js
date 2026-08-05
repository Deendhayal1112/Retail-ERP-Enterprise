/**
 * DesktopIntegration.js
 * Retail ERP Enterprise — Reusable Desktop System Integration Coordinator
 *
 * Implements:
 * - Coordinating diagnostic lookups, window layout bounds checks and OS shortcut installers
 * - Decoupled from native OS tools
 */

"use strict";

import WindowManager from "./WindowManager.js";
import StartupManager from "./StartupManager.js";
import ShortcutManager from "./ShortcutManager.js";
import FileAssociationManager from "./FileAssociationManager.js";
import DiagnosticsService from "./DiagnosticsService.js";
import DesktopActionService from "./DesktopActionService.js";

export default class DesktopIntegration {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.window = new WindowManager(this.logger);
    this.startup = new StartupManager(this.logger);
    this.shortcut = new ShortcutManager(this.logger);
    this.association = new FileAssociationManager(this.logger);
    this.diagnostics = new DiagnosticsService(this.logger);
    this.actions = new DesktopActionService(this.logger);

    this.logger.info("[DesktopIntegration] Integration framework initialized. Ready for bootstrapping native OS bindings.");
  }

  /**
   * Safe execute diagnostics, layout cache resets
   */
  executeBootstapTasks() {
    this.logger.info("[DesktopIntegration] Executing native integration bootstrapping checks...");
    this.association.registerAssociation(".erp");
    const bounds = this.window.getLastKnownBounds();
    this.logger.info(`[DesktopIntegration] Window coordinates loaded. Width: ${bounds.width} | Height: ${bounds.height}`);
  }
}
