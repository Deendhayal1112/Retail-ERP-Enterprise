/**
 * InstalledPluginsPanel.js
 * Retail ERP Enterprise — Installed Plugins Grid Panel
 */

"use strict";

export default class InstalledPluginsPanel {
  /**
   * @param {Object}   options
   * @param {Array}    options.plugins   List of installed plugins.
   * @param {Function} options.onToggle  Callback when plugin status is toggled.
   */
  constructor(options = {}) {
    this.plugins = options.plugins || [];
    this.onToggle = options.onToggle || null;
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "plugins-installed-panel";

    if (this.plugins.length === 0) {
      panel.innerHTML = `<div class="empty-state">No installed plugins found.</div>`;
      return panel;
    }

    const grid = document.createElement("div");
    grid.className = "plugins-grid";

    this.plugins.forEach(plug => {
      const card = document.createElement("div");
      card.className = `plugin-card ${plug.status === "active" ? "active" : "inactive"}`;
      
      const permissionsTags = plug.permissions
        ? plug.permissions.map(p => `<span class="perm-tag font-mono">${p.split(":")[0]}</span>`).join("")
        : "";

      card.innerHTML = `
        <div class="card-header-row">
          <div class="plugin-identity">
            <h3 class="plugin-name">${plug.name}</h3>
            <span class="plugin-author">by ${plug.author}</span>
          </div>
          <label class="switch-toggle-label">
            <input type="checkbox" class="toggle-checkbox" ${plug.status === "active" ? "checked" : ""} />
            <span class="switch-slider"></span>
          </label>
        </div>
        <p class="plugin-description">${plug.description}</p>
        <div class="card-footer-row">
          <div class="plugin-meta-tags">
            <span class="version-tag font-mono">v${plug.version}</span>
            ${permissionsTags}
          </div>
          <span class="status-indicator-tag">${plug.status.toUpperCase()}</span>
        </div>
      `;

      // Event listener for toggle activation
      const checkbox = card.querySelector(".toggle-checkbox");
      checkbox.addEventListener("change", (e) => {
        if (this.onToggle) {
          this.onToggle(plug.id, e.target.checked);
        }
      });

      grid.appendChild(card);
    });

    panel.appendChild(grid);
    return panel;
  }
}
