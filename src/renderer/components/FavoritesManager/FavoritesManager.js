/**
 * FavoritesManager.js
 * Retail ERP Enterprise — Favorites & Recently Used Panel Component
 *
 * Implements:
 * - FavoritesManager (Coordinator container grid card)
 * - FavoritesPanel (Left side pinned list panel)
 * - FavoriteItem (Individual favorite row view)
 * - FavoriteBadge (Pill badge showing category target)
 * - FavoriteButton (Pin/Unpin toggle action icon)
 * - RecentlyUsedPanel (Right side timeline visitor history)
 * - RecentItem (Individual history row view)
 * - RecentTimestamp (Last opened offset tags)
 * - ClearHistoryButton (Action control header button)
 */

"use strict";

export class FavoriteBadge {
  /**
   * @param {Object} options
   * @param {string} options.text category tag label
   */
  constructor(options = {}) {
    this.text = options.text || "General";
  }

  render() {
    const badge = document.createElement("span");
    badge.className = "favorite-badge-tag";
    badge.textContent = this.text;
    return badge;
  }
}

export class FavoriteButton {
  /**
   * @param {Object}   options
   * @param {boolean}  options.pinned  Active pin state flag
   * @param {Function} options.onClick Click callback action
   */
  constructor(options = {}) {
    this.pinned  = options.pinned !== undefined ? options.pinned : true;
    this.onClick = options.onClick || null;
  }

  render() {
    const btn = document.createElement("button");
    btn.className = "favorite-pin-btn";
    btn.setAttribute("aria-label", this.pinned ? "Unpin from favorites" : "Pin to favorites");
    btn.innerHTML = this.pinned ? "★" : "☆";

    if (this.onClick) {
      btn.addEventListener("click", () => this.onClick());
    }

    return btn;
  }
}

export class FavoriteItem {
  /**
   * @param {Object}   options
   * @param {string}   options.icon      visual category symbol
   * @param {string}   options.text      target page label
   * @param {string}   options.category  badge categorization label
   * @param {Function} options.onUnpin   Action trigger when unpinned
   */
  constructor(options = {}) {
    this.icon     = options.icon     || "📄";
    this.text     = options.text     || "Page Item";
    this.category = options.category || "General";
    this.onUnpin  = options.onUnpin  || null;
  }

  render() {
    const row = document.createElement("div");
    row.className = "favorite-item-row";

    const left = document.createElement("div");
    left.className = "favorite-item-left";
    left.innerHTML = `<span class="favorite-item-icon">${this.icon}</span><span>${this.text}</span>`;
    
    const badge = new FavoriteBadge({ text: this.category });
    left.appendChild(badge.render());
    row.appendChild(left);

    const right = document.createElement("div");
    right.className = "favorite-actions-box";

    // Pin/Unpin button
    const btn = new FavoriteButton({
      pinned: true,
      onClick: () => {
        console.log(`[Favorites Action] Unpinning favorite item: ${this.text}`);
        if (this.onUnpin) this.onUnpin();
      }
    });
    right.appendChild(btn.render());

    // Drag-and-drop placeholder handle reorder
    const handle = document.createElement("span");
    handle.className = "favorite-reorder-handle";
    handle.setAttribute("title", "Drag to reorder (Placeholder)");
    handle.innerHTML = "☰";
    right.appendChild(handle);

    row.appendChild(right);
    return row;
  }
}

export class FavoritesPanel {
  /**
   * @param {Object}   options
   * @param {Object[]} options.items   Pinned favorite cards dataset list
   * @param {Function} options.onUnpin Callback when an item is unpinned
   */
  constructor(options = {}) {
    this.items   = options.items   || [];
    this.onUnpin = options.onUnpin || null;
  }

  render() {
    const col = document.createElement("div");
    col.className = "favorites-panel-column";

    const header = document.createElement("header");
    header.className = "favorites-panel-header";
    header.innerHTML = `<span class="column-section-title">Pinned Favorites</span>`;
    col.appendChild(header);

    const list = document.createElement("div");
    list.className = "favorites-list";

    this.items.forEach((item, idx) => {
      const row = new FavoriteItem({
        icon:     item.icon,
        text:     item.text,
        category: item.category,
        onUnpin:  () => {
          if (this.onUnpin) this.onUnpin(idx);
        }
      });
      list.appendChild(row.render());
    });

    col.appendChild(list);
    return col;
  }
}

export class RecentTimestamp {
  /**
   * @param {Object} options
   * @param {string} options.time e.g. "Just now" or "2 mins ago"
   */
  constructor(options = {}) {
    this.time = options.time || "";
  }

  render() {
    const span = document.createElement("span");
    span.className = "recent-timestamp-label";
    span.textContent = this.time;
    return span;
  }
}

export class ClearHistoryButton {
  /**
   * @param {Object}   options
   * @param {Function} options.onClick Action handler when clicked
   */
  constructor(options = {}) {
    this.onClick = options.onClick || null;
  }

  render() {
    const btn = document.createElement("button");
    btn.className = "clear-history-action-btn";
    btn.textContent = "Clear History";
    
    if (this.onClick) {
      btn.addEventListener("click", () => this.onClick());
    }

    return btn;
  }
}

export class RecentItem {
  /**
   * @param {Object} options
   * @param {string} options.icon      Visual category representation
   * @param {string} options.text      Action description text
   * @param {string} options.timestamp Age string offset
   */
  constructor(options = {}) {
    this.icon      = options.icon      || "📄";
    this.text      = options.text      || "Visited Item";
    this.timestamp = options.timestamp || "Just now";
  }

  render() {
    const row = document.createElement("div");
    row.className = "recent-item-row";

    const left = document.createElement("div");
    left.className = "recent-item-left";
    left.innerHTML = `<span class="recent-item-icon">${this.icon}</span><span>${this.text}</span>`;
    row.appendChild(left);

    const right = document.createElement("div");
    right.className = "recent-actions-box";

    const time = new RecentTimestamp({ time: this.timestamp });
    right.appendChild(time.render());

    row.appendChild(right);
    return row;
  }
}

export class RecentlyUsedPanel {
  /**
   * @param {Object}   options
   * @param {Object[]} options.items   Visited history item rows list
   * @param {Function} options.onClear Action when history clean triggered
   */
  constructor(options = {}) {
    this.items   = options.items   || [];
    this.onClear = options.onClear || null;
  }

  render() {
    const col = document.createElement("div");
    col.className = "recently-used-panel-column";

    const header = document.createElement("header");
    header.className = "recently-used-header-row";
    header.innerHTML = `<span class="column-section-title">Recently Visited</span>`;

    const clearBtn = new ClearHistoryButton({
      onClick: () => {
        console.log("[RecentlyUsed Action] Clearing recent navigation logs history.");
        if (this.onClear) this.onClear();
      }
    });
    header.appendChild(clearBtn.render());
    col.appendChild(header);

    const list = document.createElement("div");
    list.className = "recently-used-list";

    this.items.forEach(item => {
      const row = new RecentItem({
        icon:      item.icon,
        text:      item.text,
        timestamp: item.timestamp
      });
      list.appendChild(row.render());
    });

    col.appendChild(list);
    return col;
  }
}

// ─────────────────────────────────────────────────────
// MAIN FAVORITES MANAGER GRID WIDGET
// ─────────────────────────────────────────────────────

export default class FavoritesManager {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Static placeholder datasets
    this.favorites = [
      { icon: "📊", text: "Dashboard Overview", category: "Dashboard" },
      { icon: "👕", text: "Apparel Clothing Catalog", category: "Products" },
      { icon: "📦", text: "Warehouse Stocks Inventory", category: "Inventory" },
      { icon: "👥", text: "Operator Member Accounts", category: "Customers" }
    ];

    this.recents = [
      { icon: "📋", text: "Sales Trend Analytics report", timestamp: "10 mins ago" },
      { icon: "💳", text: "Invoice bill #1042 checkouts", timestamp: "1 hr ago" },
      { icon: "👤", text: "John Doe Customer account view", timestamp: "3 hrs ago" },
      { icon: "👕", text: "Oxford casual shirts profile", timestamp: "Yesterday" }
    ];
  }

  _updateContent() {
    const grid = this.element.querySelector(".favorites-manager-body-grid");
    if (!grid) return;

    grid.innerHTML = "";

    // Favorites (left)
    const favPanel = new FavoritesPanel({
      items: this.favorites,
      onUnpin: (idx) => {
        this.favorites.splice(idx, 1);
        this._updateContent();
      }
    });
    grid.appendChild(favPanel.render());

    // Recently Visited (right)
    const recentPanel = new RecentlyUsedPanel({
      items: this.recents,
      onClear: () => {
        this.recents = [];
        this._updateContent();
      }
    });
    grid.appendChild(recentPanel.render());
  }

  render() {
    const card = document.createElement("div");
    card.className = "favorites-manager-card";

    // Header Details
    card.innerHTML = `
      <header class="favorites-manager-header">
        <div class="favorites-manager-title-row">
          <h3 class="favorites-manager-title">Enterprise Favorites & Recently Visited</h3>
          <span class="favorites-manager-subtitle">Quick navigation workspace channels logs</span>
        </div>
      </header>
    `;

    // Inner Grid
    const grid = document.createElement("div");
    grid.className = "favorites-manager-body-grid";
    card.appendChild(grid);

    this.element = card;
    this._updateContent();

    return card;
  }
}
