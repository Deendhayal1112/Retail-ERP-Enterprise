/**
 * StockTransferManager.js
 * Retail ERP Enterprise — Stock Transfer Requests Manager
 *
 * Implements mock lifecycle for stock movements between warehouses.
 */

"use strict";

const logger = require("../../shared/logger/logger");

class StockTransferManager {
  constructor() {
    this.transfers = [
      {
        id: "tr-2026-001",
        sourceWarehouseId: "wh-central-delhi",
        destWarehouseId: "wh-chennai-port",
        sku: "APP-SHIRT-COTTON",
        qtyRequested: 200,
        status: "in-transit", // requests, approvals, history, in-transit, receiving, logs
        requestedBy: "Ramanathan Iyer",
        approvedBy: "Karthik Subramanian",
        dateRequested: "2026-08-01",
        dateShipped: "2026-08-03"
      },
      {
        id: "tr-2026-002",
        sourceWarehouseId: "wh-bengaluru-cold",
        destWarehouseId: "wh-central-delhi",
        sku: "APP-JEANS-INDIGO",
        qtyRequested: 50,
        status: "requested",
        requestedBy: "Manjunath Gowda",
        approvedBy: null,
        dateRequested: "2026-08-05",
        dateShipped: null
      },
      {
        id: "tr-2026-003",
        sourceWarehouseId: "wh-chennai-port",
        destWarehouseId: "wh-bengaluru-cold",
        sku: "APP-SILK-SAREE",
        qtyRequested: 120,
        status: "received",
        requestedBy: "Manjunath Gowda",
        approvedBy: "Karthik Subramanian",
        dateRequested: "2026-07-20",
        dateShipped: "2026-07-22",
        dateReceived: "2026-07-25"
      }
    ];
  }

  /**
   * Retrieves all stock transfers history.
   */
  getTransfers() {
    logger.debug("[StockTransferManager] Fetching transfers history logs.");
    return this.transfers;
  }

  /**
   * Submits a new stock transfer request.
   */
  submitTransfer(data) {
    logger.info(`[StockTransferManager] Simulating transfer request submission.`);
    if (!data.sourceWarehouseId || !data.destWarehouseId || !data.sku || !data.qtyRequested) {
      throw new Error("Missing required stock transfer fields.");
    }

    const id = `tr-2026-00${this.transfers.length + 1}`;
    const newTr = {
      id,
      sourceWarehouseId: data.sourceWarehouseId,
      destWarehouseId: data.destWarehouseId,
      sku: data.sku,
      qtyRequested: Number(data.qtyRequested) || 0,
      status: "requested",
      requestedBy: data.requestedBy || "Operator",
      approvedBy: null,
      dateRequested: new Date().toISOString().split("T")[0],
      dateShipped: null
    };

    this.transfers.push(newTr);
    return { success: true, transfer: newTr };
  }

  /**
   * Approves a transfer request.
   */
  approveTransfer(id, approver) {
    logger.info(`[StockTransferManager] Simulating approval of transfer request: ${id}`);
    const tr = this.transfers.find(x => x.id === id);
    if (!tr) throw new Error("Transfer request not found.");

    tr.status = "in-transit";
    tr.approvedBy = approver;
    tr.dateShipped = new Date().toISOString().split("T")[0];
    return tr;
  }

  /**
   * Marks a transfer as received.
   */
  receiveTransfer(id) {
    logger.info(`[StockTransferManager] Simulating receipt of stock transfer: ${id}`);
    const tr = this.transfers.find(x => x.id === id);
    if (!tr) throw new Error("Transfer request not found.");

    tr.status = "received";
    tr.dateReceived = new Date().toISOString().split("T")[0];
    return tr;
  }
}

module.exports = new StockTransferManager();
