/**
 * AppearanceSettings.js
 * Retail ERP Enterprise — Reusable Appearance Settings Module Component
 *
 * Implements:
 * - AppearanceSettings (Master page wrapper grouping all configuration categories and preview panel)
 * - ThemeSelector      (Theme selection tiles: Light, Dark, System, High Contrast)
 * - ColorPicker        (Accent color circles list with hex display labels)
 * - LayoutSettings     (Toggles for Compact Mode, Comfort parameters, animations)
 * - NavigationSettings (Sidebar widths and styles dropdown options)
 * - DashboardAppearance(Widget densities, default dashboard theme dropdowns)
 * - ThemePreview       (Live interactive mock UI panel)
 * - AppearanceToolbar  (Header action buttons reset defaults)
 */

"use strict";

export class ThemeSelector {
  /**
   * @param {Object}   options
   * @param {string}   options.activeTheme Default theme key
   * @param {Function} options.onChange    Callback theme selection change
   */
  constructor(options = {}) {
    this.activeTheme = options.activeTheme || "system";
    this.onChange    = options.onChange    || null;

    this.themes = [
      { key: "light",         label: "Light Theme",         icon: "☀️" },
      { key: "dark",          label: "Dark Theme",          icon: "🌙" },
      { key: "system",        label: "System default",       icon: "💻" },
      { key: "high-contrast", label: "High Contrast",       icon: "👁️" }
    ];
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "theme-selector-grid";

    this.themes.forEach(t => {
      const btn = document.createElement("button");
      btn.className = `theme-card-btn${t.key === this.activeTheme ? " active" : ""}`;
      btn.innerHTML = `
        <span class="theme-card-icon">${t.icon}</span>
        <span class="theme-card-label">${t.label}</span>
      `;
      btn.addEventListener("click", () => {
        grid.querySelectorAll(".theme-card-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeTheme = t.key;
        if (this.onChange) this.onChange(t.key);
      });
      grid.appendChild(btn);
    });

    return grid;
  }
}

export class ColorPicker {
  /**
   * @param {Object}   options
   * @param {string}   options.activeColor Selected color name
   * @param {Function} options.onChange    Callback on color click
   */
  constructor(options = {}) {
    this.activeColor = options.activeColor || "blue";
    this.onChange    = options.onChange    || null;

    this.colors = ["blue", "green", "purple", "orange", "red"];
  }

  render() {
    const row = document.createElement("div");
    row.className = "accent-colors-picker-row";

    this.colors.forEach(c => {
      const btn = document.createElement("button");
      btn.className = `accent-color-btn ${c}${c === this.activeColor ? " active" : ""}`;
      btn.title = `${c.charAt(0).toUpperCase() + c.slice(1)} Accent`;

      btn.addEventListener("click", () => {
        row.querySelectorAll(".accent-color-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeColor = c;
        if (this.onChange) this.onChange(c);
      });

      row.appendChild(btn);
    });

    // Custom Color picker placeholder
    const custom = document.createElement("div");
    custom.className = "custom-picker-group";
    custom.innerHTML = `
      <input type="color" value="#6366f1" style="border:none; width:16px; height:16px; cursor:pointer;" />
      <span>Custom Hex</span>
    `;
    row.appendChild(custom);

    return row;
  }
}

export class LayoutSettings {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default toggler configurations state
   * @param {Function} options.onUpdate Callback on updates dispatch
   */
  constructor(options = {}) {
    this.state    = options.state    || { compact: false, comfortable: true, denseTables: false, rounded: true, glass: false, animations: true };
    this.onUpdate = options.onUpdate || null;
  }

  _createToggle(checked = true, key = "") {
    const sw = document.createElement("div");
    sw.className = `appearance-toggle${checked ? "" : " off"}`;
    sw.addEventListener("click", () => {
      const isOff = sw.classList.toggle("off");
      this.state[key] = !isOff;
      console.log(`[Layout config] ${key} toggled = ${!isOff}`);
      if (this.onUpdate) this.onUpdate(this.state);
    });
    return sw;
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "appearance-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "appearance-option-row";
      row.innerHTML = `
        <div class="appearance-option-label-group">
          <span class="appearance-option-title">${title}</span>
          <span class="appearance-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Compact Sizing mode", "Compresses padding bounds globally", this._createToggle(this.state.compact, "compact")));
    grid.appendChild(createRow("Dense Data Tables", "Sets padding layout grid within data tables", this._createToggle(this.state.denseTables, "denseTables")));
    grid.appendChild(createRow("Rounded Corners (16px)", "Renders container card frames using rounded radius", this._createToggle(this.state.rounded, "rounded")));
    grid.appendChild(createRow("Glass Effect Layouts", "Applies backdrop blurs inside header navigations", this._createToggle(this.state.glass, "glass")));
    grid.appendChild(createRow("Animations Toggle", "Enable transitions sliding boxes inside dashboards", this._createToggle(this.state.animations, "animations")));

    return grid;
  }
}

export class NavigationSettings {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default select configuration parameters
   * @param {Function} options.onUpdate Callback on values change
   */
  constructor(options = {}) {
    this.state    = options.state    || { sidebarWidth: "220px", sidebarCollapse: "expanded", navStyle: "Classic nav links", iconSize: "Medium (16px)" };
    this.onUpdate = options.onUpdate || null;
  }

  _createSelect(options = [], selected = "", key = "") {
    const sel = document.createElement("select");
    sel.className = "appearance-select";
    options.forEach(opt => {
      const el = document.createElement("option");
      el.value = opt.toLowerCase().replace(/\s+/g, "_");
      el.textContent = opt;
      if (opt === selected) el.selected = true;
      sel.appendChild(el);
    });

    sel.addEventListener("change", (e) => {
      this.state[key] = e.target.value;
      if (this.onUpdate) this.onUpdate(this.state);
    });

    return sel;
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "appearance-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "appearance-option-row";
      row.innerHTML = `
        <div class="appearance-option-label-group">
          <span class="appearance-option-title">${title}</span>
          <span class="appearance-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Sidebar Navigation Width", "Select standard width layout", this._createSelect(["240px wide", "220px wide", "200px wide"], this.state.sidebarWidth, "sidebarWidth")));
    grid.appendChild(createRow("Default Sidebar state", "Set initial sidebar load width state", this._createSelect(["Expanded sidebar", "Collapsed sidebar"], this.state.sidebarCollapse, "sidebarCollapse")));
    grid.appendChild(createRow("Sidebar Icons Sizing", "Select size representation within lists", this._createSelect(["Small (14px)", "Medium (16px)", "Large (20px)"], this.state.iconSize, "iconSize")));

    return grid;
  }
}

export class DashboardAppearance {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default dashboard appearance states
   * @param {Function} options.onUpdate Callback on values change
   */
  constructor(options = {}) {
    this.state    = options.state    || { density: "Comfortable layout", cardStyle: "Flat panel card", chartTheme: "Vibrant gradients" };
    this.onUpdate = options.onUpdate || null;
  }

  _createSelect(options = [], selected = "", key = "") {
    const sel = document.createElement("select");
    sel.className = "appearance-select";
    options.forEach(opt => {
      const el = document.createElement("option");
      el.value = opt.toLowerCase().replace(/\s+/g, "_");
      el.textContent = opt;
      if (opt === selected) el.selected = true;
      sel.appendChild(el);
    });

    sel.addEventListener("change", (e) => {
      this.state[key] = e.target.value;
      if (this.onUpdate) this.onUpdate(this.state);
    });

    return sel;
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "appearance-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "appearance-option-row";
      row.innerHTML = `
        <div class="appearance-option-label-group">
          <span class="appearance-option-title">${title}</span>
          <span class="appearance-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Widgets Sizing Density", "Grid spacing within dashboard lists", this._createSelect(["Comfortable layout", "Compact layout", "Full screen stretch"], this.state.density, "density")));
    grid.appendChild(createRow("Metrics Card Style theme", "Apply border styles to cards", this._createSelect(["Flat panel card", "Shadow container box", "Outline clean box"], this.state.cardStyle, "cardStyle")));
    grid.appendChild(createRow("Visual Chart Color Theme", "Choose gradient schemes mappings", this._createSelect(["Vibrant gradients", "Corporate solid colors", "Monochromatic shades"], this.state.chartTheme, "chartTheme")));

    return grid;
  }
}

export class ThemePreview {
  /**
   * @param {Object} options
   * @param {Object} options.settings Configuration settings map
   */
  constructor(options = {}) {
    this.settings = options.settings || { theme: "system", accent: "blue", compact: false, glass: false };
    this.element  = null;
  }

  _updatePreviewClasses() {
    if (!this.element) return;
    const frame = this.element.querySelector(".mock-window-frame");
    if (!frame) return;

    frame.className = "mock-window-frame";

    // Add classes matching settings
    if (this.settings.theme === "dark") frame.classList.add("dark-theme");
    if (this.settings.theme === "high-contrast") frame.classList.add("high-contrast");
    if (this.settings.compact) frame.classList.add("compact-mode");
    if (this.settings.glass) frame.classList.add("glass-effect");

    // Map accent border color styles
    frame.style.borderTop = `3px solid var(--primary-500)`;
    if (this.settings.accent === "green") frame.style.borderTop = `3px solid var(--success-500)`;
    if (this.settings.accent === "purple") frame.style.borderTop = `3px solid var(--accent-500)`;
    if (this.settings.accent === "orange") frame.style.borderTop = `3px solid #f59e0b`;
    if (this.settings.accent === "red") frame.style.borderTop = `3px solid var(--danger-500)`;
  }

  render() {
    const pane = document.createElement("aside");
    pane.className = "appearance-preview-column";

    pane.innerHTML = `
      <h5 class="preview-title">Live Preview Window</h5>
      <div class="mock-window-frame">
        <header class="mock-titlebar">
          <div class="mock-window-dot"></div>
          <div class="mock-window-dot"></div>
          <div class="mock-window-dot"></div>
          <div style="font-size:0.6rem; color:var(--text-muted); margin-left:6px; font-weight:700;">Retail ERP Enterprise Mock</div>
        </header>
        <div class="mock-layout-split">
          <div class="mock-sidebar">
            <div class="mock-sidebar-line" style="width:70%;"></div>
            <div class="mock-sidebar-line" style="width:50%;"></div>
            <div class="mock-sidebar-line" style="width:60%;"></div>
          </div>
          <div class="mock-body">
            <div class="mock-body-header"></div>
            <div class="mock-dashboard-grid">
              <div class="mock-card-box">
                <div class="mock-card-line" style="width:70%;"></div>
                <div class="mock-card-line" style="width:40%;"></div>
              </div>
              <div class="mock-card-box">
                <div class="mock-card-line" style="width:60%;"></div>
                <div class="mock-card-line" style="width:30%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.element = pane;
    this._updatePreviewClasses();

    return pane;
  }
}

export class AppearanceToolbar {
  /**
   * @param {Object}   options
   * @param {Function} options.onReset   Reset parameters callback
   * @param {Function} options.onConfirm Save configs callback
   */
  constructor(options = {}) {
    this.onReset   = options.onReset   || null;
    this.onConfirm = options.onConfirm || null;
  }

  render() {
    const row = document.createElement("div");
    row.className = "permission-toolbar-row";

    row.innerHTML = `
      <span class="permission-toolbar-left">Appearance Editor</span>
    `;

    const actions = document.createElement("div");
    actions.className = "permission-toolbar-actions";

    const resetBtn = document.createElement("button");
    resetBtn.className = "role-btn";
    resetBtn.textContent = "Reset Defaults";
    resetBtn.addEventListener("click", () => {
      console.log("[Appearance Actions] Resetting appearance preferences properties.");
      if (this.onReset) this.onReset();
    });
    actions.appendChild(resetBtn);

    const saveBtn = document.createElement("button");
    saveBtn.className = "role-btn primary";
    saveBtn.textContent = "Apply Theme settings";
    saveBtn.addEventListener("click", () => {
      console.log("[Appearance Actions] Saving updated layout settings parameters.");
      if (this.onConfirm) this.onConfirm();
    });
    actions.appendChild(saveBtn);

    row.appendChild(actions);
    return row;
  }
}

// ─────────────────────────────────────────────────────
// MAIN APPEARANCE SETTINGS COORDINATOR VIEW
// ─────────────────────────────────────────────────────

export default class AppearanceSettings {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Master appearance configs state
    this.settings = {
      theme: "system",
      accent: "blue",
      compact: false,
      denseTables: false,
      rounded: true,
      glass: false,
      animations: true,
      sidebarWidth: "220px_wide",
      sidebarCollapse: "expanded_sidebar",
      iconSize: "medium_(16px)",
      density: "comfortable_layout",
      cardStyle: "flat_panel_card",
      chartTheme: "vibrant_gradients"
    };

    this.previewComponent = null;
  }

  _updateWorkspace() {
    if (this.previewComponent) {
      this.previewComponent.settings = {
        theme: this.settings.theme,
        accent: this.settings.accent,
        compact: this.settings.compact,
        glass: this.settings.glass
      };
      this.previewComponent._updatePreviewClasses();
    }
  }

  render() {
    const container = document.createElement("div");
    container.className = "appearance-settings-container";

    // Left Panel: Form Settings Lists
    const formsCol = document.createElement("div");
    formsCol.className = "appearance-forms-column";

    // 1. Toolbar
    formsCol.appendChild(new AppearanceToolbar({
      onReset: () => {
        this.settings.theme = "system";
        this.settings.accent = "blue";
        this.settings.compact = false;
        this.settings.glass = false;
        this._updateWorkspace();
      },
      onConfirm: () => {
        console.log("[Appearance] Applying themes configurations changes.");
      }
    }).render());

    // 2. Themes Section Card
    const themeSec = document.createElement("div");
    themeSec.className = "appearance-section-card";
    themeSec.innerHTML = `
      <header class="appearance-section-header">
        <h5 class="appearance-section-title">Color Themes Style</h5>
      </header>
    `;
    const themeSel = new ThemeSelector({
      activeTheme: this.settings.theme,
      onChange: (tKey) => {
        this.settings.theme = tKey;
        this._updateWorkspace();
      }
    });
    themeSec.appendChild(themeSel.render());
    formsCol.appendChild(themeSec);

    // 3. Color Accents Section Card
    const accentSec = document.createElement("div");
    accentSec.className = "appearance-section-card";
    accentSec.innerHTML = `
      <header class="appearance-section-header">
        <h5 class="appearance-section-title">Focus Accent Color</h5>
      </header>
    `;
    const colorPick = new ColorPicker({
      activeColor: this.settings.accent,
      onChange: (colorName) => {
        this.settings.accent = colorName;
        this._updateWorkspace();
      }
    });
    accentSec.appendChild(colorPick.render());
    formsCol.appendChild(accentSec);

    // 4. Layout Settings Section Card
    const layoutSec = document.createElement("div");
    layoutSec.className = "appearance-section-card";
    layoutSec.innerHTML = `
      <header class="appearance-section-header">
        <h5 class="appearance-section-title">Workspace Layout Options</h5>
      </header>
    `;
    const layoutObj = new LayoutSettings({
      state: {
        compact: this.settings.compact,
        denseTables: this.settings.denseTables,
        rounded: this.settings.rounded,
        glass: this.settings.glass,
        animations: this.settings.animations
      },
      onUpdate: (newLayoutState) => {
        this.settings = { ...this.settings, ...newLayoutState };
        this._updateWorkspace();
      }
    });
    layoutSec.appendChild(layoutObj.render());
    formsCol.appendChild(layoutSec);

    // 5. Navigation Settings Section Card
    const navSec = document.createElement("div");
    navSec.className = "appearance-section-card";
    navSec.innerHTML = `
      <header class="appearance-section-header">
        <h5 class="appearance-section-title">Navigation Options</h5>
      </header>
    `;
    const navObj = new NavigationSettings({
      state: {
        sidebarWidth: this.settings.sidebarWidth,
        sidebarCollapse: this.settings.sidebarCollapse,
        iconSize: this.settings.iconSize
      },
      onUpdate: (newNavState) => {
        this.settings = { ...this.settings, ...newNavState };
        this._updateWorkspace();
      }
    });
    navSec.appendChild(navObj.render());
    formsCol.appendChild(navSec);

    // 6. Dashboard Appearance Section Card
    const dashSec = document.createElement("div");
    dashSec.className = "appearance-section-card";
    dashSec.innerHTML = `
      <header class="appearance-section-header">
        <h5 class="appearance-section-title">Dashboard Telemetry Themes</h5>
      </header>
    `;
    const dashObj = new DashboardAppearance({
      state: {
        density: this.settings.density,
        cardStyle: this.settings.cardStyle,
        chartTheme: this.settings.chartTheme
      },
      onUpdate: (newDashState) => {
        this.settings = { ...this.settings, ...newDashState };
        this._updateWorkspace();
      }
    });
    dashSec.appendChild(dashObj.render());
    formsCol.appendChild(dashSec);

    container.appendChild(formsCol);

    // Right Panel: Live Window Preview
    this.previewComponent = new ThemePreview({
      settings: {
        theme: this.settings.theme,
        accent: this.settings.accent,
        compact: this.settings.compact,
        glass: this.settings.glass
      }
    });
    container.appendChild(this.previewComponent.render());

    this.element = container;

    return container;
  }
}
