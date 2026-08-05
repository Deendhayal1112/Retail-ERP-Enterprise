/**
 * PrintPreviewService.js
 * Retail ERP Enterprise — Reusable Desktop Print Preview Generator
 *
 * Implements:
 * - Mock image/HTML frame rendering for previewing print outputs
 * - Decoupled from Electron APIs
 */

"use strict";

export default class PrintPreviewService {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.logger.info("[PrintPreviewService] Service initialized. Ready for screen layouts generation.");
  }

  /**
   * Safe generate mock preview iframe content
   * @param {string} htmlTemplate Invoice html template layout
   */
  generatePreviewFrame(htmlTemplate) {
    this.logger.info(`[PrintPreviewService] Processing print preview layouts frame (template bytes: ${htmlTemplate.length})`);
    return {
      zoom: 1.0,
      pagesCount: 1,
      renderedHTML: `<div style="padding:10px; background:#fff;">${htmlTemplate}</div>`
    };
  }
}
