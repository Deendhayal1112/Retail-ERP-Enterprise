/**
 * QuickActions.js
 * Retail ERP Enterprise — Reusable Quick Actions Hub Component
 *
 * Implements:
 * - QuickActions (Main card manager)
 * - QuickActionsGrid (Responsive grid container)
 * - QuickActionCard (Action button tile)
 * - QuickActionIcon (Icon wrapper cell)
 * - QuickActionTitle (Header label)
 * - QuickActionDescription (Subtext description)
 */

"use strict";

export class QuickActionIcon {
  constructor(options = {}) {
    this.symbol = options.symbol || "⚡";
  }

  render() {
    const box = document.createElement("div");
    box.className = "quick-action-icon-box";
    box.textContent = this.symbol;
    return box;
  }
}

export class QuickActionTitle {
  constructor(options = {}) {
    this.text = options.text || "";
  }

  render() {
    const h4 = document.createElement("h4");
    h4.className = "quick-action-title-text";
    h4.textContent = this.text;
    return h4;
  }
}

export class QuickActionDescription {
  constructor(options = {}) {
    this.text = options.text || "";
  }

  render() {
    const span = document.createElement("span");
    span.className = "quick-action-desc-text";
    span.textContent = this.text;
    return span;
  }
}

export class QuickActionCard {
  constructor(options = {}) {
    this.action = {
      title: options.title || "Action",
      desc: options.desc || "",
      symbol: options.symbol || "⚡",
      shortcut: options.shortcut || "",
      actionKey: options.actionKey || "",
      ...options
    };
  }

  render() {
    const tile = document.createElement("div");
    tile.className = "quick-action-card-tile";

    // Icon
    const icon = new QuickActionIcon({ symbol: this.action.symbol });
    tile.appendChild(icon.render());

    // Title
    const title = new QuickActionTitle({ text: this.action.title });
    tile.appendChild(title.render());

    // Description
    const desc = new QuickActionDescription({ text: this.action.desc });
    tile.appendChild(desc.render());

    // Keyboard Shortcut Badge
    if (this.action.shortcut) {
      const badge = document.createElement("span");
      badge.className = "quick-action-shortcut-badge";
      badge.textContent = this.action.shortcut;
      tile.appendChild(badge);
    }

    tile.addEventListener("click", () => {
      console.log(`[QuickAction Center] Executing action hook parameter: ${this.action.actionKey}`);
    });

    return tile;
  }
}

export class QuickActionsGrid {
  constructor(options = {}) {
    this.actions = options.actions || [];
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "quick-actions-grid-box";

    this.actions.forEach(act => {
      const card = new QuickActionCard(act);
      grid.appendChild(card.render());
    });

    return grid;
  }
}

// ─────────────────────────────────────────────────────
// MAIN QUICK ACTIONS PANEL COMPONENT
// ─────────────────────────────────────────────────────

export default class QuickActions {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Default mock action list items
    this.actionList = [
      { title: "New Sale", desc: "Launch fast POS invoice checkout window", symbol: "⚡", shortcut: "F1", actionKey: "new_sale" },
      { title: "Add Product", desc: "Create new product item catalog record", symbol: "🏷️", shortcut: "F2", actionKey: "add_product" },
      { title: "Stock Entry", desc: "Record inventory arrivals or adjustments", symbol: "📦", shortcut: "F3", actionKey: "stock_entry" },
      { title: "Add Customer", desc: "Register a customer to loyalty system", symbol: "👥", shortcut: "F4", actionKey: "add_customer" },
      { title: "Purchase Order", desc: "Generate vendor request for restock", symbol: "📝", shortcut: "F5", actionKey: "purchase_order" },
      { title: "Sales Report", desc: "Export spreadsheet or print POS log", symbol: "📊", shortcut: "F6", actionKey: "sales_report" },
      { title: "Backup Database", desc: "Trigger local SQLite storage backup line", symbol: "💾", shortcut: "F7", actionKey: "backup_db" },
      { title: "Settings", desc: "Manage store registry preferences", symbol: "⚙️", shortcut: "F8", actionKey: "settings" }
    ];
  }

  render() {
    const container = document.createElement("div");
    container.className = "quick-actions-center-card";

    // 1. Header Details
    const header = document.createElement("header");
    header.className = "quick-actions-header";
    header.innerHTML = `
      <h3 class="quick-actions-title-text">Quick Operations Hub</h3>
      <span class="quick-actions-subtitle-text">One-click shortcut tiles for store register operations</span>
    `;
    container.appendChild(header);

    // 2. Grid Box
    const grid = new QuickActionsGrid({ actions: this.actionList });
    container.appendChild(grid.render());

    this.element = container;
    return container;
  }
}
