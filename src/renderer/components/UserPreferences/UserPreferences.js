/**
 * UserPreferences.js
 * Retail ERP Enterprise — User Preferences Configuration Panel Component
 *
 * Implements:
 * - UserPreferences (Master configuration page coordinator)
 * - PreferenceSection (Section header card wrapper layout)
 * - ThemeSelector (Visual theme pill tab triggers)
 * - DashboardPreferences (Banner/KPI toggle items list)
 * - NotificationPreferences (Sound/Alert options togglers)
 * - LocalizationPreferences (Timezone/Currency selects)
 * - PreferenceToggle (Active/Muted toggler control)
 * - PreferenceDropdown (Standard dropdown selectors fields)
 */

"use strict";

export class PreferenceToggle {
  /**
   * @param {Object}   options
   * @param {boolean}  options.checked   Initial state
   * @param {Function} options.onChange  Callback on state change
   */
  constructor(options = {}) {
    this.checked  = options.checked !== undefined ? options.checked : true;
    this.onChange = options.onChange || null;
  }

  render() {
    const sw = document.createElement("div");
    sw.className = `preference-toggle-switch${this.checked ? "" : " off"}`;
    sw.setAttribute("role", "switch");
    sw.setAttribute("aria-checked", this.checked ? "true" : "false");

    sw.addEventListener("click", () => {
      this.checked = !this.checked;
      sw.classList.toggle("off", !this.checked);
      sw.setAttribute("aria-checked", this.checked ? "true" : "false");
      if (this.onChange) this.onChange(this.checked);
    });

    return sw;
  }
}

export class PreferenceDropdown {
  /**
   * @param {Object}   options
   * @param {string[]} options.options   Select tag values list
   * @param {string}   options.selected  Default selected key
   * @param {Function} options.onChange  Callback on change
   */
  constructor(options = {}) {
    this.options  = options.options  || [];
    this.selected = options.selected || "";
    this.onChange = options.onChange || null;
  }

  render() {
    const select = document.createElement("select");
    select.className = "preference-select-dropdown";
    select.setAttribute("aria-label", "Select workspace option");

    this.options.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.toLowerCase().replace(/\s+/g, "_");
      opt.textContent = item;
      if (item === this.selected) opt.selected = true;
      select.appendChild(opt);
    });

    if (this.onChange) {
      select.addEventListener("change", (e) => this.onChange(e.target.value));
    }

    return select;
  }
}

export class ThemeSelector {
  /**
   * @param {Object}   options
   * @param {string}   options.activeTheme Default theme value
   * @param {Function} options.onChange    Callback when theme changes
   */
  constructor(options = {}) {
    this.activeTheme = options.activeTheme || "system";
    this.onChange    = options.onChange    || null;
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "theme-selector-group";

    const themes = ["Light Theme", "Dark Theme", "System Theme"];

    themes.forEach(t => {
      const key = t.toLowerCase().split(" ")[0];
      const btn = document.createElement("button");
      btn.className = `theme-pill-btn${key === this.activeTheme ? " active" : ""}`;
      btn.textContent = t;
      btn.addEventListener("click", () => {
        wrap.querySelectorAll(".theme-pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        console.log(`[UserPreferences] Workspace theme set to: ${key}`);
        if (this.onChange) this.onChange(key);
      });
      wrap.appendChild(btn);
    });

    return wrap;
  }
}

export class PreferenceSection {
  /**
   * @param {Object} options
   * @param {string} options.title    Category header label
   * @param {string} options.subtitle Category sub-text summary description
   */
  constructor(options = {}) {
    this.title    = options.title    || "Preference Section";
    this.subtitle = options.subtitle || "Preferences category description";
  }

  render(controls = []) {
    const card = document.createElement("div");
    card.className = "preference-section-card";

    // Section header
    card.innerHTML = `
      <header class="preference-section-header">
        <h4 class="preference-section-title">${this.title}</h4>
        <span class="preference-section-subtitle">${this.subtitle}</span>
      </header>
    `;

    // Append controls list
    controls.forEach(ctrl => card.appendChild(ctrl));

    return card;
  }
}

export class DashboardPreferences {
  constructor(options = {}) {
    this.options = {
      showBanner: true,
      showKPI:    true,
      showCharts: true,
      compact:    false,
      page:       "Dashboard",
      ...options
    };
  }

  render() {
    const list = [];

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "preference-control-row";
      row.innerHTML = `
        <div class="preference-control-label-group">
          <span class="preference-control-title">${title}</span>
          <span class="preference-control-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    list.push(createRow("Show Welcome Banner", "Display welcome heading block at top of dashboard views", new PreferenceToggle({
      checked: this.options.showBanner,
      onChange: (val) => console.log(`[UserPreferences] Dashboard showBanner = ${val}`)
    }).render()));

    list.push(createRow("Show KPI Scorecards", "Display totals statistics counts grids row", new PreferenceToggle({
      checked: this.options.showKPI,
      onChange: (val) => console.log(`[UserPreferences] Dashboard showKPI = ${val}`)
    }).render()));

    list.push(createRow("Show Visual Charts", "Display progression comparison bars analytics", new PreferenceToggle({
      checked: this.options.showCharts,
      onChange: (val) => console.log(`[UserPreferences] Dashboard showCharts = ${val}`)
    }).render()));

    list.push(createRow("Compact Grids Layout", "Optimize container sizing heights to squeeze paddings", new PreferenceToggle({
      checked: this.options.compact,
      onChange: (val) => console.log(`[UserPreferences] Dashboard compact = ${val}`)
    }).render()));

    list.push(createRow("Default Landing Page", "Select initial route window mounts on user credentials login success", new PreferenceDropdown({
      options: ["Dashboard", "Products", "Inventory", "Sales", "Settings"],
      selected: this.options.page,
      onChange: (val) => console.log(`[UserPreferences] Dashboard landing page = ${val}`)
    }).render()));

    return list;
  }
}

export class NotificationPreferences {
  constructor(options = {}) {
    this.options = {
      desktop: true,
      sound:   false,
      summary: true,
      ...options
    };
  }

  render() {
    const list = [];

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "preference-control-row";
      row.innerHTML = `
        <div class="preference-control-label-group">
          <span class="preference-control-title">${title}</span>
          <span class="preference-control-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    list.push(createRow("Desktop Notifications", "Enable system alerts messages triggers on dashboard overlay", new PreferenceToggle({
      checked: this.options.desktop,
      onChange: (val) => console.log(`[UserPreferences] Notification desktop = ${val}`)
    }).render()));

    list.push(createRow("Sound Alerts Playback", "Play audio chime trigger alerts on error thresholds", new PreferenceToggle({
      checked: this.options.sound,
      onChange: (val) => console.log(`[UserPreferences] Notification sound = ${val}`)
    }).render()));

    list.push(createRow("Daily Summary Mail", "Generate automated financial logs dispatch digests", new PreferenceToggle({
      checked: this.options.summary,
      onChange: (val) => console.log(`[UserPreferences] Notification daily summary = ${val}`)
    }).render()));

    return list;
  }
}

export class LocalizationPreferences {
  constructor(options = {}) {
    this.options = {
      lang:     "English (US)",
      timezone: "UTC -05:00",
      currency: "USD ($)",
      ...options
    };
  }

  render() {
    const list = [];

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "preference-control-row";
      row.innerHTML = `
        <div class="preference-control-label-group">
          <span class="preference-control-title">${title}</span>
          <span class="preference-control-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    list.push(createRow("Workspace Language", "Select locale dictionary mapping variables", new PreferenceDropdown({
      options: ["English (US)", "Spanish (ES)", "French (FR)", "German (DE)"],
      selected: this.options.lang,
      onChange: (val) => console.log(`[UserPreferences] Localize language = ${val}`)
    }).render()));

    list.push(createRow("System Time Zone", "Set time standard indicators offsets", new PreferenceDropdown({
      options: ["UTC -05:00", "UTC +00:00", "UTC +05:30", "UTC +08:00"],
      selected: this.options.timezone,
      onChange: (val) => console.log(`[UserPreferences] Localize timezone = ${val}`)
    }).render()));

    list.push(createRow("Display Currency", "Select base notation representing values metrics", new PreferenceDropdown({
      options: ["USD ($)", "EUR (€)", "GBP (£)", "INR (₹)"],
      selected: this.options.currency,
      onChange: (val) => console.log(`[UserPreferences] Localize currency = ${val}`)
    }).render()));

    return list;
  }
}

// ─────────────────────────────────────────────────────
// MAIN USER PREFERENCES VIEW CONTROLLER
// ─────────────────────────────────────────────────────

export default class UserPreferences {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const container = document.createElement("div");
    container.className = "user-preferences-container";

    // 1. Title Header
    container.innerHTML = `
      <header class="preferences-page-header">
        <h3 class="preferences-page-title">User Preferences Settings</h3>
        <span class="preferences-page-subtitle">Configure personalized workspace layouts and alerts templates</span>
      </header>
    `;

    const grid = document.createElement("div");
    grid.className = "preferences-sections-grid";

    // A. Appearance Section Card (Theme controls + color accent)
    const appearanceSec = new PreferenceSection({
      title: "Appearance Configuration",
      subtitle: "Customize themes styles color indices"
    });

    const appearanceControls = [];

    // Theme selector
    const themeRow = document.createElement("div");
    themeRow.className = "preference-control-row";
    themeRow.innerHTML = `
      <div class="preference-control-label-group">
        <span class="preference-control-title">Interface Visual Style</span>
        <span class="preference-control-desc">Select workspace coloring theme preset</span>
      </div>
    `;
    themeRow.appendChild(new ThemeSelector().render());
    appearanceControls.push(themeRow);

    // Accent selector
    const accentRow = document.createElement("div");
    accentRow.className = "preference-control-row";
    accentRow.innerHTML = `
      <div class="preference-control-label-group">
        <span class="preference-control-title">System Focus Accent Color</span>
        <span class="preference-control-desc">Choose visual indicators focus theme color highlights</span>
      </div>
      <div class="accent-colors-list">
        <div class="accent-color-circle blue active" data-color="blue" title="Indigo Blue"></div>
        <div class="accent-color-circle purple" data-color="purple" title="Royal Violet"></div>
        <div class="accent-color-circle green" data-color="green" title="Success Emerald"></div>
        <div class="accent-color-circle amber" data-color="amber" title="Amber Orange"></div>
      </div>
    `;
    appearanceControls.push(accentRow);

    grid.appendChild(appearanceSec.render(appearanceControls));

    // B. Dashboard Preferences Section Card
    const dashSec = new PreferenceSection({
      title: "Dashboard Layout View Options",
      subtitle: "Personalize metrics displays widgets layout zones"
    });
    grid.appendChild(dashSec.render(new DashboardPreferences().render()));

    // C. Notification Preferences Section Card
    const notifySec = new PreferenceSection({
      title: "Notification Alerts Preferences",
      subtitle: "Configure sounds summary logs updates"
    });
    grid.appendChild(notifySec.render(new NotificationPreferences().render()));

    // D. Localization Preferences Section Card
    const localSec = new PreferenceSection({
      title: "Localization Regional Formats",
      subtitle: "Configure timezone currency values indicators"
    });
    grid.appendChild(localSec.render(new LocalizationPreferences().render()));

    container.appendChild(grid);
    this.element = container;

    return container;
  }
}
