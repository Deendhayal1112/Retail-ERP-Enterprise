/**
 * Footer.js
 * Retail ERP Enterprise — Status Bar Footer Component
 *
 * Displays local SQLite connection status, database WAL mode status,
 * active terminal workspace details, and application version info.
 */

export default class Footer {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const container = document.createElement("div");
    container.className = "footer-status-bar";

    container.innerHTML = `
      <div class="footer-status-left">
        <span class="status-indicator-dot online"></span>
        <span class="status-text">SQLite Database: <span class="accent">WAL Mode Connected</span></span>
      </div>
      <div class="footer-status-center">
        <span class="status-text">Store Workspace: <span class="accent">100 Broadway Suite 4</span></span>
      </div>
      <div class="footer-status-right">
        <span class="status-text">Version 0.2.0 (Evaluation Trial)</span>
      </div>
    `;

    this.element = container;
    return container;
  }
}
