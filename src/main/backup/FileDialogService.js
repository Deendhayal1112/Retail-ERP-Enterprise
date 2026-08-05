/**
 * FileDialogService.js
 * Retail ERP Enterprise — Reusable Desktop File Open/Save Dialog Gateway
 *
 * Implements:
 * - Mock file browser dialog sheet selections
 * - Decoupled from Electron APIs
 */

"use strict";

export default class FileDialogService {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.logger.info("[FileDialogService] Service initialized. Ready for file picker dispatches.");
  }

  /**
   * Mock open file dialog picker
   * @param {Object} options Visual configs map
   */
  showOpenDialog(options = {}) {
    this.logger.info("[FileDialogService] Simulating System File Open Dialog popup sheets...");
    const mockResult = {
      canceled: false,
      filePaths: ["/Users/deendhayalrr/Documents/backups/mock_backup_2026.db"]
    };
    this.logger.info("[FileDialogService] Open dialog selection received:", mockResult.filePaths[0]);
    return mockResult;
  }

  /**
   * Mock save file dialog picker
   * @param {Object} options Visual configs map
   */
  showSaveDialog(options = {}) {
    this.logger.info("[FileDialogService] Simulating System File Save Dialog popup sheets...");
    const mockResult = {
      canceled: false,
      filePath: "/Users/deendhayalrr/Documents/exports/products_list.csv"
    };
    this.logger.info("[FileDialogService] Save dialog selection received:", mockResult.filePath);
    return mockResult;
  }
}
