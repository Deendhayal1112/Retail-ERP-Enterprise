/**
 * PDFService.js
 * Retail ERP Enterprise — Reusable Desktop PDF Generation Service
 *
 * Implements:
 * - Mock invoice PDF render and exports
 * - Decoupled from Electron APIs using mock placeholders
 * - Dependency Injection Ready
 */

"use strict";

export default class PDFService {
  /**
   * @param {Object} logger Logger instance
   */
  constructor(logger = console) {
    this.logger = logger;
    this.logger.info("[PDFService] Service initialized. Ready for PDF conversion actions.");
  }

  /**
   * Render HTML templates into PDF files
   * @param {string} htmlTemplate Raw HTML template string
   * @param {string} savePath     Target PDF absolute path
   */
  generatePDF(htmlTemplate, savePath) {
    this.logger.info(`[PDFService] Parsing mock HTML layout template (length: ${htmlTemplate.length})`);
    this.logger.info(`[PDFService] Writing compiled mock PDF binary stream directly to: ${savePath}`);
    return { success: true, file: savePath };
  }
}
