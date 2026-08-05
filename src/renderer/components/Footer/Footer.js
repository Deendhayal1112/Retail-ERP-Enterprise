/**
 * Footer.js
 * Retail ERP Enterprise — System Status Bar & Footer Component
 *
 * Implements the reusable bottom status bar elements:
 * - Footer (Main page footer layout)
 * - StatusItem (Reusable name/value item)
 * - DatabaseStatus (SQLite connectivity indicators)
 * - LicenseStatus (Enterprise validation state)
 * - SyncStatus (Offline database sync state)
 * - VersionInfo (v0.2.0 build environment details)
 * - SystemClock (Live time tracking logs)
 * - FooterDivider (Vertical separator)
 */

"use strict";

export class FooterDivider {
  render() {
    const divider = document.createElement("div");
    divider.className = "footer-vertical-divider";
    return divider;
  }
}

export class StatusItem {
  constructor(options = {}) {
    this.label = options.label || "";
    this.value = options.value || "";
    this.icon = options.icon || "";
    this.className = options.className || "";
  }

  render() {
    const item = document.createElement("div");
    item.className = `footer-status-item-element ${this.className}`;
    item.innerHTML = `
      ${this.icon ? `<span>${this.icon}</span>` : ""}
      <span>${this.label} <span class="footer-status-label-value">${this.value}</span></span>
    `;
    return item;
  }
}

export class DatabaseStatus extends StatusItem {
  constructor() {
    super({
      label: "Database:",
      value: "SQLite (WAL)",
      icon: "🗄️"
    });
  }
}

export class LicenseStatus extends StatusItem {
  constructor() {
    super({
      label: "License:",
      value: "Enterprise Edition",
      icon: "🔑"
    });
  }
}

export class SyncStatus extends StatusItem {
  constructor() {
    super({
      label: "Sync Status:",
      value: "Cloud Synced",
      icon: "🔄"
    });
  }
}

export class VersionInfo extends StatusItem {
  constructor() {
    super({
      label: "Version:",
      value: "0.2.0-dev",
      icon: "🏷️"
    });
  }
}

export class SystemClock {
  constructor() {
    this.element = null;
  }

  render() {
    const clock = document.createElement("div");
    clock.className = "footer-status-item-element";
    clock.innerHTML = `<span>🕒</span> <span class="clock-label-text">12:00:00 PM</span>`;
    
    this.element = clock.querySelector(".clock-label-text");
    this.startClock();
    
    return clock;
  }

  startClock() {
    const updateTime = () => {
      if (!this.element) return;
      const now = new Date();
      this.element.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    updateTime();
    setInterval(updateTime, 1000);
  }
}

// ─────────────────────────────────────────────────────
// MAIN FOOTER VIEW CONTROLLER
// ─────────────────────────────────────────────────────

export default class Footer {
  constructor(options = {}) {
    this.options = {
      appStatus: "ready", // "ready", "loading", or "error"
      ...options
    };
    this.element = null;
  }

  render() {
    const container = document.createElement("div");
    container.className = "footer-status-bar";

    // 1. LEFT SECTION (Application Status Indicator)
    const leftSection = document.createElement("div");
    leftSection.className = "footer-left-section";

    const statusDot = document.createElement("span");
    statusDot.className = `status-dot-indicator ${this.options.appStatus}`;
    
    let statusLabelText = "System Ready";
    if (this.options.appStatus === "loading") statusLabelText = "Loading Assets...";
    if (this.options.appStatus === "error") statusLabelText = "Database Alert Error";

    const statusLabel = document.createElement("span");
    statusLabel.innerHTML = `Status: <strong>${statusLabelText}</strong>`;

    leftSection.appendChild(statusDot);
    leftSection.appendChild(statusLabel);
    container.appendChild(leftSection);

    // Divider
    container.appendChild(new FooterDivider().render());

    // 2. CENTER SECTION (Database, License, Sync, Backup Status)
    const centerSection = document.createElement("div");
    centerSection.className = "footer-center-section";

    centerSection.appendChild(new DatabaseStatus().render());
    centerSection.appendChild(new FooterDivider().render());
    centerSection.appendChild(new LicenseStatus().render());
    centerSection.appendChild(new FooterDivider().render());
    centerSection.appendChild(new SyncStatus().render());
    centerSection.appendChild(new FooterDivider().render());

    // Backup Status
    const backupStatus = new StatusItem({ label: "Backup:", value: "Auto (1h ago)", icon: "💾" });
    centerSection.appendChild(backupStatus.render());

    container.appendChild(centerSection);

    // Divider
    container.appendChild(new FooterDivider().render());

    // 3. RIGHT SECTION (Version Info, Build Environment, Current Time, Copyright)
    const rightSection = document.createElement("div");
    rightSection.className = "footer-right-section";

    rightSection.appendChild(new VersionInfo().render());
    rightSection.appendChild(new FooterDivider().render());

    // Environment info
    const envInfo = new StatusItem({ label: "Env:", value: "macOS-arm64", icon: "💻" });
    rightSection.appendChild(envInfo.render());
    rightSection.appendChild(new FooterDivider().render());

    // Live System Clock
    rightSection.appendChild(new SystemClock().render());
    rightSection.appendChild(new FooterDivider().render());

    // Copyright
    const copyright = document.createElement("span");
    copyright.textContent = "© 2026 Retail ERP";
    rightSection.appendChild(copyright);

    container.appendChild(rightSection);

    this.element = container;
    return container;
  }
}
