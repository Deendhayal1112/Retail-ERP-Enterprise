/**
 * warehouses.ipc.js
 * Retail ERP Enterprise — IPC Multi-Warehouse Event Handlers
 *
 * Bridges the sandboxed renderer context queries to the main process WarehouseManager.
 */

"use strict";

const { ipcMain } = require("electron");
const registry = require("../warehouses/WarehouseRegistry");
const transfers = require("../warehouses/StockTransferManager");
const inventory = require("../warehouses/WarehouseInventoryManager");
const manager = require("../warehouses/WarehouseManager");
const logger = require("../../shared/logger/logger");
const appConfig = require("../../config/app.config");

/**
 * Validates the IPC sender context.
 */
function validateSender(event) {
  if (!event || !event.sender) {
    throw new Error("Invalid IPC event context.");
  }
  const url = event.senderFrame ? event.senderFrame.url : event.sender.getURL();
  if (!url) {
    logger.warn("Security Alert: Blocked IPC message due to missing sender URL.");
    throw new Error("Access Denied: Missing sender origin.");
  }

  const isLocalFile = url.startsWith("file://");
  const isDevTools = url.startsWith("chrome-extension://") || url.startsWith("devtools://");

  if (!isLocalFile && (!isDevTools || appConfig.isProduction)) {
    logger.warn(`Security Alert: Blocked IPC message from unauthorized origin: ${url}`);
    throw new Error("Access Denied: Unauthorized IPC origin.");
  }
}

/**
 * Registers all multi-warehouse IPC event listeners.
 */
function registerWarehouseIpcHandlers() {
  logger.info("Registering IPC Warehouse Handlers...");

  // Get all warehouses
  ipcMain.handle("warehouses:get-all", async (event) => {
    validateSender(event);
    return registry.getWarehouses();
  });

  // Register new warehouse
  ipcMain.handle("warehouses:register", async (event, data) => {
    validateSender(event);
    return registry.registerWarehouse(data);
  });

  // Get stock transfers
  ipcMain.handle("warehouses:get-transfers", async (event) => {
    validateSender(event);
    return transfers.getTransfers();
  });

  // Submit stock transfer request
  ipcMain.handle("warehouses:submit-transfer", async (event, data) => {
    validateSender(event);
    return transfers.submitTransfer(data);
  });

  // Approve transfer request
  ipcMain.handle("warehouses:approve-transfer", async (event, { id, approver }) => {
    validateSender(event);
    return transfers.approveTransfer(id, approver);
  });

  // Receive transfer
  ipcMain.handle("warehouses:receive-transfer", async (event, id) => {
    validateSender(event);
    return transfers.receiveTransfer(id);
  });

  // Get warehouse inventory allocation details
  ipcMain.handle("warehouses:get-inventory", async (event, warehouseId) => {
    validateSender(event);
    return inventory.getStockMap(warehouseId);
  });

  // Get Diagnostics summary details
  ipcMain.handle("warehouses:get-diagnostics", async (event) => {
    validateSender(event);
    return manager.getDiagnosticsSummary();
  });
}

module.exports = {
  registerWarehouseIpcHandlers
};
