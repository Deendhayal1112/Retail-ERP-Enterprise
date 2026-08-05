/**
 * NotificationPanel.js
 * Retail ERP Enterprise — System Alerts & Notification Panel Component
 *
 * Implements notification bell counts, active alert list items, and clear operations.
 */

export default class NotificationPanel {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "header-notification-panel-wrapper";

    wrapper.innerHTML = `
      <button class="header-action-button-item button-notifications" aria-label="Open Notifications Center">
        <span>🔔</span>
        <span class="action-item-badge-count">3</span>
      </button>
      <div class="notification-dropdown-drawer-card">
        <div class="drawer-header">
          <h4 class="drawer-title">Notifications</h4>
          <span class="drawer-action-clear">Clear all</span>
        </div>
        <div class="drawer-list-items">
          <div class="drawer-item-row">
            <span class="drawer-item-icon">⚠️</span>
            <div class="drawer-item-content">
              <span class="drawer-item-title">Product "Classic Denim Jacket" is below low-stock limit.</span>
              <span class="drawer-item-time">10 minutes ago</span>
            </div>
          </div>
          <div class="drawer-item-row">
            <span class="drawer-item-icon">👤</span>
            <div class="drawer-item-content">
              <span class="drawer-item-title">Cashier "Jane Doe" logged in to POS Lane 2.</span>
              <span class="drawer-item-time">1 hour ago</span>
            </div>
          </div>
          <div class="drawer-item-row">
            <span class="drawer-item-icon">🔑</span>
            <div class="drawer-item-content">
              <span class="drawer-item-title">Evaluation license expires in 90 days.</span>
              <span class="drawer-item-time">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const bell = wrapper.querySelector(".button-notifications");
    const drawer = wrapper.querySelector(".notification-dropdown-drawer-card");
    const clearBtn = wrapper.querySelector(".drawer-action-clear");

    // Display/hide notification panel
    bell.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = drawer.classList.toggle("active");
      if (isActive) {
        // Close profile user menus if open
        const profile = document.querySelector(".usermenu-dropdown-drawer-card");
        if (profile) profile.classList.remove("active");
      }
    });

    // Close notifications panel upon global clicks
    document.addEventListener("click", () => {
      drawer.classList.remove("active");
    });

    drawer.addEventListener("click", (e) => {
      e.stopPropagation(); // Avoid early dismiss on clicking drawer items
    });

    clearBtn.addEventListener("click", () => {
      const badge = wrapper.querySelector(".action-item-badge-count");
      if (badge) badge.style.display = "none";
      const list = wrapper.querySelector(".drawer-list-items");
      if (list) {
        list.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.775rem;">
            No new notifications.
          </div>
        `;
      }
      console.log("[Notification Panel] Alerts log cleared.");
    });

    this.element = wrapper;
    return wrapper;
  }
}
