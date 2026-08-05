/**
 * FileService.js
 * Retail ERP Enterprise — Reusable Desktop Local File Access Service
 *
 * Implements:
 * - Mock file system read, write, directory listings wrappers
 * - Decoupled from Electron APIs using mock placeholders
 * - Dependency Injection Ready
 */

"use strict";

export default class FileService {
  /**
   * @param {Object} logger Logger instance
   */
  constructor(logger = console) {
    this.logger = logger;
    this.logger.info("[FileService] Service initialized. Ready for local filesystem operations.");
  }

  /**
   * Mock read file contents
   * @param {string} filePath File absolute path
   */
  readFile(filePath) {
    this.logger.info(`[FileService] Reading mock file content from: ${filePath}`);
    return `{"status": "mock_data", "file": "${filePath}"}`;
  }

  /**
   * Mock write file contents
   * @param {string} filePath File absolute path
   * @param {string} content  Content string to write
   */
  writeFile(filePath, content) {
    this.logger.info(`[FileService] Writing mock content of length ${content.length} to: ${filePath}`);
    return true;
  }
}
