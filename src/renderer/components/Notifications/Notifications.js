/**
 * Notifications.js
 * Retail ERP Enterprise — Reusable System Notifications & Alerts Card Component
 *
 * Implements:
 * - Notifications (Main card manager)
 * - NotificationsHeader (Header titles and count badges)
 * - NotificationList (Row layout wraps)
 * - NotificationItem (Individual alert row element)
 * - NotificationIcon (Visual priority symbol)
 * - NotificationBadge (Priority label tag)
 * - NotificationTimestamp (Time metadata logs)
 */

"use strict";

export class NotificationsHeader {
  constructor(options = {}) {
    this.title = options.title || "Notifications & Alerts";
    this.count = options.count || 0;
  }

  render() {
    const header = document.createElement("header");
    header.className = "notifications-header-row";

    header.innerHTML = `
      <div class="notifications-header-details">
        <h3 class="notifications-title-text">${this.title}</h3>
        ${this.count > 0 ? `<span class="notifications-count-badge">${this.count} Active</span>` : ""}
      </div>
      <button class="notifications-btn-view-all">Clear All</button>
    `;

    header.querySelector(".notifications-btn-view-all").addEventListener("click", () => {
      console.log("[Notifications Action] Triggering global alerts list purge.");
      const tbody = document.querySelector(".notifications-list-wrapper");
      if (tbody) {
        tbody.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.775rem;">No active alerts.</div>`;
      }
      const badge = document.querySelector(".notifications-count-badge");
      if (badge) badge.style.display = "none";
    });

    return header;
  }
}

export class NotificationIcon {
  constructor(options = {}) {
    this.priority = options.priority || "info"; // critical, warning, info, success
  }

  render() {
    const box = document.createElement("div");
    box.className = `notification-icon-box ${this.priority}`;

    let symbol = "ℹ️";
    if (this.priority === "critical") symbol = "🚨";
    if (this.priority === "warning") symbol = "⚠️";
    if (this.priority === "success") symbol = "✅";

    box.textContent = symbol;
    return box;
  }
}

export class NotificationBadge {
  constructor(options = {}) {
    this.text = options.text || "";
    this.priority = options.priority || "info";
  }

  render() {
    if (!this.text) return document.createTextNode("");
    const badge = document.createElement("span");
    badge.className = `notification-priority-badge ${this.priority}`;
    badge.textContent = this.text;
    return badge;
  }
}

export class NotificationTimestamp {
  constructor(options = {}) {
    this.time = options.time || "";
  }

  render() {
    const span = document.createElement("span");
    span.className = "notification-item-timestamp";
    span.textContent = this.time;
    return span;
  }
}

export class NotificationItem {
  constructor(options = {}) {
    this.item = {
      title: options.title || "Alert",
      description: options.description || "",
      time: options.time || "",
      priority: options.priority || "info",
      badgeText: options.badgeText || "",
      isRead: options.isRead === true,
      ...options
    };
  }

  render() {
    const row = document.createElement("div");
    row.className = `notification-item-row ${this.item.isRead ? "read" : "unread"}`;

    // Icon
    const icon = new NotificationIcon({ priority: this.item.priority });
    row.appendChild(icon.render());

    // Details block
    const details = document.createElement("div");
    details.className = "notification-details-box";

    // Header line (Title, Badge, Timestamp)
    const headerLine = document.createElement("div");
    headerLine.className = "notification-title-line";

    const titleWrap = document.createElement("div");
    titleWrap.style.display = "flex";
    titleWrap.style.alignItems = "center";
    titleWrap.style.gap = "8px";

    const title = document.createElement("span");
    title.className = "notification-item-title";
    title.textContent = this.item.title;
    titleWrap.appendChild(title);

    if (this.item.badgeText) {
      const badge = new NotificationBadge({ text: this.item.badgeText, priority: this.item.priority });
      titleWrap.appendChild(badge.render());
    }

    headerLine.appendChild(titleWrap);
    headerLine.appendChild(new NotificationTimestamp({ time: this.item.time }).render());
    details.appendChild(headerLine);

    // Description text
    const desc = document.createElement("span");
    desc.className = "notification-item-description";
    desc.textContent = this.item.description;
    details.appendChild(desc);

    row.appendChild(details);

    // Click to mark as read UI feedback
    row.addEventListener("click", () => {
      row.classList.remove("unread");
      row.classList.add("read");
      console.log(`[Notification Alert] Marked as read: ${this.item.title}`);
    });

    return row;
  }
}

export class NotificationList {
  constructor(options = {}) {
    this.notifications = options.notifications || [];
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "notifications-list-wrapper";

    this.notifications.forEach(note => {
      const row = new NotificationItem(note);
      wrapper.appendChild(row.render());
    });

    return wrapper;
  }
}

// ─────────────────────────────────────────────────────
// MAIN NOTIFICATIONS PANEL COMPONENT
// ─────────────────────────────────────────────────────

export default class Notifications {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Default mock notification center metrics
    this.alerts = [
      { title: "SQLite WAL Backup Failure", description: "Standard database backup loop timed out. Check network disk sync availability.", time: "5 mins ago", priority: "critical", badgeText: "Critical", isRead: false },
      { title: "Inventory Reorder Trigger", description: "Item 'Premium Leather Boot' is below threshold limit. Reorder recommended.", time: "25 mins ago", priority: "warning", badgeText: "Warning", isRead: false },
      { title: "Evaluation License Alert", description: "Company evaluation trial subscription details expires in 90 days.", time: "1 hour ago", priority: "info", badgeText: "License Info", isRead: true },
      { title: "Cloud Database Synced", description: "Database catalog updates successfully pushed to master central node.", time: "3 hours ago", priority: "success", badgeText: "Success", isRead: true }
    ];
  }

  render() {
    const card = document.createElement("div");
    card.className = "notifications-alert-card";

    // Unread count check
    const unreadCount = this.alerts.filter(a => !a.isRead).length;

    // 1. Header
    card.appendChild(new NotificationsHeader({ count: unreadCount }).render());

    // 2. Notifications List
    const list = new NotificationList({ notifications: this.alerts });
    card.appendChild(list.render());

    // 3. Footer info details
    const footer = document.createElement("footer");
    footer.className = "notifications-footer-row";
    footer.innerHTML = `
      <span>System Alert Daemon: <strong style="color: var(--success-600);">Running</strong></span>
      <span>Broadcaster: <strong>Listening</strong></span>
    `;
    card.appendChild(footer);

    this.element = card;
    return card;
  }
}
