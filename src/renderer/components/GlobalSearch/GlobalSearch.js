/**
 * GlobalSearch.js
 * Retail ERP Enterprise — Reusable Global Search System Overlay
 *
 * Implements:
 * - GlobalSearch (Overlay coordinator controller)
 * - SearchInput (Filter text input field + Clear action)
 * - SearchResults (Matching items scroll box wrapper)
 * - SearchResultItem (Individual list row view)
 * - SearchCategory (Pill filter tag selectors)
 * - RecentSearches (Log list of prior search records)
 * - SearchFilters (Active filter row list)
 * - EmptySearchState (Fallback layout for no hits)
 */

"use strict";

export class SearchInput {
  /**
   * @param {Object}   options
   * @param {Function} options.onInput  Callback when text changes (value) => void
   * @param {Function} options.onClear  Callback when clear button clicked
   */
  constructor(options = {}) {
    this.onInput = options.onInput || null;
    this.onClear = options.onClear || null;
    this.inputEl = null;
  }

  clear() {
    if (this.inputEl) {
      this.inputEl.value = "";
      this.inputEl.focus();
    }
  }

  render() {
    const container = document.createElement("div");
    container.className = "search-input-container";

    container.innerHTML = `
      <span class="search-input-icon">🔍</span>
      <input type="text" class="search-field-input" placeholder="Search products, invoices, customers, settings... (Press ESC to close)" aria-label="Global search input" />
    `;

    const input = container.querySelector(".search-field-input");
    this.inputEl = input;

    if (this.onInput) {
      input.addEventListener("input", (e) => this.onInput(e.target.value));
    }

    // Clear Action Button
    const clearBtn = document.createElement("button");
    clearBtn.className = "search-clear-btn";
    clearBtn.setAttribute("aria-label", "Clear search text");
    clearBtn.innerHTML = `<span>✕</span>`;
    clearBtn.addEventListener("click", () => {
      this.clear();
      if (this.onClear) this.onClear();
    });
    container.appendChild(clearBtn);

    // Shortcut badge
    const badge = document.createElement("span");
    badge.className = "search-shortcut-badge";
    badge.textContent = "ESC";
    container.appendChild(badge);

    return container;
  }
}

export class SearchCategory {
  /**
   * @param {Object}   options
   * @param {string}   options.key      Unique key identifier
   * @param {string}   options.label    Readable tab label
   * @param {boolean}  options.active   Initial active state
   * @param {Function} options.onClick  Callback on select
   */
  constructor(options = {}) {
    this.key    = options.key    || "";
    this.label  = options.label  || "";
    this.active = options.active || false;
    this.onClick = options.onClick || null;
  }

  render() {
    const pill = document.createElement("button");
    pill.className = `search-category-pill${this.active ? " active" : ""}`;
    pill.textContent = this.label;
    pill.setAttribute("role", "tab");
    pill.setAttribute("aria-selected", this.active ? "true" : "false");

    pill.addEventListener("click", () => {
      if (this.onClick) this.onClick(this.key);
    });

    return pill;
  }
}

export class SearchFilters {
  /**
   * @param {Object}   options
   * @param {string}   options.activeCategory Currently active filter key
   * @param {Function} options.onSelectCategory Callback when a category filter changes
   */
  constructor(options = {}) {
    this.activeCategory = options.activeCategory || "all";
    this.onSelectCategory = options.onSelectCategory || null;
  }

  static categories() {
    return [
      { key: "all",              label: "All Results" },
      { key: "products",         label: "Products" },
      { key: "categories",       label: "Categories" },
      { key: "customers",        label: "Customers" },
      { key: "suppliers",        label: "Suppliers" },
      { key: "employees",        label: "Employees" },
      { key: "invoices",         label: "Invoices" },
      { key: "purchase_orders",  label: "Purchase Orders" },
      { key: "sales",            label: "Sales" },
      { key: "reports",          label: "Reports" },
      { key: "settings",         label: "Settings" }
    ];
  }

  render() {
    const bar = document.createElement("div");
    bar.className = "search-filters-bar";
    bar.setAttribute("role", "tablist");
    bar.setAttribute("aria-label", "Filter search categories");

    SearchFilters.categories().forEach(cat => {
      const pill = new SearchCategory({
        key:    cat.key,
        label:  cat.label,
        active: cat.key === this.activeCategory,
        onClick: (key) => {
          bar.querySelectorAll(".search-category-pill").forEach(p => p.classList.remove("active"));
          if (this.onSelectCategory) this.onSelectCategory(key);
        }
      });
      bar.appendChild(pill.render());
    });

    return bar;
  }
}

export class SearchResultItem {
  /**
   * @param {Object} options
   * @param {string} options.icon      Emoji icon category representation
   * @param {string} options.title     Display name/header
   * @param {string} options.subtitle  Detail/meta string
   * @param {string} options.category  Group categorizer name
   * @param {boolean} options.focused  Keyboard focus indicator
   */
  constructor(options = {}) {
    this.icon     = options.icon     || "📄";
    this.title    = options.title    || "Suggested Item";
    this.subtitle = options.subtitle || "Item Meta description";
    this.category = options.category || "General";
    this.focused  = options.focused  || false;
  }

  render() {
    const card = document.createElement("div");
    card.className = `search-result-item-card${this.focused ? " focused" : ""}`;
    card.setAttribute("role", "option");
    card.setAttribute("aria-selected", this.focused ? "true" : "false");

    card.innerHTML = `
      <div class="search-result-left">
        <div class="search-result-icon">${this.icon}</div>
        <div class="search-result-meta">
          <span class="search-result-title-txt">${this.title}</span>
          <span class="search-result-subtitle-txt">${this.subtitle}</span>
        </div>
      </div>
      <span class="search-result-category-badge">${this.category}</span>
    `;

    card.addEventListener("click", () => {
      console.log(`[GlobalSearch Item Selected] Triggering route click navigation to: ${this.title}`);
    });

    return card;
  }
}

export class SearchResults {
  /**
   * @param {Object}   options
   * @param {Object[]} options.items        Suggested search match datasets
   * @param {number}   options.selectedIndex Keyboard-driven row index tracking
   */
  constructor(options = {}) {
    this.items = options.items || [];
    this.selectedIndex = options.selectedIndex !== undefined ? options.selectedIndex : -1;
  }

  render() {
    const list = document.createElement("div");
    list.className = "search-results-list";
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-label", "Search results matches");

    this.items.forEach((item, idx) => {
      const card = new SearchResultItem({
        icon:     item.icon,
        title:    item.title,
        subtitle: item.subtitle,
        category: item.category,
        focused:  idx === this.selectedIndex
      });
      list.appendChild(card.render());
    });

    return list;
  }
}

export class RecentSearches {
  /**
   * @param {Object}   options
   * @param {string[]} options.searches     List of prior terms searched
   * @param {Function} options.onSelect     Callback when a term is selected (term) => void
   * @param {Function} options.onDelete     Callback when a term is deleted (idx) => void
   */
  constructor(options = {}) {
    this.searches = options.searches || [];
    this.onSelect = options.onSelect || null;
    this.onDelete = options.onDelete || null;
  }

  render() {
    const box = document.createElement("div");
    box.className = "recent-searches-box";

    const title = document.createElement("span");
    title.className = "recent-searches-title";
    title.textContent = "Recent Searches";
    box.appendChild(title);

    this.searches.forEach((term, idx) => {
      const row = document.createElement("div");
      row.className = "recent-search-row";

      const left = document.createElement("div");
      left.className = "recent-search-left";
      left.innerHTML = `<span>⏳</span><span>${term}</span>`;
      left.addEventListener("click", () => {
        if (this.onSelect) this.onSelect(term);
      });
      row.appendChild(left);

      const delBtn = document.createElement("button");
      delBtn.className = "recent-search-delete";
      delBtn.setAttribute("aria-label", `Remove search term ${term}`);
      delBtn.innerHTML = "✕";
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.onDelete) this.onDelete(idx);
      });
      row.appendChild(delBtn);

      box.appendChild(row);
    });

    return box;
  }
}

export class EmptySearchState {
  render() {
    const box = document.createElement("div");
    box.className = "empty-search-box";
    box.innerHTML = `
      <span class="empty-search-icon">🔍</span>
      <span class="empty-search-title">No matching results found</span>
      <span class="empty-search-desc">Try modifying your query terms or selection categories list filter.</span>
    `;
    return box;
  }
}

// ─────────────────────────────────────────────────────
// MAIN GLOBAL SEARCH OVERLAY COORDINATOR
// ─────────────────────────────────────────────────────

export default class GlobalSearch {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
    this.active = false;

    // Search query states
    this.query = "";
    this.activeCategory = "all";
    this.selectedIndex = -1;

    // Static placeholder index lists
    this.recentTerms = ["Apparel catalog", "Invoice #1042", "Branch A inventory", "Supplier orders"];
    this.placeholderResults = [
      { icon: "👕", title: "Casual Cotton T-Shirt", subtitle: "SKU: APP-TSH-002 • In Stock", category: "Products" },
      { icon: "👞", title: "Leather Oxford Shoes",   subtitle: "SKU: FTW-OXF-009 • Low Stock", category: "Products" },
      { icon: "📁", title: "Apparel & Clothing",     subtitle: "Inventory Category • 12 Items",  category: "Categories" },
      { icon: "👥", title: "Enterprise Customers",    subtitle: "System Settings Directory",     category: "Settings" }
    ];
  }

  toggle(forceState) {
    this.active = forceState !== undefined ? forceState : !this.active;
    if (this.element) {
      this.element.classList.toggle("active", this.active);
      if (this.active) {
        // Auto-focus input
        const input = this.element.querySelector(".search-field-input");
        if (input) input.focus();
      }
    }
  }

  _getFilteredResults() {
    let list = this.placeholderResults;
    // Category filter
    if (this.activeCategory !== "all") {
      list = list.filter(item => item.category.toLowerCase() === this.activeCategory);
    }
    // Query string text search match
    if (this.query.trim()) {
      const q = this.query.toLowerCase();
      list = list.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return list;
  }

  _updateContent() {
    const body = this.element.querySelector(".global-search-body");
    if (!body) return;

    body.innerHTML = "";

    const filtered = this._getFilteredResults();

    // 1. Query empty state
    if (this.query.trim() && filtered.length === 0) {
      body.appendChild(new EmptySearchState().render());
      return;
    }

    // 2. Default state: show Recent Searches
    if (!this.query.trim()) {
      const recent = new RecentSearches({
        searches: this.recentTerms,
        onSelect: (term) => {
          const input = this.element.querySelector(".search-field-input");
          if (input) {
            input.value = term;
            this.query = term;
            this._updateContent();
          }
        },
        onDelete: (idx) => {
          this.recentTerms.splice(idx, 1);
          this._updateContent();
        }
      });
      body.appendChild(recent.render());
    }

    // 3. Show matches list
    const title = document.createElement("span");
    title.className = "suggested-results-title";
    title.textContent = this.query.trim() ? "Search Results" : "Suggested Shortcuts";
    body.appendChild(title);

    const results = new SearchResults({
      items: filtered,
      selectedIndex: this.selectedIndex
    });
    body.appendChild(results.render());
  }

  render() {
    const overlay = document.createElement("div");
    overlay.className = "global-search-overlay";
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("role", "dialog");

    // Close on overlay background click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) this.toggle(false);
    });

    const modal = document.createElement("div");
    modal.className = "global-search-modal";

    // 1. Search Input Bar
    const searchInput = new SearchInput({
      onInput: (val) => {
        this.query = val;
        this.selectedIndex = -1; // reset selection
        this._updateContent();
      },
      onClear: () => {
        this.query = "";
        this.selectedIndex = -1;
        this._updateContent();
      }
    });
    modal.appendChild(searchInput.render());

    // 2. Filter Category Pills Row
    const filters = new SearchFilters({
      activeCategory: this.activeCategory,
      onSelectCategory: (key) => {
        this.activeCategory = key;
        this.selectedIndex = -1;
        this._updateContent();
      }
    });
    modal.appendChild(filters.render());

    // 3. Scrollable Body Contents Mount point
    const body = document.createElement("div");
    body.className = "global-search-body";
    modal.appendChild(body);

    // 4. Keyboard help footer guide
    const footer = document.createElement("footer");
    footer.className = "global-search-footer";
    footer.innerHTML = `
      <div class="keyboard-shortcut-guide">
        <kbd class="keyboard-shortcut-kbd">↑↓</kbd><span>Navigate</span>
      </div>
      <div class="keyboard-shortcut-guide">
        <kbd class="keyboard-shortcut-kbd">Enter</kbd><span>Select</span>
      </div>
      <div class="keyboard-shortcut-guide">
        <kbd class="keyboard-shortcut-kbd">ESC</kbd><span>Close</span>
      </div>
    `;
    modal.appendChild(footer);

    overlay.appendChild(modal);
    this.element = overlay;

    // Set initial contents
    this._updateContent();

    // Bind Keyboard Navigation shortcuts
    window.addEventListener("keydown", (e) => {
      // 1. Toggle search modal shortcut (⌘K or Ctrl+K or / key)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.toggle();
      }

      // If active, bind keyboard controls
      if (this.active) {
        const filtered = this._getFilteredResults();

        if (e.key === "Escape") {
          e.preventDefault();
          this.toggle(false);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex + 1) % filtered.length;
          this._updateContent();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex - 1 + filtered.length) % filtered.length;
          this._updateContent();
        } else if (e.key === "Enter") {
          if (this.selectedIndex >= 0 && this.selectedIndex < filtered.length) {
            e.preventDefault();
            const item = filtered[this.selectedIndex];
            console.log(`[GlobalSearch Keyboard Enter] Navigating to: ${item.title}`);
            this.toggle(false);
          }
        }
      }
    });

    return overlay;
  }
}
