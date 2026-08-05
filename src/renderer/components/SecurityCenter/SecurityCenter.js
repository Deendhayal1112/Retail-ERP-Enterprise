/**
 * SecurityCenter.js
 * Retail ERP Enterprise — Reusable Security Center Settings Module Component
 *
 * Implements:
 * - SecurityCenter          (Master coordinator panel wrapping pages forms and score elements)
 * - AuthenticationSettings  (Password complex criteria, MFA toggle placeholders)
 * - SessionSettings         (Inactivity logout limits, concurrent session controls)
 * - DataProtection          (Backup timing intervals, SQLite file encryption placeholder)
 * - AccessSecurity          (lockout counts, trusted devices toggles)
 * - AuditLogs               (Timeline logs displaying logins/backup actions)
 * - SecurityStatusCard      (Score progress circle showing rating metrics: Excellent 92/100)
 * - SecurityToolbar         (Apply settings buttons)
 */

"use strict";

export class SecurityStatusCard {
  /**
   * @param {Object} options
   * @param {number} options.score Initial rating score (0 - 100)
   */
  constructor(options = {}) {
    this.score = options.score || 92;
  }

  render() {
    const card = document.createElement("div");
    card.className = "security-status-card";

    card.innerHTML = `
      <div class="security-score-circle-wrap">
        <span class="security-score-number">${this.score}%</span>
      </div>
      <div class="security-status-meta">
        <h5 class="security-status-title">Security Health Rating</h5>
        <span class="security-status-desc">All essential protocols applied. Excellent shielding status.</span>
      </div>
    `;

    return card;
  }
}

export class AuditLogs {
  /**
   * @param {Object} options
   * @param {Object[]} options.logs List of recent audit trail events
   */
  constructor(options = {}) {
    this.logs = options.logs || [
      { event: "USER_LOGIN", user: "admin", ip: "127.0.0.1", status: "success", time: "2m ago" },
      { event: "DATABASE_BACKUP", user: "system", ip: "localhost", status: "success", time: "1h ago" },
      { event: "INVALID_CREDENTIALS", user: "cashier_john", ip: "192.168.1.14", status: "fail", time: "3h ago" },
      { event: "SESSION_TIMEOUT", user: "bob", ip: "127.0.0.1", status: "success", time: "Yesterday" }
    ];
  }

  render() {
    const card = document.createElement("div");
    card.className = "audit-logs-card";

    card.innerHTML = `
      <header class="audit-logs-header">Security Audit Trail</header>
      <div class="audit-log-rows-list"></div>
    `;

    const list = card.querySelector(".audit-log-rows-list");
    this.logs.forEach(log => {
      const row = document.createElement("div");
      row.className = "audit-log-row-item";

      row.innerHTML = `
        <div class="audit-log-meta">
          <span class="audit-log-event">${log.event}</span>
          <span class="audit-log-status-badge ${log.status}">${log.status}</span>
        </div>
        <span class="audit-log-details">User: <strong>${log.user}</strong> (IP: ${log.ip})</span>
        <span class="audit-log-time">${log.time}</span>
      `;
      list.appendChild(row);
    });

    return card;
  }
}

export class AuthenticationSettings {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default states dictionary
   * @param {Function} options.onUpdate Callback on updates dispatch
   */
  constructor(options = {}) {
    this.state    = options.state    || { passwordLength: "8 characters", complexity: "Strong (Letters, Numbers, Symbols)", expiration: "90 days", mfa: false };
    this.onUpdate = options.onUpdate || null;
  }

  _createSelect(options = [], selected = "", key = "") {
    const sel = document.createElement("select");
    sel.className = "security-select";
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
    sw.className = `security-toggle${checked ? "" : " off"}`;
    sw.addEventListener("click", () => {
      const isOff = sw.classList.toggle("off");
      this.state[key] = !isOff;
      console.log(`[Auth security config] ${key} = ${!isOff}`);
      if (this.onUpdate) this.onUpdate(this.state);
    });
    return sw;
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "security-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "security-option-row";
      row.innerHTML = `
        <div class="security-option-label-group">
          <span class="security-option-title">${title}</span>
          <span class="security-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Min Password Length", "Minimum character length rule constraints", this._createSelect(["8 characters", "10 characters", "12 characters"], this.state.passwordLength, "passwordLength")));
    grid.appendChild(createRow("Password Complexity", "Enforce character groupings combinations", this._createSelect(["Strong (Letters, Numbers, Symbols)", "Medium (Alphanumeric)"], this.state.complexity, "complexity")));
    grid.appendChild(createRow("Credentials Expiry Window", "Require operators passwords reset after epoch duration", this._createSelect(["90 days", "180 days", "Never"], this.state.expiration, "expiration")));
    grid.appendChild(createRow("Require Two-Factor MFA", "Enable multi-factor security verification logs", this._createToggle(this.state.mfa, "mfa")));

    return grid;
  }
}

export class SessionSettings {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default sessions states
   * @param {Function} options.onUpdate Callback on values change
   */
  constructor(options = {}) {
    this.state    = options.state    || { timeout: "15 minutes", concurrent: "Single session only", remember: true };
    this.onUpdate = options.onUpdate || null;
  }

  _createSelect(options = [], selected = "", key = "") {
    const sel = document.createElement("select");
    sel.className = "security-select";
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
    sw.className = `security-toggle${checked ? "" : " off"}`;
    sw.addEventListener("click", () => {
      const isOff = sw.classList.toggle("off");
      this.state[key] = !isOff;
      if (this.onUpdate) this.onUpdate(this.state);
    });
    return sw;
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "security-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "security-option-row";
      row.innerHTML = `
        <div class="security-option-label-group">
          <span class="security-option-title">${title}</span>
          <span class="security-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Session Idle Timeout", "Inactivity interval triggering automatic lock screen", this._createSelect(["15 minutes", "30 minutes", "1 hour"], this.state.timeout, "timeout")));
    grid.appendChild(createRow("Concurrent Operator Logins", "Restrict same credentials mounting concurrent windows", this._createSelect(["Single session only", "Multi-sessions allowed"], this.state.concurrent, "concurrent")));
    grid.appendChild(createRow("Remember Trusted Devices", "Cache trusted device identifiers details", this._createToggle(this.state.remember, "remember")));

    return grid;
  }
}

export class DataProtection {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default states configuration
   * @param {Function} options.onUpdate Callback on values change
   */
  constructor(options = {}) {
    this.state    = options.state    || { autoBackup: true, retention: "30 backups", encryption: false, integrityCheck: true };
    this.onUpdate = options.onUpdate || null;
  }

  _createSelect(options = [], selected = "", key = "") {
    const sel = document.createElement("select");
    sel.className = "security-select";
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
    sw.className = `security-toggle${checked ? "" : " off"}`;
    sw.addEventListener("click", () => {
      const isOff = sw.classList.toggle("off");
      this.state[key] = !isOff;
      if (this.onUpdate) this.onUpdate(this.state);
    });
    return sw;
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "security-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "security-option-row";
      row.innerHTML = `
        <div class="security-option-label-group">
          <span class="security-option-title">${title}</span>
          <span class="security-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Automatic Daily Backups", "Export timestamped SQLite data snapshots automatically", this._createToggle(this.state.autoBackup, "autoBackup")));
    grid.appendChild(createRow("Backup Retention Limit", "Choose count of previous backups files to retain", this._createSelect(["30 backups", "90 backups", "Keep all backups"], this.state.retention, "retention")));
    grid.appendChild(createRow("Enable Database Encryption", "Encrypt SQLite database files at rest (AES-256)", this._createToggle(this.state.encryption, "encryption")));
    grid.appendChild(createRow("Run Integrity Checkups", "Verify file block indexing integrity checks on load", this._createToggle(this.state.integrityCheck, "integrityCheck")));

    return grid;
  }
}

export class AccessSecurity {
  /**
   * @param {Object}   options
   * @param {Object}   options.state    Default states map
   * @param {Function} options.onUpdate Callback on values change
   */
  constructor(options = {}) {
    this.state    = options.state    || { failedLockout: "5 attempts", whitelist: false, secureAlerts: true };
    this.onUpdate = options.onUpdate || null;
  }

  _createSelect(options = [], selected = "", key = "") {
    const sel = document.createElement("select");
    sel.className = "security-select";
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
    sw.className = `security-toggle${checked ? "" : " off"}`;
    sw.addEventListener("click", () => {
      const isOff = sw.classList.toggle("off");
      this.state[key] = !isOff;
      if (this.onUpdate) this.onUpdate(this.state);
    });
    return sw;
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "security-options-grid";

    const createRow = (title, desc, control) => {
      const row = document.createElement("div");
      row.className = "security-option-row";
      row.innerHTML = `
        <div class="security-option-label-group">
          <span class="security-option-title">${title}</span>
          <span class="security-option-desc">${desc}</span>
        </div>
      `;
      row.appendChild(control);
      return row;
    };

    grid.appendChild(createRow("Failed Lockout Counts", "Attempts limit triggering lockouts timers", this._createSelect(["3 attempts", "5 attempts", "10 attempts"], this.state.failedLockout, "failedLockout")));
    grid.appendChild(createRow("IP Whitelisting Filter", "Restrict API dispatches outside whitelist ranges", this._createToggle(this.state.whitelist, "whitelist")));
    grid.appendChild(createRow("Operator Alert Email Triggers", "Notify administrators on lockouts warnings events", this._createToggle(this.state.secureAlerts, "secureAlerts")));

    return grid;
  }
}

export class SecurityToolbar {
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
      <span class="permission-toolbar-left">Security Admin Console</span>
    `;

    const actions = document.createElement("div");
    actions.className = "permission-toolbar-actions";

    const resetBtn = document.createElement("button");
    resetBtn.className = "role-btn";
    resetBtn.textContent = "Reset Defaults";
    resetBtn.addEventListener("click", () => {
      console.log("[Security Actions] Restoring default security configurations.");
      if (this.onReset) this.onReset();
    });
    actions.appendChild(resetBtn);

    const saveBtn = document.createElement("button");
    saveBtn.className = "role-btn primary";
    saveBtn.textContent = "Lock Security Settings";
    saveBtn.addEventListener("click", () => {
      console.log("[Security Actions] Saving updated policies parameters.");
      if (this.onConfirm) this.onConfirm();
    });
    actions.appendChild(saveBtn);

    row.appendChild(actions);
    return row;
  }
}

// ─────────────────────────────────────────────────────
// MAIN SECURITY CENTER SETTINGS COORDINATOR VIEW
// ─────────────────────────────────────────────────────

export default class SecurityCenter {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Master security settings state variables
    this.settings = {
      passwordLength: "8_characters",
      complexity: "strong_(letters,_numbers,_symbols)",
      expiration: "90_days",
      mfa: false,
      timeout: "15_minutes",
      concurrent: "single_session_only",
      remember: true,
      autoBackup: true,
      retention: "30_backups",
      encryption: false,
      integrityCheck: true,
      failedLockout: "5_attempts",
      whitelist: false,
      secureAlerts: true
    };
  }

  render() {
    const container = document.createElement("div");
    container.className = "security-center-container";

    // Left Forms Column
    const formsCol = document.createElement("div");
    formsCol.className = "security-forms-column";

    // 1. Toolbar
    formsCol.appendChild(new SecurityToolbar({
      onReset: () => {
        this.settings.mfa = false;
        this.settings.encryption = false;
        this.settings.whitelist = false;
      },
      onConfirm: () => {
        console.log("[SecurityCenter Settings] Security parameters locked.");
      }
    }).render());

    // 2. Authentication Section Card
    const authSec = document.createElement("div");
    authSec.className = "security-section-card";
    authSec.innerHTML = `
      <header class="security-section-header">
        <h5 class="security-section-title">Credentials Authentication Policies</h5>
      </header>
    `;
    const authObj = new AuthenticationSettings({
      state: {
        passwordLength: this.settings.passwordLength,
        complexity: this.settings.complexity,
        expiration: this.settings.expiration,
        mfa: this.settings.mfa
      },
      onUpdate: (newAuthState) => {
        this.settings = { ...this.settings, ...newAuthState };
      }
    });
    authSec.appendChild(authObj.render());
    formsCol.appendChild(authSec);

    // 3. Session Management Section Card
    const sessSec = document.createElement("div");
    sessSec.className = "security-section-card";
    sessSec.innerHTML = `
      <header class="security-section-header">
        <h5 class="security-section-title">Session Life Limits</h5>
      </header>
    `;
    const sessObj = new SessionSettings({
      state: {
        timeout: this.settings.timeout,
        concurrent: this.settings.concurrent,
        remember: this.settings.remember
      },
      onUpdate: (newSessState) => {
        this.settings = { ...this.settings, ...newSessState };
      }
    });
    sessSec.appendChild(sessObj.render());
    formsCol.appendChild(sessSec);

    // 4. Data Protection Section Card
    const dataSec = document.createElement("div");
    dataSec.className = "security-section-card";
    dataSec.innerHTML = `
      <header class="security-section-header">
        <h5 class="security-section-title">Data Protection & Backups</h5>
      </header>
    `;
    const dataObj = new DataProtection({
      state: {
        autoBackup: this.settings.autoBackup,
        retention: this.settings.retention,
        encryption: this.settings.encryption,
        integrityCheck: this.settings.integrityCheck
      },
      onUpdate: (newDataState) => {
        this.settings = { ...this.settings, ...newDataState };
      }
    });
    dataSec.appendChild(dataObj.render());
    formsCol.appendChild(dataSec);

    // 5. Access Security Section Card
    const accessSec = document.createElement("div");
    accessSec.className = "security-section-card";
    accessSec.innerHTML = `
      <header class="security-section-header">
        <h5 class="security-section-title">Access Lockouts Rules</h5>
      </header>
    `;
    const accessObj = new AccessSecurity({
      state: {
        failedLockout: this.settings.failedLockout,
        whitelist: this.settings.whitelist,
        secureAlerts: this.settings.secureAlerts
      },
      onUpdate: (newAccessState) => {
        this.settings = { ...this.settings, ...newAccessState };
      }
    });
    accessSec.appendChild(accessObj.render());
    formsCol.appendChild(accessSec);

    container.appendChild(formsCol);

    // Right Sidebar Column: Rating Status card + Audit Trail
    const sidebar = document.createElement("div");
    sidebar.className = "security-sidebar-column";

    sidebar.appendChild(new SecurityStatusCard().render());
    sidebar.appendChild(new AuditLogs().render());
    container.appendChild(sidebar);

    this.element = container;

    return container;
  }
}
