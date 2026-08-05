/**
 * PDFGenerator.js
 * Retail ERP Enterprise — Reusable Desktop PDF Document Compiler
 *
 * Implements:
 * - Mock invoice HTML stream compiles into binary PDF outputs
 * - Decoupled from PDFKit/Puppeteer/Electron printing APIs
 */

"use strict";

import PDFTemplates from "./PDFTemplates.js";

export default class PDFGenerator {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.templates = new PDFTemplates();
    this.logger.info("[PDFGenerator] Service initialized. Ready for document rendering.");
  }

  /**
   * Safe render document PDF file exports
   * @param {string} templateType invoice, receipt or report
   * @param {Object} data         Metadata key-values map
   * @param {string} savePath     Target output path
   */
  generateFile(templateType, data = {}, savePath) {
    this.logger.info(`[PDFGenerator] Compiling PDF template type: "${templateType}" for data:`, data);
    const renderer = this.templates.get(templateType);
    const htmlString = renderer.render(data);

    this.logger.info(`[PDFGenerator] Rendered HTML compiled size: ${htmlString.length} bytes.`);
    this.logger.info(`[PDFGenerator] Simulating writing PDF document stream to: ${savePath}`);
    return { success: true, file: savePath };
  }
}
