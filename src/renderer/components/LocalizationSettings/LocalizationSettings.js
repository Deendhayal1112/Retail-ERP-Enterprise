/**
 * LocalizationSettings.js
 * Retail ERP Enterprise — Reusable Localization & Regional Settings Module Component
 *
 * Implements:
 * - LocalizationSettings (Master coordinator containing layout frames, forms and preview cards)
 * - LanguageSelector     (Dropdown selecting English, Tamil, Arabic and custom)
 * - RegionalSettings     (Dropdown options for Country, Timezone, Locale standards)
 * - CurrencySettings     (Currency symbols, position placement togglers)
 * - FormattingSettings   (Number, Date, Time formatting choices)
 * - TaxSettings          (GST regions, financial calendar offsets dropdowns)
 * - LocalizationPreview  (Renders live output mockup mapping localized text formats)
 * - LocalizationToolbar  (Header action buttons applying configurations)
 */

"use strict";

export class LanguageSelector {
  /**
   * @param {Object}   options
   * @param {string}   options.selected Selected language value
   * @param {Function} options.onChange Callback on selection change
   */
  constructor(options = {}) {
    this.selected = options.selected || "english";
    this.onChange = options.onChange || null;

    this.languages = [
      { key: "english",   label: "English (US)" },
      { key: "tamil",     label: "Tamil (தமிழ்)" },
      { key: "hindi",     label: "Hindi (हिन्दी)" },
      { key: "telugu",    label: "Telugu (తెలుగు)" },
      { key: "kannada",   label: "Kannada (ಕನ್ನಡ)" },
      { key: "malayalam", label: "Malayalam (മലയാളം)" },
      { key: "arabic",    label: "Arabic (العربية)" },
      { key: "custom",    label: "Custom Locale Placeholder" }
    ];
  }

  render() {
    const sel = document.createElement("select");
    sel.className = "localization-select";
    sel.setAttribute("aria-label", "Select workspace language");

    this.languages.forEach(l => {
      const opt = document.createElement("option");
      opt.value = l.key;
      opt.textContent = l.label;
      if (l.key === this.selected) opt.selected = true;
      sel.appendChild(opt);
    });

    sel.addEventListener("change", (e) => {
      this.selected = e.target.value;
      if (this.onChange) this.onChange(e.target.value);
    });

    return sel;
  }
}

export class RegionalSettings {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default regional state configurations
   * @param {Function} options.onUpdate Callback on values change
   */
  constructor(options = {}) {
    this.state    = options.state    || { country: "India", state: "Tamil Nadu", timezone: "UTC +05:30", locale: "en-IN" };
    this.onUpdate = options.onUpdate || null;
  }

  _createSelect(options = [], selected = "", key = "") {
    const sel = document.createElement("select");
    sel.className = "localization-select";
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
    grid.className = "localization-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "localization-option-row";
      row.innerHTML = `
        <div class="localization-option-label-group">
          <span class="localization-option-title">${title}</span>
          <span class="localization-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Primary Country", "Set headquarters state rules jurisdiction", this._createSelect(["India", "United States", "United Kingdom"], this.state.country, "country")));
    grid.appendChild(createRow("Primary State / Province", "Set tax jurisdiction rules mapping", this._createSelect(["Tamil Nadu", "Delhi", "California", "London"], this.state.state, "state")));
    grid.appendChild(createRow("Time Zone Offset", "Set standard display window timestamps", this._createSelect(["UTC +05:30", "UTC +00:00", "UTC -05:00"], this.state.timezone, "timezone")));
    grid.appendChild(createRow("Standard Locale Format", "Set initial formatting schema code", this._createSelect(["en-IN", "en-US", "en-GB"], this.state.locale, "locale")));

    return grid;
  }
}

export class CurrencySettings {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default currency configurations state
   * @param {Function} options.onUpdate Callback on values change
   */
  constructor(options = {}) {
    this.state    = options.state    || { currency: "INR (₹)", symbol: "₹", position: "Prefix", decimals: "2 decimal places", separator: "Comma (,)" };
    this.onUpdate = options.onUpdate || null;
  }

  _createSelect(options = [], selected = "", key = "") {
    const sel = document.createElement("select");
    sel.className = "localization-select";
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

  _createInput(val = "", key = "") {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "localization-input";
    input.value = val;
    input.addEventListener("input", (e) => {
      this.state[key] = e.target.value;
      if (this.onUpdate) this.onUpdate(this.state);
    });
    return input;
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "localization-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "localization-option-row";
      row.innerHTML = `
        <div class="localization-option-label-group">
          <span class="localization-option-title">${title}</span>
          <span class="localization-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Base Currency", "Select primary billing values notation", this._createSelect(["INR (₹)", "USD ($)", "GBP (£)"], this.state.currency, "currency")));
    grid.appendChild(createRow("Currency Symbol Character", "Character prefixing currency amounts", this._createInput(this.state.symbol, "symbol")));
    grid.appendChild(createRow("Symbol Placement Position", "Render placement prefix or suffix", this._createSelect(["Prefix", "Suffix"], this.state.position, "position")));
    grid.appendChild(createRow("Decimal Places Float", "Number of trailing values decimal spots", this._createSelect(["2 decimal places", "0 decimal places"], this.state.decimals, "decimals")));

    return grid;
  }
}

export class FormattingSettings {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default formatting layouts state
   * @param {Function} options.onUpdate Callback on values change
   */
  constructor(options = {}) {
    this.state    = options.state    || { dateFormat: "DD-MM-YYYY", timeFormat: "12-hour", numFormat: "1,23,456.78", weekStart: "Monday", unit: "Metric (kg, m)" };
    this.onUpdate = options.onUpdate || null;
  }

  _createSelect(options = [], selected = "", key = "") {
    const sel = document.createElement("select");
    sel.className = "localization-select";
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
    grid.className = "localization-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "localization-option-row";
      row.innerHTML = `
        <div class="localization-option-label-group">
          <span class="localization-option-title">${title}</span>
          <span class="localization-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Date Format Mappings", "Standard date display format", this._createSelect(["DD-MM-YYYY", "YYYY-MM-DD", "MM/DD/YYYY"], this.state.dateFormat, "dateFormat")));
    grid.appendChild(createRow("Time representation format", "12-hour AM/PM standard or military 24h", this._createSelect(["12-hour", "24-hour"], this.state.timeFormat, "timeFormat")));
    grid.appendChild(createRow("Number Spacing separation", "Standard digit separation styling", this._createSelect(["1,23,456.78", "123,456.78"], this.state.numFormat, "numFormat")));
    grid.appendChild(createRow("Start Day of Week", "Initial day representing calendar grids", this._createSelect(["Monday", "Sunday"], this.state.weekStart, "weekStart")));

    return grid;
  }
}

export class TaxSettings {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default tax settings state parameters
   * @param {Function} options.onUpdate Callback on values change
   */
  constructor(options = {}) {
    this.state    = options.state    || { gstRegion: "India GST", taxFormat: "Exclusive", invoiceFormat: "RET-YYYY-XXXX", fiscalYear: "April - March" };
    this.onUpdate = options.onUpdate || null;
  }

  _createSelect(options = [], selected = "", key = "") {
    const sel = document.createElement("select");
    sel.className = "localization-select";
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
    grid.className = "localization-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "localization-option-row";
      row.innerHTML = `
        <div class="localization-option-label-group">
          <span class="localization-option-title">${title}</span>
          <span class="localization-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Tax Regulation Regime", "Regulatory tax region format constraints", this._createSelect(["India GST", "US Sales Tax", "UK VAT"], this.state.gstRegion, "gstRegion")));
    grid.appendChild(createRow("Default Tax Calculation", "Compute taxes inclusive or exclusive of pricing", this._createSelect(["Exclusive", "Inclusive"], this.state.taxFormat, "taxFormat")));
    grid.appendChild(createRow("Invoice Serial Format", "Prefix mapping sequence for invoices", this._createSelect(["RET-YYYY-XXXX", "INV-XXXX"], this.state.invoiceFormat, "invoiceFormat")));
    grid.appendChild(createRow("Fiscal Calendar Period", "Financial accounting year dates limits", this._createSelect(["April - March", "January - December"], this.state.fiscalYear, "fiscalYear")));

    return grid;
  }
}

export class LocalizationPreview {
  /**
   * @param {Object} options
   * @param {Object} options.settings Localization variables map
   */
  constructor(options = {}) {
    this.settings = options.settings || { lang: "english", symbol: "₹", position: "prefix", dateFormat: "dd-mm-yyyy" };
    this.element  = null;
  }

  _updatePreviewValues() {
    if (!this.element) return;

    const valCurrency = this.element.querySelector(".val-currency");
    const valNumber   = this.element.querySelector(".val-number");
    const valDate     = this.element.querySelector(".val-date");
    const valGST      = this.element.querySelector(".val-gst");

    // Dynamic formatting simulation
    const sym = this.settings.symbol;
    const isPrefix = this.settings.position.toLowerCase() === "prefix";

    if (valCurrency) {
      valCurrency.textContent = isPrefix ? `${sym} 1,23,456.78` : `1,23,456.78 ${sym}`;
    }

    if (valNumber) {
      valNumber.textContent = this.settings.numFormat === "123,456.78" ? "1,234,567.89" : "12,34,567.89";
    }

    if (valDate) {
      const fmt = this.settings.dateFormat.toUpperCase();
      if (fmt.includes("YYYY-MM-DD")) valDate.textContent = "2026-08-05";
      else if (fmt.includes("MM/DD/YYYY")) valDate.textContent = "08/05/2026";
      else valDate.textContent = "05-08-2026";
    }

    if (valGST) {
      valGST.textContent = this.settings.gstRegion === "us_sales_tax" ? "US TAX (Exempt)" : "GST IN (18% IGST)";
    }
  }

  render() {
    const pane = document.createElement("aside");
    pane.className = "localization-preview-column";

    pane.innerHTML = `
      <h5 class="preview-title">Format Sample Output</h5>
      <div class="mock-value-display-card">
        <div class="mock-value-row">
          <span class="mock-value-label">Formatted Currency</span>
          <span class="mock-value-result val-currency">₹ 1,23,456.78</span>
        </div>
        <div class="mock-value-row">
          <span class="mock-value-label">Numeric Quantity Spacing</span>
          <span class="mock-value-result val-number">12,34,567.89</span>
        </div>
        <div class="mock-value-row">
          <span class="mock-value-label">Localized Date Output</span>
          <span class="mock-value-result val-date">05-08-2026</span>
        </div>
        <div class="mock-value-row">
          <span class="mock-value-label">GST Tax Identification</span>
          <span class="mock-value-result val-gst">GST IN (18% IGST)</span>
        </div>
      </div>
    `;

    this.element = pane;
    this._updatePreviewValues();

    return pane;
  }
}

export class LocalizationToolbar {
  /**
   * @param {Object}   options
   * @param {Function} options.onReset   Reset callback
   * @param {Function} options.onConfirm Apply configs callback
   */
  constructor(options = {}) {
    this.onReset   = options.onReset   || null;
    this.onConfirm = options.onConfirm || null;
  }

  render() {
    const row = document.createElement("div");
    row.className = "permission-toolbar-row";

    row.innerHTML = `
      <span class="permission-toolbar-left">Regional Controller</span>
    `;

    const actions = document.createElement("div");
    actions.className = "permission-toolbar-actions";

    const resetBtn = document.createElement("button");
    resetBtn.className = "role-btn";
    resetBtn.textContent = "Reset Defaults";
    resetBtn.addEventListener("click", () => {
      console.log("[Localization Actions] Restoring default locale configs.");
      if (this.onReset) this.onReset();
    });
    actions.appendChild(resetBtn);

    const saveBtn = document.createElement("button");
    saveBtn.className = "role-btn primary";
    saveBtn.textContent = "Apply Formatting";
    saveBtn.addEventListener("click", () => {
      console.log("[Localization Actions] Applying regional format properties.");
      if (this.onConfirm) this.onConfirm();
    });
    actions.appendChild(saveBtn);

    row.appendChild(actions);
    return row;
  }
}

// ─────────────────────────────────────────────────────
// MAIN LOCALIZATION SETTINGS COORDINATOR VIEW
// ─────────────────────────────────────────────────────

export default class LocalizationSettings {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Master localization state parameters
    this.settings = {
      lang: "english",
      country: "India",
      state: "Tamil Nadu",
      timezone: "UTC +05:30",
      locale: "en-IN",
      currency: "INR (₹)",
      symbol: "₹",
      position: "Prefix",
      decimals: "2 decimal places",
      dateFormat: "DD-MM-YYYY",
      timeFormat: "12-hour",
      numFormat: "1,23,456.78",
      weekStart: "Monday",
      gstRegion: "India GST",
      taxFormat: "Exclusive",
      invoiceFormat: "RET-YYYY-XXXX",
      fiscalYear: "April - March"
    };

    this.previewComponent = null;
  }

  _updateWorkspace() {
    if (this.previewComponent) {
      this.previewComponent.settings = {
        lang: this.settings.lang,
        symbol: this.settings.symbol,
        position: this.settings.position,
        dateFormat: this.settings.dateFormat,
        numFormat: this.settings.numFormat,
        gstRegion: this.settings.gstRegion
      };
      this.previewComponent._updatePreviewValues();
    }
  }

  render() {
    const container = document.createElement("div");
    container.className = "localization-settings-container";

    // Left Forms Column
    const formsCol = document.createElement("div");
    formsCol.className = "localization-forms-column";

    // 1. Toolbar
    formsCol.appendChild(new LocalizationToolbar({
      onReset: () => {
        this.settings.lang = "english";
        this.settings.symbol = "₹";
        this.settings.position = "Prefix";
        this.settings.dateFormat = "DD-MM-YYYY";
        this.settings.numFormat = "1,23,456.78";
        this.settings.gstRegion = "India GST";
        this._updateWorkspace();
      },
      onConfirm: () => {
        console.log("[Localization] Settings applied.");
      }
    }).render());

    // 2. Language Selector card
    const langSec = document.createElement("div");
    langSec.className = "localization-section-card";
    langSec.innerHTML = `
      <header class="localization-section-header">
        <h5 class="localization-section-title">Workspace Language</h5>
      </header>
    `;
    const langSel = new LanguageSelector({
      selected: this.settings.lang,
      onChange: (lKey) => {
        this.settings.lang = lKey;
        this._updateWorkspace();
      }
    });
    langSec.appendChild(langSel.render());
    formsCol.appendChild(langSec);

    // 3. Regional settings card
    const regSec = document.createElement("div");
    regSec.className = "localization-section-card";
    regSec.innerHTML = `
      <header class="localization-section-header">
        <h5 class="localization-section-title">Regional Parameters</h5>
      </header>
    `;
    const regObj = new RegionalSettings({
      state: {
        country: this.settings.country,
        state: this.settings.state,
        timezone: this.settings.timezone,
        locale: this.settings.locale
      },
      onUpdate: (newRegState) => {
        this.settings = { ...this.settings, ...newRegState };
        this._updateWorkspace();
      }
    });
    regSec.appendChild(regObj.render());
    formsCol.appendChild(regSec);

    // 4. Currency Settings card
    const curSec = document.createElement("div");
    curSec.className = "localization-section-card";
    curSec.innerHTML = `
      <header class="localization-section-header">
        <h5 class="localization-section-title">Currency Configuration</h5>
      </header>
    `;
    const curObj = new CurrencySettings({
      state: {
        currency: this.settings.currency,
        symbol: this.settings.symbol,
        position: this.settings.position,
        decimals: this.settings.decimals
      },
      onUpdate: (newCurState) => {
        this.settings = { ...this.settings, ...newCurState };
        this._updateWorkspace();
      }
    });
    curSec.appendChild(curObj.render());
    formsCol.appendChild(curSec);

    // 5. Formatting Settings card
    const fmtSec = document.createElement("div");
    fmtSec.className = "localization-section-card";
    fmtSec.innerHTML = `
      <header class="localization-section-header">
        <h5 class="localization-section-title">Value & Date Formatting</h5>
      </header>
    `;
    const fmtObj = new FormattingSettings({
      state: {
        dateFormat: this.settings.dateFormat,
        timeFormat: this.settings.timeFormat,
        numFormat: this.settings.numFormat,
        weekStart: this.settings.weekStart
      },
      onUpdate: (newFmtState) => {
        this.settings = { ...this.settings, ...newFmtState };
        this._updateWorkspace();
      }
    });
    fmtSec.appendChild(fmtObj.render());
    formsCol.appendChild(fmtSec);

    // 6. Tax Settings card
    const taxSec = document.createElement("div");
    taxSec.className = "localization-section-card";
    taxSec.innerHTML = `
      <header class="localization-section-header">
        <h5 class="localization-section-title">Tax & Compliance Registration</h5>
      </header>
    `;
    const taxObj = new TaxSettings({
      state: {
        gstRegion: this.settings.gstRegion,
        taxFormat: this.settings.taxFormat,
        invoiceFormat: this.settings.invoiceFormat,
        fiscalYear: this.settings.fiscalYear
      },
      onUpdate: (newTaxState) => {
        this.settings = { ...this.settings, ...newTaxState };
        this._updateWorkspace();
      }
    });
    taxSec.appendChild(taxObj.render());
    formsCol.appendChild(taxSec);

    container.appendChild(formsCol);

    // Right Panel: Format Preview Output
    this.previewComponent = new LocalizationPreview({
      settings: {
        lang: this.settings.lang,
        symbol: this.settings.symbol,
        position: this.settings.position,
        dateFormat: this.settings.dateFormat,
        numFormat: this.settings.numFormat,
        gstRegion: this.settings.gstRegion
      }
    });
    container.appendChild(this.previewComponent.render());

    this.element = container;

    return container;
  }
}
