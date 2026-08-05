/**
 * MenuBuilder.js
 * Retail ERP Enterprise — Native Menu Bar Template Builder
 *
 * Implements:
 * - MenuBuilder core builder linking sub-menu modules
 * - Outputting structured templates list
 */

"use strict";

import FileMenu from "./FileMenu.js";
import EditMenu from "./EditMenu.js";
import ViewMenu from "./ViewMenu.js";
import ToolsMenu from "./ToolsMenu.js";
import WindowMenu from "./WindowMenu.js";
import HelpMenu from "./HelpMenu.js";

export class MainMenu {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.fileMenu = new FileMenu(this.logger);
    this.editMenu = new EditMenu(this.logger);
    this.viewMenu = new ViewMenu(this.logger);
    this.toolsMenu = new ToolsMenu(this.logger);
    this.windowMenu = new WindowMenu(this.logger);
    this.helpMenu = new HelpMenu(this.logger);
  }

  /**
   * Builds native menu templates list array
   */
  buildTemplate() {
    this.logger.info("[MainMenu] Building native menu template items map...");
    return [
      this.fileMenu.getTemplate(),
      this.editMenu.getTemplate(),
      this.viewMenu.getTemplate(),
      this.toolsMenu.getTemplate(),
      this.windowMenu.getTemplate(),
      this.helpMenu.getTemplate()
    ];
  }
}

export default class MenuBuilder {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.mainMenu = new MainMenu(this.logger);
  }

  /**
   * Main build method returning template list
   */
  build() {
    this.logger.info("[MenuBuilder] Initiating Native Menu construction...");
    const template = this.mainMenu.buildTemplate();
    this.logger.info("[MenuBuilder] Native Menu template successfully constructed.");
    return template;
  }
}
