/**
 * NotificationSettings.js
 * Retail ERP Enterprise — Reusable Notification Center & Alert Config Panel Component
 *
 * Implements:
 * - NotificationSettings    (Master layout wrapping categories and right live preview toast card)
 * - NotificationChannels    (Toggles for Desktop, In-app and gateway placeholders)
 * - BusinessAlerts          (Toggles mapping stock reminders, sales summary reports)
 * - SystemAlerts            (Toggles configurations software updates, timeouts warnings)
 * - NotificationPreferences (Snooze timers, quiet hours schedules inputs/selects)
 * - NotificationPreview     (Displays mock alert toast matching configuration status)
 * - NotificationToolbar     (Header apply defaults triggers buttons)
 */

"use strict";

export class NotificationChannels {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default channel settings
   * @param {Function} options.onUpdate Callback on values change
   */
  constructor(options = {}) {
    this.state    = options.state    || { desktop: true, inApp: true, email: false, sms: false, push: false };
    this.onUpdate = options.onUpdate || null;
  }

  _createToggle(checked = true, key = "") {
    const sw = document.createElement("div");
    sw.className = `notification-toggle${checked ? "" : " off"}`;
    sw.addEventListener("click", () => {
      const isOff = sw.classList.toggle("off");
      this.state[key] = !isOff;
      console.log(`[Channel Config] ${key} = ${!isOff}`);
      if (this.onUpdate) this.onUpdate(this.state);
    });
    return sw;
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "notification-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "notification-option-row";
      row.innerHTML = `
        <div class="notification-option-label-group">
          <span class="notification-option-title">${title}</span>
          <span class="notification-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Desktop Alerts Overlay", "Renders banner popups inside client workspace", this._createToggle(this.state.desktop, "desktop")));
    grid.appendChild(createRow("In-App Notification Feed", "Appends records log under top header bell icon", this._createToggle(this.state.inApp, "inApp")));
    grid.appendChild(createRow("Email Dispatches (Placeholder)", "Routes reports alerts directly to registered emails", this._createToggle(this.state.email, "email")));
    grid.appendChild(createRow("SMS Notifications Gateway", "Pushes text messages updates to mobile numbers", this._createToggle(this.state.sms, "sms")));

    return grid;
  }
}

export class BusinessAlerts {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default business triggers state
   * @param {Function} options.onUpdate Callback on values change
   */
  constructor(options = {}) {
    this.state    = options.state    || { lowStock: true, outOfStock: true, pendingPO: false, salesTarget: true, dailySummary: true };
    this.onUpdate = options.onUpdate || null;
  }

  _createToggle(checked = true, key = "") {
    const sw = document.createElement("div");
    sw.className = `notification-toggle${checked ? "" : " off"}`;
    sw.addEventListener("click", () => {
      const isOff = sw.classList.toggle("off");
      this.state[key] = !isOff;
      console.log(`[Business Alert Config] ${key} = ${!isOff}`);
      if (this.onUpdate) this.onUpdate(this.state);
    });
    return sw;
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "notification-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "notification-option-row";
      row.innerHTML = `
        <div class="notification-option-label-group">
          <span class="notification-option-title">${title}</span>
          <span class="notification-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Low Stock Warning Alert", "Notify when warehouse SKU counts slip below threshold", this._createToggle(this.state.lowStock, "lowStock")));
    grid.appendChild(createRow("Item Out-of-Stock Alert", "Warn immediately when product listings hit zero units", this._createToggle(this.state.outOfStock, "outOfStock")));
    grid.appendChild(createRow("Pending PO Validations", "Alert administrator when order requests require signatures", this._createToggle(this.state.pendingPO, "pendingPO")));
    grid.appendChild(createRow("Daily Sales Digests Dispatch", "Generate automated store revenue summaries logs", this._createToggle(this.state.dailySummary, "dailySummary")));

    return grid;
  }
}

export class SystemAlerts {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default system alert variables state
   * @param {Function} options.onUpdate Callback on values change
   */
  constructor(options = {}) {
    this.state    = options.state    || { updates: true, backup: true, security: true, timeout: false, license: true };
    this.onUpdate = options.onUpdate || null;
  }

  _createToggle(checked = true, key = "") {
    const sw = document.createElement("div");
    sw.className = `notification-toggle${checked ? "" : " off"}`;
    sw.addEventListener("click", () => {
      const isOff = sw.classList.toggle("off");
      this.state[key] = !isOff;
      console.log(`[System Alert Config] ${key} = ${!isOff}`);
      if (this.onUpdate) this.onUpdate(this.state);
    });
    return sw;
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "notification-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "notification-option-row";
      row.innerHTML = `
        <div class="notification-option-label-group">
          <span class="notification-option-title">${title}</span>
          <span class="appearance-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Software updates patches", "Trigger alerts when client updates package lands", this._createToggle(this.state.updates, "updates")));
    grid.appendChild(createRow("Database Backup Reminders", "Warn when daily SQLite snapshots dispatches are delayed", this._createToggle(this.state.backup, "backup")));
    grid.appendChild(createRow("Security Audit Flags", "Notify immediately on illegal password inputs attempts", this._createToggle(this.state.security, "security")));
    grid.appendChild(createRow("License Expiration Warning", "Warn when subscription key validity hits 30 days left", this._createToggle(this.state.license, "license")));

    return grid;
  }
}

export class NotificationPreferences {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default preferences values state
   * @param {Function} options.onUpdate Callback on values change
   */
  constructor(options = {}) {
    this.state    = options.state    || { soundAlerts: true, priority: "High priority only", quietHours: "Disabled", snooze: "5 minutes" };
    this.onUpdate = options.onUpdate || null;
  }

  _createSelect(options = [], selected = "", key = "") {
    const sel = document.createElement("select");
    sel.className = "notification-select";
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

  _createToggle(checked = true, key = "") {
    const sw = document.createElement("div");
    sw.className = `notification-toggle${checked ? "" : " off"}`;
    sw.addEventListener("click", () => {
      const isOff = sw.classList.toggle("off");
      this.state[key] = !isOff;
      if (this.onUpdate) this.onUpdate(this.state);
    });
    return sw;
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "notification-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "notification-option-row";
      row.innerHTML = `
        <div class="notification-option-label-group">
          <span class="notification-option-title">${title}</span>
          <span class="notification-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Play Sound Alerts Playback", "Audio chime sound feedback on notifications delivery", this._createToggle(this.state.soundAlerts, "soundAlerts")));
    grid.appendChild(createRow("Alert Priority Level Threshold", "Choose minimum priority to display overlays", this._createSelect(["All notifications", "Medium priority only", "High priority only"], this.state.priority, "priority")));
    grid.appendChild(createRow("Quiet Hours Schedule", "Silence alarm sounds during scheduled timestamps", this._createSelect(["Disabled", "10 PM - 6 AM", "8 PM - 8 AM"], this.state.quietHours, "quietHours")));
    grid.appendChild(createRow("Alert Snooze Timer Duration", "Period to mute low stock reminders repeat updates", this._createSelect(["5 minutes", "15 minutes", "1 hour"], this.state.snooze, "snooze")));

    return grid;
  }
}

export class NotificationPreview {
  /**
   * @param {Object} options
   * @param {Object} options.settings Current notifications configurations map
   */
  constructor(options = {}) {
    this.settings = options.settings || { soundAlerts: true, priority: "high_priority_only" };
    this.element  = null;
  }

  _updatePreviewToast() {
    if (!this.element) return;

    const toast = this.element.querySelector(".mock-alert-toast");
    const soundIndicator = this.element.querySelector(".val-sound");
    const priorityLabel = this.element.querySelector(".val-priority");

    if (toast) {
      // Toggle muted styling
      toast.classList.toggle("muted-toast", !this.settings.soundAlerts);
    }

    if (soundIndicator) {
      soundIndicator.textContent = this.settings.soundAlerts ? "🔊 Sound Enabled (Chime)" : "🔇 Silent Delivery";
    }

    if (priorityLabel) {
      const lvl = this.settings.priority;
      if (lvl.includes("high")) {
        priorityLabel.textContent = "High";
        priorityLabel.className = "mock-toast-badge high";
      } else if (lvl.includes("medium")) {
        priorityLabel.textContent = "Medium";
        priorityLabel.className = "mock-toast-badge medium";
      } else {
        priorityLabel.textContent = "Low";
        priorityLabel.className = "mock-toast-badge low";
      }
    }
  }

  render() {
    const pane = document.createElement("aside");
    pane.className = "notification-preview-column";

    pane.innerHTML = `
      <h5 class="preview-title">Alert Toast Output</h5>
      <div class="mock-alert-toast-container">
        <div class="mock-alert-toast">
          <div class="mock-toast-header-row">
            <span class="mock-toast-title">⚠️ Stock Alert</span>
            <span class="mock-toast-badge high val-priority">High</span>
          </div>
          <span class="mock-toast-desc">Warehouse A: Leather Oxford Shoes dipped below threshold limit (4 units left).</span>
          <div class="mock-toast-header-row" style="margin-top:4px;">
            <span class="val-sound" style="font-size:0.6rem; color:var(--text-muted); font-weight:700;">🔊 Sound Enabled</span>
            <span class="mock-toast-time">Just now</span>
          </div>
        </div>
      </div>
    `;

    this.element = pane;
    this._updatePreviewToast();

    return pane;
  }
}

export class NotificationToolbar {
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
      <span class="permission-toolbar-left">Notification Workspace Manager</span>
    `;

    const actions = document.createElement("div");
    actions.className = "permission-toolbar-actions";

    const resetBtn = document.createElement("button");
    resetBtn.className = "role-btn";
    resetBtn.textContent = "Reset Defaults";
    resetBtn.addEventListener("click", () => {
      console.log("[Notification Actions] Mapped reset preferences request.");
      if (this.onReset) this.onReset();
    });
    actions.appendChild(resetBtn);

    const saveBtn = document.createElement("button");
    saveBtn.className = "role-btn primary";
    saveBtn.textContent = "Apply Alert Rules";
    saveBtn.addEventListener("click", () => {
      console.log("[Notification Actions] Mapped apply updated rules request.");
      if (this.onConfirm) this.onConfirm();
    });
    actions.appendChild(saveBtn);

    row.appendChild(actions);
    return row;
  }
}

// ─────────────────────────────────────────────────────
// MAIN NOTIFICATION SETTINGS COORDINATOR VIEW
// ─────────────────────────────────────────────────────

export default class NotificationSettings {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Master notifications state variables
    this.settings = {
      desktop: true,
      inApp: true,
      email: false,
      sms: false,
      push: false,
      lowStock: true,
      outOfStock: true,
      pendingPO: false,
      salesTarget: true,
      dailySummary: true,
      updates: true,
      backup: true,
      security: true,
      license: true,
      soundAlerts: true,
      priority: "high_priority_only",
      quietHours: "disabled",
      snooze: "5_minutes"
    };

    this.previewComponent = null;
  }

  _updateWorkspace() {
    if (this.previewComponent) {
      this.previewComponent.settings = {
        soundAlerts: this.settings.soundAlerts,
        priority: this.settings.priority
      };
      this.previewComponent._updatePreviewToast();
    }
  }

  render() {
    const container = document.createElement("div");
    container.className = "notification-settings-container";

    // Left Columns Forms List
    const formsCol = document.createElement("div");
    formsCol.className = "notification-forms-column";

    // 1. Toolbar
    formsCol.appendChild(new NotificationToolbar({
      onReset: () => {
        this.settings.soundAlerts = true;
        this.settings.priority = "high_priority_only";
        this._updateWorkspace();
      },
      onConfirm: () => {
        console.log("[Notifications Settings] Configurations applied.");
      }
    }).render());

    // 2. Notification Channels Section Card
    const channelsSec = document.createElement("div");
    channelsSec.className = "notification-section-card";
    channelsSec.innerHTML = `
      <header class="notification-section-header">
        <h5 class="notification-section-title">Delivery Channels</h5>
      </header>
    `;
    const chanObj = new NotificationChannels({
      state: {
        desktop: this.settings.desktop,
        inApp: this.settings.inApp,
        email: this.settings.email,
        sms: this.settings.sms,
        push: this.settings.push
      },
      onUpdate: (newChanState) => {
        this.settings = { ...this.settings, ...newChanState };
        this._updateWorkspace();
      }
    });
    channelsSec.appendChild(chanObj.render());
    formsCol.appendChild(channelsSec);

    // 3. Business Alerts Section Card
    const bizSec = document.createElement("div");
    bizSec.className = "notification-section-card";
    bizSec.innerHTML = `
      <header class="notification-section-header">
        <h5 class="notification-section-title">Business Operation Alerts</h5>
      </header>
    `;
    const bizObj = new BusinessAlerts({
      state: {
        lowStock: this.settings.lowStock,
        outOfStock: this.settings.outOfStock,
        pendingPO: this.settings.pendingPO,
        salesTarget: this.settings.salesTarget,
        dailySummary: this.settings.dailySummary
      },
      onUpdate: (newBizState) => {
        this.settings = { ...this.settings, ...newBizState };
        this._updateWorkspace();
      }
    });
    bizSec.appendChild(bizObj.render());
    formsCol.appendChild(bizSec);

    // 4. System Alerts Section Card
    const sysSec = document.createElement("div");
    sysSec.className = "notification-section-card";
    sysSec.innerHTML = `
      <header class="notification-section-header">
        <h5 class="notification-section-title">System Status Alerts</h5>
      </header>
    `;
    const sysObj = new SystemAlerts({
      state: {
        updates: this.settings.updates,
        backup: this.settings.backup,
        security: this.settings.security,
        license: this.settings.license
      },
      onUpdate: (newSysState) => {
        this.settings = { ...this.settings, ...newSysState };
        this._updateWorkspace();
      }
    });
    sysSec.appendChild(sysObj.render());
    formsCol.appendChild(sysSec);

    // 5. Notification Preferences Section Card
    const prefSec = document.createElement("div");
    prefSec.className = "notification-section-card";
    prefSec.innerHTML = `
      <header class="notification-section-header">
        <h5 class="notification-section-title">Quiet Hours & Priority Preferences</h5>
      </header>
    `;
    const prefObj = new NotificationPreferences({
      state: {
        soundAlerts: this.settings.soundAlerts,
        priority: this.settings.priority,
        quietHours: this.settings.quietHours,
        snooze: this.settings.snooze
      },
      onUpdate: (newPrefState) => {
        this.settings = { ...this.settings, ...newPrefState };
        this._updateWorkspace();
      }
    });
    prefSec.appendChild(prefObj.render());
    formsCol.appendChild(prefSec);

    container.appendChild(formsCol);

    // Right Column: Mock Alert Toast Preview
    this.previewComponent = new NotificationPreview({
      settings: {
        soundAlerts: this.settings.soundAlerts,
        priority: this.settings.priority
      }
    });
    container.appendChild(this.previewComponent.render());

    this.element = container;

    return container;
  }
}
