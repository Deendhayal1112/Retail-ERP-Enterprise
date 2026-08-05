/**
 * DashboardCustomizer.js
 * Retail ERP Enterprise — Dashboard Widget Customization Panel Component
 *
 * Implements:
 * - DashboardCustomizer (Side drawer panel coordinator)
 * - WidgetManager (List container for widgets editor cards)
 * - WidgetSettings (Collapse/Expand settings sliders)
 * - VisibilityToggle (Show/Hide/Pin switch buttons)
 * - WidgetLayoutEditor (Width span selection selectors)
 * - ResetLayoutDialog (Confirmation layout footer buttons)
 */

"use strict";

export class VisibilityToggle {
  /**
   * @param {Object}   options
   * @param {boolean}  options.visible      Active visibility state
   * @param {Function} options.onVisibility Callback when visibility toggled
   */
  constructor(options = {}) {
    this.visible = options.visible !== undefined ? options.visible : true;
    this.onVisibility = options.onVisibility || null;
  }

  render() {
    const btn = document.createElement("button");
    btn.className = `customizer-toggle-btn ${this.visible ? "visible" : "hidden"}`;
    btn.setAttribute("aria-label", this.visible ? "Hide widget" : "Show widget");
    btn.innerHTML = this.visible ? "👁️" : "👁️‍🗨️";

    if (this.onVisibility) {
      btn.addEventListener("click", () => this.onVisibility());
    }

    return btn;
  }
}

export class WidgetLayoutEditor {
  /**
   * @param {Object}   options
   * @param {number}   options.span         Grid column span index (e.g. 4, 6, 8, 12)
   * @param {Function} options.onSpanChange Callback when span changes
   */
  constructor(options = {}) {
    this.span = options.span || 12;
    this.onSpanChange = options.onSpanChange || null;
  }

  render() {
    const select = document.createElement("select");
    select.className = "customizer-width-select";
    select.setAttribute("aria-label", "Select widget column span");

    const options = [
      { span: 4,  text: "Narrow (1/3 Width)" },
      { span: 6,  text: "Half Size (1/2 Width)" },
      { span: 8,  text: "Wide Size (2/3 Width)" },
      { span: 12, text: "Full Size (12 Columns)" }
    ];

    options.forEach(opt => {
      const el = document.createElement("option");
      el.value = opt.span;
      el.textContent = opt.text;
      if (opt.span === this.span) el.selected = true;
      select.appendChild(el);
    });

    if (this.onSpanChange) {
      select.addEventListener("change", (e) => {
        this.onSpanChange(parseInt(e.target.value, 10));
      });
    }

    return select;
  }
}

export class WidgetSettings {
  /**
   * @param {Object}   options
   * @param {boolean}  options.collapsed      Active collapse state
   * @param {Function} options.onToggleCollapse Callback when collapse toggled
   */
  constructor(options = {}) {
    this.collapsed = options.collapsed !== undefined ? options.collapsed : false;
    this.onToggleCollapse = options.onToggleCollapse || null;
  }

  render() {
    const btn = document.createElement("button");
    btn.className = "customizer-toggle-btn";
    btn.setAttribute("aria-label", this.collapsed ? "Expand widget" : "Collapse widget");
    btn.innerHTML = this.collapsed ? "⊞" : "⊟";

    if (this.onToggleCollapse) {
      btn.addEventListener("click", () => this.onToggleCollapse());
    }

    return btn;
  }
}

export class WidgetManager {
  /**
   * @param {Object}   options
   * @param {string}   options.id           Widget identifier
   * @param {string}   options.name         Display label
   * @param {boolean}  options.visible      Active visibility
   * @param {boolean}  options.pinned       Active pin state
   * @param {boolean}  options.collapsed    Active collapse state
   * @param {number}   options.span         Column width span index
   * @param {Function} options.onChange     State change notifier callback
   */
  constructor(options = {}) {
    this.id        = options.id        || "";
    this.name      = options.name      || "Widget Name";
    this.visible   = options.visible !== undefined ? options.visible : true;
    this.pinned    = options.pinned !== undefined ? options.pinned : false;
    this.collapsed = options.collapsed !== undefined ? options.collapsed : false;
    this.span      = options.span      || 12;
    this.onChange  = options.onChange  || null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "customizer-widget-card";

    // Top Header: Widget Name + Visibility switches
    const top = document.createElement("div");
    top.className = "customizer-widget-top";

    const info = document.createElement("div");
    info.className = "customizer-widget-info";
    info.innerHTML = `<span class="customizer-drag-handle" title="Drag to reorder (Placeholder)">☰</span><span>${this.name}</span>`;
    top.appendChild(info);

    const actions = document.createElement("div");
    actions.className = "customizer-widget-actions";

    // Toggle Collapse
    const setting = new WidgetSettings({
      collapsed: this.collapsed,
      onToggleCollapse: () => {
        this.collapsed = !this.collapsed;
        console.log(`[DashboardCustomizer] Collapse toggle: ${this.name} = ${this.collapsed}`);
        if (this.onChange) this.onChange();
      }
    });
    actions.appendChild(setting.render());

    // Pin State Toggle
    const pinBtn = document.createElement("button");
    pinBtn.className = `customizer-pin-btn ${this.pinned ? "pinned" : "unpinned"}`;
    pinBtn.setAttribute("aria-label", this.pinned ? "Unpin widget" : "Pin widget");
    pinBtn.innerHTML = "📌";
    pinBtn.addEventListener("click", () => {
      this.pinned = !this.pinned;
      pinBtn.className = `customizer-pin-btn ${this.pinned ? "pinned" : "unpinned"}`;
      console.log(`[DashboardCustomizer] Pin toggle: ${this.name} = ${this.pinned}`);
      if (this.onChange) this.onChange();
    });
    actions.appendChild(pinBtn);

    // Visibility Toggle
    const toggle = new VisibilityToggle({
      visible: this.visible,
      onVisibility: () => {
        this.visible = !this.visible;
        console.log(`[DashboardCustomizer] Visibility toggle: ${this.name} = ${this.visible}`);
        if (this.onChange) this.onChange();
      }
    });
    actions.appendChild(toggle.render());

    top.appendChild(actions);
    card.appendChild(top);

    // Bottom Layout Editor: Width selects + Drag handles placeholders
    const layoutRow = document.createElement("div");
    layoutRow.className = "customizer-layout-controls";
    layoutRow.innerHTML = `<span>Column Width Span:</span>`;

    const editor = new WidgetLayoutEditor({
      span: this.span,
      onSpanChange: (newSpan) => {
        this.span = newSpan;
        console.log(`[DashboardCustomizer] Column span changed: ${this.name} = ${newSpan}`);
        if (this.onChange) this.onChange();
      }
    });
    layoutRow.appendChild(editor.render());

    card.appendChild(layoutRow);
    return card;
  }
}

export class ResetLayoutDialog {
  /**
   * @param {Object}   options
   * @param {Function} options.onReset   Action when Layout is reset
   * @param {Function} options.onRestore Action when defaults are restored
   */
  constructor(options = {}) {
    this.onReset   = options.onReset   || null;
    this.onRestore = options.onRestore || null;
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "customizer-action-row";

    const resetBtn = document.createElement("button");
    resetBtn.className = "customizer-secondary-btn";
    resetBtn.textContent = "Reset Layout";
    resetBtn.addEventListener("click", () => {
      console.log("[DashboardCustomizer Action] Resetting custom grids layout configurations.");
      if (this.onReset) this.onReset();
    });
    wrap.appendChild(resetBtn);

    const restoreBtn = document.createElement("button");
    restoreBtn.className = "customizer-primary-btn";
    restoreBtn.textContent = "Restore Defaults";
    restoreBtn.addEventListener("click", () => {
      console.log("[DashboardCustomizer Action] Restoring initial system layout templates.");
      if (this.onRestore) this.onRestore();
    });
    wrap.appendChild(restoreBtn);

    return wrap;
  }
}

// ─────────────────────────────────────────────────────
// MAIN DASHBOARD CUSTOMIZER COMPONENT DRAWER
// ─────────────────────────────────────────────────────

export default class DashboardCustomizer {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
    this.active  = false;

    // Static placeholder index items
    this.widgets = [
      { id: "mini_kpis",  name: "Executive Mini KPIs",  visible: true,  pinned: true,  collapsed: false, span: 12 },
      { id: "sales_trend", name: "Sales Trend Chart",     visible: true,  pinned: false, collapsed: false, span: 8  },
      { id: "rev_trend",   name: "Revenue Analytics",     visible: true,  pinned: false, collapsed: false, span: 4  },
      { id: "inv_dist",    name: "Inventory Summary",     visible: true,  pinned: false, collapsed: false, span: 6  },
      { id: "cat_sales",   name: "Category Sales Chart",  visible: true,  pinned: false, collapsed: false, span: 6  },
      { id: "comparison",  name: "Period Comparison",     visible: true,  pinned: false, collapsed: false, span: 12 }
    ];
  }

  toggle(forceState) {
    this.active = forceState !== undefined ? forceState : !this.active;
    if (this.element) {
      this.element.classList.toggle("active", this.active);
    }
  }

  _updateContent() {
    const list = this.element.querySelector(".customizer-body");
    if (!list) return;

    list.innerHTML = "";

    const sectionTitle = document.createElement("span");
    sectionTitle.className = "customizer-section-title";
    sectionTitle.textContent = "Active Grid Widgets";
    list.appendChild(sectionTitle);

    this.widgets.forEach(w => {
      const card = new WidgetManager({
        id:        w.id,
        name:      w.name,
        visible:   w.visible,
        pinned:    w.pinned,
        collapsed: w.collapsed,
        span:      w.span,
        onChange:  () => this._updateContent()
      });
      list.appendChild(card.render());
    });
  }

  render() {
    const backdrop = document.createElement("div");
    backdrop.className = "customizer-backdrop";

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) this.toggle(false);
    });

    const drawer = document.createElement("div");
    drawer.className = "customizer-drawer";

    // Drawer Header
    const header = document.createElement("header");
    header.className = "customizer-header";
    header.innerHTML = `
      <div class="customizer-title-group">
        <h3 class="customizer-title">Dashboard Customizer</h3>
        <span class="customizer-subtitle">Configure operational widget zones</span>
      </div>
    `;

    const closeBtn = document.createElement("button");
    closeBtn.className = "customizer-close-btn";
    closeBtn.innerHTML = "✕";
    closeBtn.setAttribute("aria-label", "Close layout customizer panel");
    closeBtn.addEventListener("click", () => this.toggle(false));
    header.appendChild(closeBtn);
    drawer.appendChild(header);

    // Drawer Body
    const body = document.createElement("div");
    body.className = "customizer-body";
    drawer.appendChild(body);

    // Drawer Footer
    const footer = document.createElement("footer");
    footer.className = "customizer-footer";

    const dialogRow = new ResetLayoutDialog({
      onReset: () => console.log("[DashboardCustomizer] Grid layout cleared."),
      onRestore: () => console.log("[DashboardCustomizer] Initial dashboard grid settings loaded.")
    });
    footer.appendChild(dialogRow.render());
    drawer.appendChild(footer);

    backdrop.appendChild(drawer);
    this.element = backdrop;

    this._updateContent();

    return backdrop;
  }
}
