/**
 * WebhookManager.js
 * Retail ERP Enterprise — Enterprise Webhook Subscription Manager
 *
 * Manages webhook event subscriptions, payload schema definitions, and
 * simulated test delivery dispatches.
 * Architecture only — no actual HTTP POST delivery is performed.
 */

"use strict";

const logger = require("../../shared/logger/logger");
const crypto = require("crypto");

// Catalogue of all subscribable webhook event types
const WEBHOOK_EVENTS = [
  { event: "order.created",          module: "Sales",     description: "Fires when a new sales order is placed." },
  { event: "order.status_changed",   module: "Sales",     description: "Fires when an order status transitions." },
  { event: "invoice.generated",      module: "Sales",     description: "Fires when an invoice PDF is generated." },
  { event: "payment.received",       module: "Sales",     description: "Fires when a customer payment is recorded." },
  { event: "product.created",        module: "Products",  description: "Fires when a new product is added to catalogue." },
  { event: "product.updated",        module: "Products",  description: "Fires when a product record is updated." },
  { event: "product.out_of_stock",   module: "Inventory", description: "Fires when a SKU reaches zero available stock." },
  { event: "stock.adjusted",         module: "Inventory", description: "Fires when a manual stock adjustment is applied." },
  { event: "transfer.requested",     module: "Warehouses","description": "Fires when a new warehouse transfer is requested." },
  { event: "transfer.received",      module: "Warehouses","description": "Fires when a transfer is marked received." },
  { event: "purchase.order_placed",  module: "Purchases", description: "Fires when a PO is raised to a vendor." },
  { event: "purchase.goods_received",module: "Purchases", description: "Fires when goods receipt note is posted." },
  { event: "customer.registered",    module: "Customers", description: "Fires when a new customer profile is created." }
];

class WebhookManager {
  constructor() {
    /**
     * Active webhook subscriptions registry.
     */
    this.subscriptions = [
      {
        id: "wh-sub-001",
        label: "Logistics Platform Integration",
        url: "https://logistics.partner.internal/erp-events",
        events: ["order.created", "order.status_changed", "transfer.requested", "transfer.received"],
        secret: "whsec_gL9kXmPrT4vRqNzBdYaOe2uFjWcSiHo8",
        status: "active",
        deliveredCount: 1284,
        failedCount: 3,
        createdAt: "2026-07-20T10:00:00Z"
      },
      {
        id: "wh-sub-002",
        label: "Accounting System Sync",
        url: "https://accounting.erp.internal/hooks/sales",
        events: ["invoice.generated", "payment.received", "purchase.order_placed"],
        secret: "whsec_7pQrVkNsWbXtLcZmAoDeYjFhGiMuT3e9",
        status: "active",
        deliveredCount: 842,
        failedCount: 0,
        createdAt: "2026-07-25T08:00:00Z"
      },
      {
        id: "wh-sub-003",
        label: "Inventory Alert System",
        url: "https://alerts.internal/inventory-notify",
        events: ["product.out_of_stock", "stock.adjusted"],
        secret: "whsec_2nMsKrJwPiAqLtVyZxCbEgHdOuFoT8h4",
        status: "paused",
        deliveredCount: 204,
        failedCount: 12,
        createdAt: "2026-08-01T09:00:00Z"
      }
    ];

    /**
     * Test delivery dispatch log (mock).
     */
    this.deliveryLogs = [];
  }

  /**
   * Returns all active webhook subscriptions.
   */
  getSubscriptions() {
    logger.debug("[WebhookManager] Fetching webhook subscription registry.");
    return this.subscriptions.map(s => ({
      ...s,
      secret: this._maskSecret(s.secret)
    }));
  }

  /**
   * Returns all available webhook event types.
   */
  getAvailableEvents() {
    return WEBHOOK_EVENTS;
  }

  /**
   * Registers a new webhook subscription.
   * @param {Object} data - { label, url, events }
   */
  registerSubscription(data) {
    logger.info(`[WebhookManager] Registering webhook subscription: ${data.label}`);
    if (!data.url || !data.events || !Array.isArray(data.events) || data.events.length === 0) {
      throw new Error("Invalid subscription: url and at least one event are required.");
    }

    const validEvents = data.events.filter(e => WEBHOOK_EVENTS.some(we => we.event === e));
    if (validEvents.length === 0) {
      throw new Error("None of the specified events are valid webhook events.");
    }

    const rawSecret = `whsec_${crypto.randomBytes(20).toString("base64url")}`;
    const newSub = {
      id: `wh-sub-${Date.now()}`,
      label: data.label || "Untitled Webhook",
      url: data.url,
      events: validEvents,
      secret: rawSecret,
      status: "active",
      deliveredCount: 0,
      failedCount: 0,
      createdAt: new Date().toISOString()
    };

    this.subscriptions.push(newSub);
    return { success: true, subscription: { ...newSub, secret: rawSecret } }; // Return full secret once
  }

  /**
   * Deletes a webhook subscription by ID.
   * @param {string} id
   */
  deleteSubscription(id) {
    logger.info(`[WebhookManager] Deleting webhook subscription: ${id}`);
    const idx = this.subscriptions.findIndex(s => s.id === id);
    if (idx === -1) throw new Error(`Subscription not found: ${id}`);
    this.subscriptions.splice(idx, 1);
    return { success: true, id };
  }

  /**
   * Simulates a test webhook delivery to a subscription (mock dispatch only).
   * @param {string} id - Subscription ID
   * @param {string} event - Event type to simulate
   */
  simulateDelivery(id, event) {
    logger.info(`[WebhookManager] Simulating test delivery: ${event} → ${id}`);
    const sub = this.subscriptions.find(s => s.id === id);
    if (!sub) throw new Error(`Subscription not found: ${id}`);

    const log = {
      id: `del-${Date.now()}`,
      subscriptionId: id,
      event,
      url: sub.url,
      status: "simulated_success",
      responseCode: 200,
      latencyMs: Math.floor(Math.random() * 120) + 40,
      timestamp: new Date().toISOString(),
      payload: this._buildSamplePayload(event)
    };

    this.deliveryLogs.push(log);
    return { success: true, delivery: log };
  }

  /**
   * Returns delivery dispatch logs (most recent first).
   */
  getDeliveryLogs() {
    return [...this.deliveryLogs].reverse();
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────────

  _maskSecret(secret) {
    if (!secret || secret.length < 12) return "****";
    return `${secret.slice(0, 10)}${"*".repeat(24)}${secret.slice(-4)}`;
  }

  _buildSamplePayload(event) {
    return {
      event,
      timestamp: new Date().toISOString(),
      id: `evt_${crypto.randomBytes(8).toString("hex")}`,
      data: {
        message: `Simulated test payload for event: ${event}`,
        source: "Retail ERP Enterprise v0.2"
      }
    };
  }
}

module.exports = new WebhookManager();
