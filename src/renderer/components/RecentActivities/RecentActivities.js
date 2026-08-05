/**
 * RecentActivities.js
 * Retail ERP Enterprise — Recent Activities Timeline Component
 *
 * Implements:
 * - RecentActivities (Main card manager)
 * - ActivitiesHeader (Title bars and action buttons)
 * - ActivityTimeline (Vertical timeline track wrapper)
 * - ActivityItem (Timeline event block)
 * - ActivityIcon (Bullet icon wrapper)
 * - ActivityBadge (Event status pills)
 * - ActivityTimestamp (Time indicator)
 */

"use strict";

export class ActivitiesHeader {
  constructor(options = {}) {
    this.title = options.title || "Recent Activities";
    this.subtitle = options.subtitle || "Real-time operator audit records log";
  }

  render() {
    const header = document.createElement("header");
    header.className = "activities-header-row";

    header.innerHTML = `
      <div class="activities-header-details">
        <h3 class="activities-title-text">${this.title}</h3>
        <span class="activities-subtitle-text">${this.subtitle}</span>
      </div>
      <button class="activities-btn-view-all">View Audit Trail</button>
    `;

    header.querySelector(".activities-btn-view-all").addEventListener("click", () => {
      console.log("[Navigation Router] Redirecting user to full system activity logs table.");
    });

    return header;
  }
}

export class ActivityIcon {
  constructor(options = {}) {
    this.type = options.type || "system"; // sales, inventory, payment, system
  }

  render() {
    const bullet = document.createElement("div");
    bullet.className = `timeline-item-bullet-point ${this.type}`;
    
    let symbol = "⚙️";
    if (this.type === "sales") symbol = "💰";
    if (this.type === "inventory") symbol = "📦";
    if (this.type === "payment") symbol = "💳";

    bullet.textContent = symbol;
    return bullet;
  }
}

export class ActivityBadge {
  constructor(options = {}) {
    this.text = options.text || "";
    this.status = options.status || "success"; // success, warning, danger
  }

  render() {
    if (!this.text) return document.createTextNode("");
    const badge = document.createElement("span");
    badge.className = `activity-status-badge-pill ${this.status}`;
    badge.textContent = this.text;
    return badge;
  }
}

export class ActivityTimestamp {
  constructor(options = {}) {
    this.time = options.time || "";
  }

  render() {
    const span = document.createElement("span");
    span.className = "timeline-item-timestamp";
    span.textContent = this.time;
    return span;
  }
}

export class ActivityItem {
  constructor(options = {}) {
    this.item = {
      title: options.title || "Activity Title",
      description: options.description || "",
      operator: options.operator || "System",
      time: options.time || "",
      type: options.type || "system",
      badgeText: options.badgeText || "",
      badgeStatus: options.badgeStatus || "success",
      ...options
    };
  }

  render() {
    const block = document.createElement("div");
    block.className = "timeline-item-block";

    // Icon Bullet
    const icon = new ActivityIcon({ type: this.item.type });
    block.appendChild(icon.render());

    // Details Content
    const details = document.createElement("div");
    details.className = "timeline-item-details-box";

    // Header Line (Title, Badge, Timestamp)
    const headerLine = document.createElement("div");
    headerLine.className = "timeline-item-header-line";

    const titleWrap = document.createElement("div");
    titleWrap.style.display = "flex";
    titleWrap.style.alignItems = "center";
    titleWrap.style.gap = "8px";

    const title = document.createElement("span");
    title.className = "timeline-item-title";
    title.textContent = this.item.title;
    titleWrap.appendChild(title);

    if (this.item.badgeText) {
      const badge = new ActivityBadge({ text: this.item.badgeText, status: this.item.badgeStatus });
      titleWrap.appendChild(badge.render());
    }

    headerLine.appendChild(titleWrap);
    headerLine.appendChild(new ActivityTimestamp({ time: this.item.time }).render());
    details.appendChild(headerLine);

    // Description
    const desc = document.createElement("span");
    desc.className = "timeline-item-description";
    desc.textContent = this.item.description;
    details.appendChild(desc);

    // Operator Details
    const operator = document.createElement("span");
    operator.className = "timeline-item-operator-badge";
    operator.innerHTML = `By: <strong>${this.item.operator}</strong>`;
    details.appendChild(operator);

    block.appendChild(details);
    return block;
  }
}

export class ActivityTimeline {
  constructor(options = {}) {
    this.activities = options.activities || [];
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "activities-timeline-wrapper";

    this.activities.forEach(act => {
      const item = new ActivityItem(act);
      wrapper.appendChild(item.render());
    });

    return wrapper;
  }
}

// ─────────────────────────────────────────────────────
// MAIN RECENT ACTIVITIES COMPONENT
// ─────────────────────────────────────────────────────

export default class RecentActivities {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Default mock activities events listing
    this.events = [
      { title: "New Invoice Billing", description: "Completed invoice checkout #INV-2901", operator: "Cashier Jane Doe", time: "10 mins ago", type: "sales", badgeText: "Completed", badgeStatus: "success" },
      { title: "Inventory Restock Alert", description: "Minimum limit alert triggered for Product 'Denim Jacket'", operator: "System Daemon", time: "15 mins ago", type: "inventory", badgeText: "Warning", badgeStatus: "warning" },
      { title: "POS Registry Cash Drop", description: "Standard daily checkout cash drop POS Terminal 2", operator: "Supervisor Admin", time: "1 hour ago", type: "payment", badgeText: "Cash Drop", badgeStatus: "success" },
      { title: "Database Sync Success", description: "Successfully updated 12 stock lines against primary cloud server", operator: "Sync Daemon", time: "2 hours ago", type: "system", badgeText: "Synced", badgeStatus: "success" }
    ];
  }

  render() {
    const card = document.createElement("div");
    card.className = "recent-activities-card";

    // 1. Header
    card.appendChild(new ActivitiesHeader().render());

    // 2. Timeline List
    const timeline = new ActivityTimeline({ activities: this.events });
    card.appendChild(timeline.render());

    // 3. Footer info details
    const footer = document.createElement("footer");
    footer.className = "activities-footer-row";
    footer.innerHTML = `
      <span>Active Logging Thread Status: <strong>Monitoring</strong></span>
      <span>Sync Loop: <strong>5m Interval</strong></span>
    `;
    card.appendChild(footer);

    this.element = card;
    return card;
  }
}
