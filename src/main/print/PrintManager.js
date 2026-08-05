/**
 * PrintManager.js
 * Retail ERP Enterprise — Reusable Desktop Printer Manager
 *
 * Implements:
 * - Coordinating printer settings, layout alignments, margins and print queue sequences
 * - Decoupled from native hardware drivers
 */

"use strict";

import PrintQueue from "./PrintQueue.js";
import PrinterService from "./PrinterService.js";
import PrintPreviewService from "./PrintPreviewService.js";

export default class PrintManager {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.queue = new PrintQueue(this.logger);
    this.printers = new PrinterService(this.logger);
    this.preview = new PrintPreviewService(this.logger);
    this.logger.info("[PrintManager] Service initialized. Ready for coordinating print jobs.");
  }

  /**
   * Safe schedule print job dispatches
   * @param {string} contentHTML Document html content
   * @param {string} printerName Selected target printer
   * @param {Object} preferences Paper sizes, orientation configs
   */
  dispatchPrintJob(contentHTML, printerName, preferences = {}) {
    this.logger.info(`[PrintManager] Dispatching print request (printer: "${printerName}") with margins layout:`, preferences);
    
    // Simulate preview verify logic
    const previewData = this.preview.generatePreviewFrame(contentHTML);
    this.logger.info(`[PrintManager] Rendered print preview pages count: ${previewData.pagesCount}`);

    // Push to queue
    const queuedJob = this.queue.enqueue({
      content: contentHTML,
      printer: printerName,
      options: preferences
    });

    return queuedJob;
  }
}
