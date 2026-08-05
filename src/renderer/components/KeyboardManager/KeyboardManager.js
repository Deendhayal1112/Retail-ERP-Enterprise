/**
 * KeyboardManager.js
 * Retail ERP Enterprise — Reusable Keyboard Shortcut System
 *
 * Implements:
 * - KeyboardManager (Core shortcut listeners registry coordinator)
 * - ShortcutProvider (Context states wrapper)
 * - ShortcutHelpDialog (Keyboard shortcuts help dialog overlay)
 * - ShortcutCategory (Group lists panel)
 * - ShortcutItem (Individual key mapping row display)
 * - ShortcutBadge (Muted label block caps indicators)
 * - ShortcutTooltip (Future hovering hints)
 */

"use strict";

export class ShortcutBadge {
  /**
   * @param {Object} options
   * @param {string} options.keyText e.g. "Ctrl" or "Alt"
   */
  constructor(options = {}) {
    this.keyText = options.keyText || "";
  }

  render() {
    const kbd = document.createElement("kbd");
    kbd.className = "shortcut-kbd-badge";
    kbd.textContent = this.keyText;
    return kbd;
  }
}

export class ShortcutTooltip {
  /**
   * Generates helper attributes for hoverable shortcut tooltips.
   * @param {string} keys e.g. "Alt+1"
   */
  static getAttrs(keys) {
    return {
      "data-tooltip-shortcut": keys,
      "title": `Shortcut: ${keys}`
    };
  }
}

export class ShortcutItem {
  /**
   * @param {Object}   options
   * @param {string}   options.label       Readable action description
   * @param {string[]} options.keys        Sequence of keys representation e.g. ["Ctrl", "K"]
   * @param {boolean}  options.hasConflict Simulated conflict detector flag
   */
  constructor(options = {}) {
    this.label       = options.label       || "Shortcut Action";
    this.keys        = options.keys        || [];
    this.hasConflict = options.hasConflict || false;
  }

  render() {
    const row = document.createElement("div");
    row.className = "shortcut-item-row";

    const lbl = document.createElement("span");
    lbl.className = "shortcut-item-label";
    lbl.textContent = this.label;
    row.appendChild(lbl);

    const right = document.createElement("div");
    right.className = "shortcut-badge-container";

    if (this.hasConflict) {
      const warn = document.createElement("span");
      warn.className = "shortcut-conflict-warning";
      warn.textContent = "Overlap Conflict";
      right.appendChild(warn);
    }

    this.keys.forEach(k => {
      const badge = new ShortcutBadge({ keyText: k });
      right.appendChild(badge.render());
    });

    row.appendChild(right);
    return row;
  }
}

export class ShortcutCategory {
  /**
   * @param {Object}   options
   * @param {string}   options.title  Category title e.g. "Global"
   * @param {Object[]} options.items  List of shortcut item configurations
   */
  constructor(options = {}) {
    this.title = options.title || "Category";
    this.items = options.items || [];
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "shortcut-category-panel";

    const title = document.createElement("span");
    title.className = "shortcut-category-title";
    title.textContent = this.title;
    panel.appendChild(title);

    this.items.forEach(cfg => {
      const row = new ShortcutItem(cfg);
      panel.appendChild(row.render());
    });

    return panel;
  }
}

export class ShortcutHelpDialog {
  /**
   * @param {Object}   options
   * @param {Function} options.onClose Dismiss dialog callback
   */
  constructor(options = {}) {
    this.onClose = options.onClose || null;
    this.element = null;
    this.query   = "";

    // Comprehensive shortcut configurations catalog list
    this.catalog = [
      { label: "Global Search Overlay", keys: ["Ctrl", "K"], category: "Global" },
      { label: "Focus Inline Search Input", keys: ["Ctrl", "F"], category: "Global" },
      { label: "Toggle Shortcuts Helper", keys: ["Ctrl", "/"], category: "Global" },
      { label: "Dismiss Dialog Overlay Modals", keys: ["ESC"], category: "Global" },
      { label: "Toggle Full Screen Grid View", keys: ["F11"], category: "Global" },

      { label: "Navigate to Dashboard Page", keys: ["Alt", "1"], category: "Navigation" },
      { label: "Navigate to Products catalog", keys: ["Alt", "2"], category: "Navigation" },
      { label: "Navigate to Inventory levels", keys: ["Alt", "3"], category: "Navigation" },
      { label: "Navigate to Customers directory", keys: ["Alt", "4"], category: "Navigation" },
      { label: "Navigate to Suppliers list", keys: ["Alt", "5"], category: "Navigation" },
      { label: "Navigate to Sales register", keys: ["Alt", "6"], category: "Navigation" },
      { label: "Navigate to Purchase Orders", keys: ["Alt", "7"], category: "Navigation" },
      { label: "Navigate to Settings Panel", keys: ["Alt", "8"], category: "Navigation" },

      { label: "Toggle Quick Command Palette", keys: ["Ctrl", "Shift", "P"], category: "Quick Actions" },
      { label: "Quick Create Customer card", keys: ["Ctrl", "Shift", "C"], category: "Quick Actions" },
      { label: "Quick Process Sale Transaction", keys: ["Ctrl", "Shift", "S"], category: "Quick Actions" },
      { label: "Quick Process Purchase order", keys: ["Ctrl", "Shift", "O"], category: "Quick Actions" },
      { label: "Initiate SQLite database Backup", keys: ["Ctrl", "Shift", "B"], category: "Quick Actions", hasConflict: true }
    ];
  }

  _getFilteredCatalog() {
    if (!this.query.trim()) return this.catalog;
    const q = this.query.toLowerCase();
    return this.catalog.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keys.some(k => k.toLowerCase().includes(q))
    );
  }

  _updateContent() {
    const body = this.element.querySelector(".shortcut-dialog-body");
    if (!body) return;

    body.innerHTML = "";

    const filtered = this._getFilteredCatalog();

    // Sort items by categories list
    const categories = {};
    filtered.forEach(item => {
      if (!categories[item.category]) categories[item.category] = [];
      categories[item.category].push(item);
    });

    Object.entries(categories).forEach(([catTitle, items]) => {
      const panel = new ShortcutCategory({ title: catTitle, items: items });
      body.appendChild(panel.render());
    });
  }

  render() {
    const backdrop = document.createElement("div");
    backdrop.className = "shortcut-dialog-backdrop";

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        if (this.onClose) this.onClose();
      }
    });

    const modal = document.createElement("div");
    modal.className = "shortcut-dialog-modal";

    // Header
    const header = document.createElement("header");
    header.className = "shortcut-dialog-header";

    const titleRow = document.createElement("div");
    titleRow.className = "shortcut-header-title-row";
    titleRow.innerHTML = `
      <h3 class="shortcut-dialog-title">Keyboard Shortcuts Manager</h3>
    `;

    const closeBtn = document.createElement("button");
    closeBtn.className = "shortcut-dialog-close-btn";
    closeBtn.innerHTML = "✕";
    closeBtn.setAttribute("aria-label", "Close shortcuts manager dialog");
    closeBtn.addEventListener("click", () => {
      if (this.onClose) this.onClose();
    });
    titleRow.appendChild(closeBtn);
    header.appendChild(titleRow);

    // Search bar filter
    const search = document.createElement("input");
    search.type = "text";
    search.className = "shortcut-search-field";
    search.placeholder = "Filter shortcuts by name, action or category...";
    search.addEventListener("input", (e) => {
      this.query = e.target.value;
      this._updateContent();
    });
    header.appendChild(search);

    modal.appendChild(header);

    // Scrollable Body
    const body = document.createElement("div");
    body.className = "shortcut-dialog-body";
    modal.appendChild(body);

    // Footer
    const footer = document.createElement("footer");
    footer.className = "shortcut-dialog-footer";
    footer.innerHTML = `
      <span>Role Profile: <strong>System Admin</strong></span>
      <span>Press <kbd class="shortcut-kbd-badge">ESC</kbd> to close helper</span>
    `;
    modal.appendChild(footer);

    modal.addEventListener("click", (e) => e.stopPropagation());

    backdrop.appendChild(modal);
    this.element = backdrop;

    this._updateContent();

    return backdrop;
  }
}

// ─────────────────────────────────────────────────────
// KEYBOARD MANAGER / SHORTCUT PROVIDER
// ─────────────────────────────────────────────────────

export default class KeyboardManager {
  constructor(options = {}) {
    this.options = options;
    this.dialog = null;
    this.active = false;
  }

  toggle(forceState) {
    this.active = forceState !== undefined ? forceState : !this.active;
    if (this.dialog) {
      this.dialog.classList.toggle("active", this.active);
      if (this.active) {
        const search = this.dialog.querySelector(".shortcut-search-field");
        if (search) search.focus();
      }
    }
  }

  render() {
    const helper = new ShortcutHelpDialog({
      onClose: () => this.toggle(false)
    });

    const overlay = helper.render();
    this.dialog = overlay;

    // Bind Global Listener keys (Ctrl+/ to toggle Help Dialog)
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        this.toggle();
      }

      if (this.active && e.key === "Escape") {
        e.preventDefault();
        this.toggle(false);
      }
    });

    return overlay;
  }
}
