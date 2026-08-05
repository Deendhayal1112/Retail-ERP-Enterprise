/**
 * AnalyticsToolbar.js
 * Retail ERP Enterprise — Reusable Interactive Chart Controls & Analytics Toolbar
 *
 * Implements:
 * - AnalyticsToolbar  (Main coordinator — assembles all controls)
 * - TimeRangeSelector (Pill tab time range switcher)
 * - FilterDropdown    (Branch / Category / Brand / Employee / Customer / Payment Method)
 * - ExportMenu        (CSV / Excel / PDF / PNG / Print flyout)
 * - RefreshButton     (Animated refresh control)
 * - FullScreenButton  (Fullscreen toggle)
 * - ChartSettings     (Tooltip / Crosshair / Legend / Multi-Series / Zoom toggles)
 * - ToolbarDivider    (Visual separator)
 */

"use strict";

// ─────────────────────────────────────────────────────
// TOOLBAR DIVIDER
// ─────────────────────────────────────────────────────

export class ToolbarDivider {
  render() {
    const el = document.createElement("div");
    el.className = "toolbar-divider";
    el.setAttribute("role", "separator");
    return el;
  }
}

// ─────────────────────────────────────────────────────
// TIME RANGE SELECTOR — pill tabs
// ─────────────────────────────────────────────────────

export class TimeRangeSelector {
  /**
   * @param {Object}   options
   * @param {string}   options.active      Default active key
   * @param {Function} options.onChange    Callback (key) => void
   */
  constructor(options = {}) {
    this.active   = options.active   || "month";
    this.onChange = options.onChange || null;
  }

  static ranges() {
    return [
      { key: "today",      text: "Today"       },
      { key: "yesterday",  text: "Yesterday"   },
      { key: "7d",         text: "7 Days"      },
      { key: "month",      text: "This Month"  },
      { key: "last_month", text: "Last Month"  },
      { key: "quarter",    text: "Quarter"     },
      { key: "year",       text: "This Year"   },
      { key: "custom",     text: "Custom"      }
    ];
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "toolbar-time-range-tabs";
    wrap.setAttribute("role", "tablist");
    wrap.setAttribute("aria-label", "Select analytics time range");

    TimeRangeSelector.ranges().forEach(r => {
      const btn = document.createElement("button");
      btn.className = `toolbar-time-tab${r.key === this.active ? " active" : ""}`;
      btn.textContent = r.text;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", r.key === this.active ? "true" : "false");

      btn.addEventListener("click", () => {
        wrap.querySelectorAll(".toolbar-time-tab").forEach(b => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        console.log(`[AnalyticsToolbar] Time range changed to: ${r.key}`);
        if (this.onChange) this.onChange(r.key);
      });

      wrap.appendChild(btn);
    });

    return wrap;
  }
}

// ─────────────────────────────────────────────────────
// FILTER DROPDOWN
// ─────────────────────────────────────────────────────

export class FilterDropdown {
  /**
   * @param {Object}   options
   * @param {string}   options.label    Display label (e.g. "Branch")
   * @param {string[]} options.items    Dropdown option list
   * @param {Function} options.onChange Callback (value) => void
   */
  constructor(options = {}) {
    this.label    = options.label    || "Filter";
    this.items    = options.items    || ["All"];
    this.onChange = options.onChange || null;
  }

  render() {
    const group = document.createElement("div");
    group.className = "toolbar-filter-group";

    const label = document.createElement("span");
    label.className = "toolbar-filter-label";
    label.textContent = this.label + ":";
    group.appendChild(label);

    const select = document.createElement("select");
    select.className = "toolbar-filter-select";
    select.setAttribute("aria-label", `Filter by ${this.label}`);

    this.items.forEach((item, i) => {
      const opt = document.createElement("option");
      opt.value = item.toLowerCase().replace(/\s+/g, "_");
      opt.textContent = item;
      if (i === 0) opt.selected = true;
      select.appendChild(opt);
    });

    if (this.onChange) {
      select.addEventListener("change", (e) => {
        console.log(`[AnalyticsToolbar] Filter "${this.label}" changed to: ${e.target.value}`);
        this.onChange(e.target.value);
      });
    }

    group.appendChild(select);
    return group;
  }
}

// ─────────────────────────────────────────────────────
// EXPORT MENU (flyout dropdown)
// ─────────────────────────────────────────────────────

export class ExportMenu {
  /**
   * @param {Object}   options
   * @param {Function} options.onExport Callback (format) => void
   */
  constructor(options = {}) {
    this.onExport = options.onExport || null;
    this._menuEl  = null;
    this._open    = false;
  }

  static formats() {
    return [
      { key: "csv",   icon: "📄", text: "Export as CSV"   },
      { key: "excel", icon: "📊", text: "Export as Excel" },
      { key: "pdf",   icon: "📋", text: "Export as PDF"   },
      { key: "png",   icon: "🖼️",  text: "Export as PNG"   },
      { key: "print", icon: "🖨️",  text: "Print Report"    }
    ];
  }

  _toggle() {
    this._open = !this._open;
    this._menuEl.classList.toggle("open", this._open);
  }

  _close() {
    this._open = false;
    this._menuEl.classList.remove("open");
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "toolbar-export-wrapper";

    // Trigger button
    const btn = document.createElement("button");
    btn.className = "toolbar-action-btn";
    btn.innerHTML = `<span class="toolbar-btn-icon">⬇️</span><span>Export</span>`;
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      this._toggle();
      btn.setAttribute("aria-expanded", this._open ? "true" : "false");
    });
    wrapper.appendChild(btn);

    // Flyout menu
    const menu = document.createElement("div");
    menu.className = "toolbar-export-menu";
    this._menuEl = menu;

    ExportMenu.formats().forEach((fmt, idx) => {
      if (idx === 4) {
        const divider = document.createElement("div");
        divider.className = "toolbar-export-menu-divider";
        menu.appendChild(divider);
      }

      const item = document.createElement("button");
      item.className = "toolbar-export-menu-item";
      item.innerHTML = `<span>${fmt.icon}</span><span>${fmt.text}</span>`;
      item.addEventListener("click", () => {
        console.log(`[AnalyticsToolbar] Export initiated in format: ${fmt.key}`);
        if (this.onExport) this.onExport(fmt.key);
        this._close();
      });
      menu.appendChild(item);
    });

    wrapper.appendChild(menu);

    // Close when clicking outside
    document.addEventListener("click", () => this._close());

    return wrapper;
  }
}

// ─────────────────────────────────────────────────────
// REFRESH BUTTON
// ─────────────────────────────────────────────────────

export class RefreshButton {
  /**
   * @param {Object}   options
   * @param {Function} options.onRefresh Callback () => void
   */
  constructor(options = {}) {
    this.onRefresh = options.onRefresh || null;
  }

  render() {
    const btn = document.createElement("button");
    btn.className = "toolbar-action-btn";
    btn.innerHTML = `<span class="toolbar-btn-icon">↻</span><span>Refresh</span>`;
    btn.setAttribute("aria-label", "Refresh chart data");

    btn.addEventListener("click", () => {
      btn.classList.add("refreshing");
      console.log("[AnalyticsToolbar] Refreshing chart data...");
      setTimeout(() => {
        btn.classList.remove("refreshing");
        console.log("[AnalyticsToolbar] Chart data refresh complete.");
      }, 1200);
      if (this.onRefresh) this.onRefresh();
    });

    return btn;
  }
}

// ─────────────────────────────────────────────────────
// FULL SCREEN BUTTON
// ─────────────────────────────────────────────────────

export class FullScreenButton {
  /**
   * @param {Object}   options
   * @param {Function} options.onFullScreen Callback (isFullScreen) => void
   */
  constructor(options = {}) {
    this.onFullScreen = options.onFullScreen || null;
    this._active = false;
  }

  render() {
    const btn = document.createElement("button");
    btn.className = "toolbar-action-btn";
    btn.innerHTML = `<span class="toolbar-btn-icon">⛶</span>`;
    btn.setAttribute("aria-label", "Toggle full screen");

    btn.addEventListener("click", () => {
      this._active = !this._active;
      btn.classList.toggle("active", this._active);
      btn.innerHTML = this._active
        ? `<span class="toolbar-btn-icon">⊠</span>`
        : `<span class="toolbar-btn-icon">⛶</span>`;
      console.log(`[AnalyticsToolbar] Full screen ${this._active ? "enabled" : "disabled"}.`);
      if (this.onFullScreen) this.onFullScreen(this._active);
    });

    return btn;
  }
}

// ─────────────────────────────────────────────────────
// CHART SETTINGS PANEL (slide-down popup)
// ─────────────────────────────────────────────────────

export class ChartSettings {
  constructor(options = {}) {
    this._open   = false;
    this._panelEl = null;
    this.settings = {
      tooltip:    { label: "Tooltip",         active: true  },
      crosshair:  { label: "Crosshair",       active: true  },
      legend:     { label: "Legend",          active: true  },
      multiSeries:{ label: "Multi-Series",    active: false },
      zoom:       { label: "Zoom & Pan",      active: false },
      drillDown:  { label: "Drill-Down Mode", active: false }
    };
  }

  _toggle() {
    this._open = !this._open;
    this._panelEl.classList.toggle("open", this._open);
  }

  _close() {
    this._open = false;
    if (this._panelEl) this._panelEl.classList.remove("open");
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "toolbar-settings-wrapper";

    const btn = document.createElement("button");
    btn.className = "toolbar-action-btn";
    btn.innerHTML = `<span class="toolbar-btn-icon">⚙️</span>`;
    btn.setAttribute("aria-label", "Chart settings");
    btn.setAttribute("aria-haspopup", "true");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      this._toggle();
      btn.setAttribute("aria-expanded", this._open ? "true" : "false");
    });
    wrapper.appendChild(btn);

    const panel = document.createElement("div");
    panel.className = "toolbar-settings-panel";
    this._panelEl = panel;

    const sectionTitle = document.createElement("div");
    sectionTitle.className = "toolbar-settings-section-title";
    sectionTitle.textContent = "Chart Interaction Controls";
    panel.appendChild(sectionTitle);

    Object.entries(this.settings).forEach(([key, cfg]) => {
      const row = document.createElement("div");
      row.className = "toolbar-settings-row";

      const lbl = document.createElement("span");
      lbl.textContent = cfg.label;
      row.appendChild(lbl);

      const toggle = document.createElement("div");
      toggle.className = `toolbar-toggle-switch${cfg.active ? "" : " off"}`;
      toggle.setAttribute("role", "switch");
      toggle.setAttribute("aria-checked", cfg.active ? "true" : "false");
      toggle.addEventListener("click", () => {
        cfg.active = !cfg.active;
        toggle.classList.toggle("off", !cfg.active);
        toggle.setAttribute("aria-checked", cfg.active ? "true" : "false");
        console.log(`[AnalyticsToolbar] Setting "${cfg.label}" -> ${cfg.active}`);
      });
      row.appendChild(toggle);

      panel.appendChild(row);
    });

    wrapper.appendChild(panel);

    document.addEventListener("click", () => this._close());

    return wrapper;
  }
}

// ─────────────────────────────────────────────────────
// MORE ACTIONS MENU
// ─────────────────────────────────────────────────────

export class MoreActionsMenu {
  constructor(options = {}) {
    this._open   = false;
    this._menuEl = null;
  }

  static actions() {
    return [
      { icon: "📌", text: "Save Current View"     },
      { icon: "📅", text: "Schedule Report"       },
      { icon: "🔗", text: "Copy Share Link"       },
      { icon: "⌨️",  text: "Keyboard Shortcuts"   },
      { icon: "🤖", text: "AI Chart Insights"     },
      { icon: "↩️",  text: "Reset All Filters"    }
    ];
  }

  _toggle() {
    this._open = !this._open;
    this._menuEl.classList.toggle("open", this._open);
  }

  _close() {
    this._open = false;
    if (this._menuEl) this._menuEl.classList.remove("open");
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "toolbar-more-wrapper";

    const btn = document.createElement("button");
    btn.className = "toolbar-action-btn";
    btn.innerHTML = `<span class="toolbar-btn-icon">⋯</span>`;
    btn.setAttribute("aria-label", "More actions");
    btn.setAttribute("aria-haspopup", "true");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      this._toggle();
      btn.setAttribute("aria-expanded", this._open ? "true" : "false");
    });
    wrapper.appendChild(btn);

    const menu = document.createElement("div");
    menu.className = "toolbar-more-menu";
    this._menuEl = menu;

    MoreActionsMenu.actions().forEach(action => {
      const item = document.createElement("button");
      item.className = "toolbar-more-menu-item";
      item.innerHTML = `<span>${action.icon}</span><span>${action.text}</span>`;
      item.addEventListener("click", () => {
        console.log(`[AnalyticsToolbar] More action selected: ${action.text}`);
        this._close();
      });
      menu.appendChild(item);
    });

    wrapper.appendChild(menu);

    document.addEventListener("click", () => this._close());

    return wrapper;
  }
}

// ─────────────────────────────────────────────────────
// MAIN ANALYTICS TOOLBAR (coordinator)
// ─────────────────────────────────────────────────────

export default class AnalyticsToolbar {
  /**
   * @param {Object}  options
   * @param {string}  options.activeRange       Initial active time range key
   * @param {boolean} options.showFilters       Show filter dropdowns (default true)
   * @param {boolean} options.showRefresh       Show refresh button (default true)
   * @param {boolean} options.showExport        Show export menu (default true)
   * @param {boolean} options.showFullScreen    Show fullscreen toggle (default true)
   * @param {boolean} options.showSettings      Show chart settings (default true)
   * @param {boolean} options.showMoreActions   Show more actions menu (default true)
   * @param {Function} options.onRangeChange    Callback when time range changes
   * @param {Function} options.onExport         Callback when export is triggered
   * @param {Function} options.onRefresh        Callback when refresh is triggered
   * @param {Function} options.onFullScreen     Callback when fullscreen is toggled
   */
  constructor(options = {}) {
    this.options = {
      activeRange:     "month",
      showFilters:     true,
      showRefresh:     true,
      showExport:      true,
      showFullScreen:  true,
      showSettings:    true,
      showMoreActions: true,
      ...options
    };
    this.element = null;
  }

  /**
   * Returns a pre-configured default filter set for retail ERP.
   */
  static defaultFilters() {
    return [
      {
        label: "Branch",
        items: ["All Branches", "Main Store", "Branch A", "Branch B", "Warehouse"]
      },
      {
        label: "Category",
        items: ["All Categories", "Apparel", "Footwear", "Electronics", "Accessories"]
      },
      {
        label: "Brand",
        items: ["All Brands", "Brand Alpha", "Brand Beta", "Brand Gamma", "Own Label"]
      },
      {
        label: "Payment",
        items: ["All Methods", "Cash", "Card", "Online", "Credit", "UPI"]
      }
    ];
  }

  render() {
    const toolbar = document.createElement("div");
    toolbar.className = "analytics-toolbar";
    toolbar.setAttribute("role", "toolbar");
    toolbar.setAttribute("aria-label", "Analytics chart controls");

    // 1. Time Range Selector
    const timeRange = new TimeRangeSelector({
      active:   this.options.activeRange,
      onChange: this.options.onRangeChange
    });
    toolbar.appendChild(timeRange.render());

    // 2. Divider
    toolbar.appendChild(new ToolbarDivider().render());

    // 3. Filter Dropdowns
    if (this.options.showFilters) {
      AnalyticsToolbar.defaultFilters().forEach(f => {
        const filter = new FilterDropdown({
          label:    f.label,
          items:    f.items,
          onChange: (val) => console.log(`[AnalyticsToolbar] Filter changed: ${f.label} = ${val}`)
        });
        toolbar.appendChild(filter.render());
      });
      toolbar.appendChild(new ToolbarDivider().render());
    }

    // 4. Spacer — pushes right-side actions to far right
    const spacer = document.createElement("div");
    spacer.className = "toolbar-spacer";
    toolbar.appendChild(spacer);

    // 5. Refresh Button
    if (this.options.showRefresh) {
      toolbar.appendChild(new RefreshButton({ onRefresh: this.options.onRefresh }).render());
    }

    // 6. Export Menu
    if (this.options.showExport) {
      toolbar.appendChild(new ExportMenu({ onExport: this.options.onExport }).render());
    }

    // 7. Chart Settings
    if (this.options.showSettings) {
      toolbar.appendChild(new ChartSettings().render());
    }

    // 8. Full Screen Toggle
    if (this.options.showFullScreen) {
      toolbar.appendChild(new FullScreenButton({ onFullScreen: this.options.onFullScreen }).render());
    }

    // 9. More Actions
    if (this.options.showMoreActions) {
      toolbar.appendChild(new MoreActionsMenu().render());
    }

    this.element = toolbar;
    return toolbar;
  }
}
