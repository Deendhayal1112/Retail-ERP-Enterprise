/**
 * WelcomeBanner.js
 * Retail ERP Enterprise — Reusable Dashboard Welcome Greeting Header Component
 *
 * Implements sections:
 * - Left: Greetings, active user label, business names, daily targets placeholders
 * - Right: Calendar, status badges, Pos Invoice launch buttons
 */

"use strict";

export class Greeting {
  constructor(options = {}) {
    this.fullName = options.fullName || "Operator User";
  }

  getGreetingText() {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  }

  render() {
    const heading = document.createElement("h1");
    heading.className = "welcome-greeting-title";
    heading.innerHTML = `${this.getGreetingText()}, <span class="welcome-user-accent">${this.fullName}</span>`;
    return heading;
  }
}

export class BusinessDate {
  constructor(options = {}) {
    this.date = options.date || new Date();
  }

  render() {
    const span = document.createElement("span");
    span.className = "welcome-date-string";
    span.textContent = this.date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return span;
  }
}

export class BusinessTime {
  render() {
    const span = document.createElement("span");
    span.className = "welcome-time-string";
    
    const updateTime = () => {
      const now = new Date();
      span.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " Local Time";
    };
    
    updateTime();
    return span;
  }
}

export class StoreStatus {
  constructor(options = {}) {
    this.isOpen = options.isOpen !== false;
  }

  render() {
    const badge = document.createElement("span");
    badge.className = "welcome-status-badge";
    badge.innerHTML = `<span class="welcome-status-badge-dot"></span> ${this.isOpen ? "Store Open" : "Store Closed"}`;
    return badge;
  }
}

export class PrimaryActionButton {
  constructor(options = {}) {
    this.label = options.label || "+ New Sale";
  }

  render() {
    const btn = document.createElement("button");
    btn.className = "welcome-btn-new-sale";
    btn.innerHTML = `<span>⚡</span> <span>${this.label}</span>`;
    btn.addEventListener("click", () => {
      console.log("[POS Trigger] Initializing fast-checkout invoice session.");
    });
    return btn;
  }
}

// ─────────────────────────────────────────────────────
// MAIN WELCOME BANNER COMPONENT
// ─────────────────────────────────────────────────────

export default class WelcomeBanner {
  constructor(options = {}) {
    this.options = {
      fullName: options.fullName || "System Administrator",
      companyName: options.companyName || "Retail Corp Enterprise",
      branchName: options.branchName || "Main Terminal #101",
      salesTarget: options.salesTarget || "$25,000",
      weather: options.weather || "Clear Sky (24°C)",
      isOpen: options.isOpen !== false,
      ...options
    };
    this.element = null;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "dashboard-welcome-banner-wrapper";

    // 1. LEFT COLUMN: GREETINGS & METRICS
    const leftCol = document.createElement("div");
    leftCol.className = "welcome-left-column";

    // Greeting Header
    const greeting = new Greeting({ fullName: this.options.fullName });
    leftCol.appendChild(greeting.render());

    // Meta Details row
    const metaRow = document.createElement("div");
    metaRow.className = "welcome-meta-row";
    metaRow.innerHTML = `
      <span>${this.options.companyName}</span>
      <span class="welcome-meta-bullet-separator"></span>
      <span>${this.options.branchName}</span>
    `;
    leftCol.appendChild(metaRow);

    // Expandable targets row (Prepare for target sales, weather, AI tools)
    const targetsRow = document.createElement("div");
    targetsRow.className = "welcome-expandable-targets-row";
    targetsRow.innerHTML = `
      <div class="target-item-tag">
        <span>🎯 Sales Target:</span>
        <span class="target-item-value">${this.options.salesTarget}</span>
      </div>
      <div class="target-item-tag">
        <span>🌤️ Forecast:</span>
        <span class="target-item-value">${this.options.weather}</span>
      </div>
      <div class="target-item-tag">
        <span>🤖 AI Engine:</span>
        <span class="target-item-value">Ready</span>
      </div>
    `;
    leftCol.appendChild(targetsRow);
    wrapper.appendChild(leftCol);

    // 2. RIGHT COLUMN: STATUS & ACTIONS
    const rightCol = document.createElement("div");
    rightCol.className = "welcome-right-column";

    // Date/Time calendar box
    const calendarBox = document.createElement("div");
    calendarBox.className = "welcome-date-time-box";
    calendarBox.appendChild(new BusinessDate().render());
    calendarBox.appendChild(new BusinessTime().render());
    rightCol.appendChild(calendarBox);

    // Store Status Badge
    rightCol.appendChild(new StoreStatus({ isOpen: this.options.isOpen }).render());

    // Primary action button
    rightCol.appendChild(new PrimaryActionButton().render());
    wrapper.appendChild(rightCol);

    this.element = wrapper;
    return wrapper;
  }
}
