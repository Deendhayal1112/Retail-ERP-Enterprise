/*
 * toast.js
 * Retail ERP Enterprise — Reusable Toast Component Manager
 *
 * Exposes a simple dynamic Toast notification layer for renderer modules.
 *
 * Phase 2 — Step 7: Enterprise Reusable UI Components
 */

export class Toast {
  static container = null;

  /**
   * Initializes the shared global Toast container.
   */
  static init() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    }
  }

  /**
   * Spawns a new visual toast notification.
   * @param {string} message - Toast content.
   * @param {'success' | 'danger' | 'warning' | 'info'} type - Alert status styling.
   * @param {number} duration - Milliseconds to show toast.
   */
  static show(message, type = "info", duration = 3000) {
    this.init();

    const toast = document.createElement("div");
    toast.className = `toast alert-${type}`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "polite");

    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "danger") icon = "❌";
    if (type === "warning") icon = "⚠️";

    toast.innerHTML = `
      <span aria-hidden="true" style="font-size: 1.125rem;">${icon}</span>
      <span class="text-small text-truncate" style="flex: 1; font-weight: 500;">${message}</span>
    `;

    this.container.appendChild(toast);

    // Auto-remove setup
    const removeTimeout = setTimeout(() => {
      toast.style.animation = "fadeOut var(--transition-normal) forwards";
      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    }, duration);

    // Permit early manual click dismiss
    toast.addEventListener("click", () => {
      clearTimeout(removeTimeout);
      toast.remove();
    });
  }
}
window.Toast = Toast;
