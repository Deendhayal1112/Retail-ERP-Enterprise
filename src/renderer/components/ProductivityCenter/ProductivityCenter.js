/**
 * ProductivityCenter.js
 * Retail ERP Enterprise — Productivity Center Dashboard Panel Component
 *
 * Implements:
 * - ProductivityCenter  (Main master coordinator grid card)
 * - PinnedActions       (Left panel quick action tiles grid)
 * - PinnedActionCard    (Individual action button card)
 * - ContinueWorking     (Center panel recently edited draft items list)
 * - ContinueItem        (Individual resume row view)
 * - SmartSuggestions    (Right panel alert notifications lists)
 * - SuggestionCard      (Color-coded notice card)
 * - ProductivityToolbar (Settings settings reset actions)
 */

"use strict";

export class PinnedActionCard {
  /**
   * @param {Object} options
   * @param {string} options.icon      Emoji action visual indicator
   * @param {string} options.title     Label name tag
   * @param {string} options.route     Target navigation key
   */
  constructor(options = {}) {
    this.icon  = options.icon  || "📄";
    this.title = options.title || "Action";
    this.route = options.route || "dashboard";
  }

  render() {
    const card = document.createElement("div");
    card.className = "pinned-action-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.innerHTML = `
      <span class="pinned-action-icon">${this.icon}</span>
      <span class="pinned-action-title">${this.title}</span>
    `;

    card.addEventListener("click", () => {
      console.log(`[Productivity Pinned Action] Triggering route click navigation to: ${this.route}`);
    });

    return card;
  }
}

export class PinnedActions {
  /**
   * @param {Object} options
   * @param {Object[]} options.items Pinned actions metadata items list
   */
  constructor(options = {}) {
    this.items = options.items || [
      { icon: "💳", title: "New Sale",      route: "pos" },
      { icon: "👕", title: "New Product",   route: "products" },
      { icon: "👤", title: "New Customer",  route: "customers" },
      { icon: "🏢", title: "New Supplier",  route: "suppliers" },
      { icon: "🛒", title: "Purchase Order", route: "purchase" },
      { icon: "📊", title: "Reports",       route: "reports" }
    ];
  }

  render() {
    const col = document.createElement("div");
    col.className = "productivity-column";

    const header = document.createElement("header");
    header.className = "productivity-column-header";
    header.textContent = "Pinned Actions";
    col.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "pinned-actions-grid";

    this.items.forEach(cfg => {
      const card = new PinnedActionCard(cfg);
      grid.appendChild(card.render());
    });

    col.appendChild(grid);
    return col;
  }
}

export class ContinueItem {
  /**
   * @param {Object} options
   * @param {string} options.title    Draft name label
   * @param {string} options.subText  Category subText description
   * @param {string} options.timeAgo  Last opened age indicator
   */
  constructor(options = {}) {
    this.title    = options.title    || "Item Draft";
    this.subText  = options.subText  || "Category item description";
    this.timeAgo  = options.timeAgo  || "Just now";
  }

  render() {
    const row = document.createElement("div");
    row.className = "continue-item-row";
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", "0");

    row.innerHTML = `
      <div class="continue-item-left">
        <span class="continue-item-bullet"></span>
        <div class="continue-item-texts">
          <span class="continue-item-title">${this.title}</span>
          <span class="continue-item-sub">${this.subText}</span>
        </div>
      </div>
      <span class="continue-item-age">${this.timeAgo}</span>
    `;

    row.addEventListener("click", () => {
      console.log(`[Productivity Continue] Resuming draft session: ${this.title}`);
    });

    return row;
  }
}

export class ContinueWorking {
  /**
   * @param {Object} options
   * @param {Object[]} options.items Resume items metadata list
   */
  constructor(options = {}) {
    this.items = options.items || [
      { title: "Draft Sale - $120.00",   subText: "POS Checkout Draft",       timeAgo: "2m ago" },
      { title: "Edit Customer: John Doe", subText: "Recently Edited Customer", timeAgo: "15m ago" },
      { title: "Casual Cotton T-Shirt",   subText: "Recent Product Update",    timeAgo: "1h ago" },
      { title: "PO #4029 Pending",        subText: "Pending Purchase Order",   timeAgo: "3h ago" },
      { title: "Category Sales Digest",   subText: "Saved Report Analytics",   timeAgo: "Yesterday" }
    ];
  }

  render() {
    const col = document.createElement("div");
    col.className = "productivity-column";

    const header = document.createElement("header");
    header.className = "productivity-column-header";
    header.textContent = "Continue Working";
    col.appendChild(header);

    const list = document.createElement("div");
    list.className = "continue-working-list";

    this.items.forEach(cfg => {
      const item = new ContinueItem(cfg);
      list.appendChild(item.render());
    });

    col.appendChild(list);
    return col;
  }
}

export class SuggestionCard {
  /**
   * @param {Object} options
   * @param {string} options.type      Visual color indicator variant class
   * @param {string} options.title     Alert header title
   * @param {string} options.desc      Information description text
   */
  constructor(options = {}) {
    this.type  = options.type  || "pending-task";
    this.title = options.title || "Smart Suggestion";
    this.desc  = options.desc  || "Suggestion description...";
  }

  render() {
    const card = document.createElement("div");
    card.className = `suggestion-card ${this.type}`;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.innerHTML = `
      <span class="suggestion-title">${this.title}</span>
      <span class="suggestion-desc">${this.desc}</span>
    `;

    card.addEventListener("click", () => {
      console.log(`[Productivity Suggestion] Triggering workflow auto action for: ${this.title}`);
    });

    return card;
  }
}

export class SmartSuggestions {
  /**
   * @param {Object} options
   * @param {Object[]} options.items Suggestions metadata parameters list
   */
  constructor(options = {}) {
    this.items = options.items || [
      { type: "pending-task",  title: "Pending Tasks Approval",  desc: "2 operator access approvals pending review" },
      { type: "stock-warning", title: "Low Stock Reminder",     desc: "Leather Oxford Shoes dipped below threshold limit" },
      { type: "alert",         title: "Sales Recommendations",   desc: "Apparel items underperforming. Promote discount sales" },
      { type: "summary",       title: "Daily Summary Report",    desc: "Generate yesterday's consolidated store sales summary" }
    ];
  }

  render() {
    const col = document.createElement("div");
    col.className = "productivity-column";

    const header = document.createElement("header");
    header.className = "productivity-column-header";
    header.textContent = "Smart Suggestions";
    col.appendChild(header);

    const list = document.createElement("div");
    list.className = "smart-suggestions-list";

    this.items.forEach(cfg => {
      const card = new SuggestionCard(cfg);
      list.appendChild(card.render());
    });

    col.appendChild(list);
    return col;
  }
}

export class ProductivityToolbar {
  /**
   * @param {Object}   options
   * @param {Function} options.onRefresh Callback when refresh is triggered
   */
  constructor(options = {}) {
    this.onRefresh = options.onRefresh || null;
  }

  render() {
    const bar = document.createElement("div");
    bar.className = "productivity-toolbar";

    const refreshBtn = document.createElement("button");
    refreshBtn.className = "productivity-toolbar-btn";
    refreshBtn.textContent = "↻ Refresh Suggestions";
    refreshBtn.addEventListener("click", () => {
      console.log("[Productivity Center Action] Reloading telemetry workspace items list.");
      if (this.onRefresh) this.onRefresh();
    });
    bar.appendChild(refreshBtn);

    const customizeBtn = document.createElement("button");
    customizeBtn.className = "productivity-toolbar-btn";
    customizeBtn.textContent = "⚙️ Configure Center";
    customizeBtn.addEventListener("click", () => {
      console.log("[Productivity Center Action] Loading configurations settings panel.");
    });
    bar.appendChild(customizeBtn);

    return bar;
  }
}

// ─────────────────────────────────────────────────────
// MAIN PRODUCTIVITY CENTER DASHBOARD GRID CARD
// ─────────────────────────────────────────────────────

export default class ProductivityCenter {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "productivity-center-card";

    // Header Row
    const header = document.createElement("header");
    header.className = "productivity-header-row";

    const details = document.createElement("div");
    details.className = "productivity-title-details";
    details.innerHTML = `
      <h3 class="productivity-title">Enterprise Productivity Center</h3>
      <span class="productivity-subtitle">Personalized workflows and auto suggestion controls</span>
    `;
    header.appendChild(details);

    // Productivity Toolbar
    const toolbar = new ProductivityToolbar({
      onRefresh: () => console.log("[ProductivityCenter] Telemetry refreshed.")
    });
    header.appendChild(toolbar.render());
    card.appendChild(header);

    // Split Body Grid Columns
    const bodyGrid = document.createElement("div");
    bodyGrid.className = "productivity-body-grid";

    bodyGrid.appendChild(new PinnedActions().render());
    bodyGrid.appendChild(new ContinueWorking().render());
    bodyGrid.appendChild(new SmartSuggestions().render());

    card.appendChild(bodyGrid);
    this.element = card;

    return card;
  }
}
