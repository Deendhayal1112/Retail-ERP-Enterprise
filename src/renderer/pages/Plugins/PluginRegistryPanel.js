/**
 * PluginRegistryPanel.js
 * Retail ERP Enterprise — Available Plugins Catalog Panel
 */

"use strict";

export default class PluginRegistryPanel {
  /**
   * @param {Object}   options
   * @param {Array}    options.available List of available store plugins.
   * @param {Function} options.onInstall Callback when a plugin is installed.
   */
  constructor(options = {}) {
    this.available = options.available || [];
    this.onInstall = options.onInstall || null;
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "plugins-registry-panel";

    if (this.available.length === 0) {
      panel.innerHTML = `<div class="empty-state">No available plugins found in repository store.</div>`;
      return panel;
    }

    const grid = document.createElement("div");
    grid.className = "plugins-grid";

    this.available.forEach(plug => {
      const card = document.createElement("div");
      card.className = "plugin-card store-card";

      card.innerHTML = `
        <div class="card-header-row">
          <div class="plugin-identity">
            <h3 class="plugin-name">${plug.name}</h3>
            <span class="plugin-author">by ${plug.author}</span>
          </div>
          <button class="btn-install-sim" data-id="${plug.id}">Install</button>
        </div>
        <p class="plugin-description">${plug.description}</p>
        <div class="card-footer-row">
          <div class="plugin-meta-tags">
            <span class="version-tag font-mono">v${plug.version}</span>
            <span class="installs-tag">⭐ ${plug.rating} (${plug.installs})</span>
          </div>
          <span class="compat-tag font-mono">Compat: ${plug.compatibility}</span>
        </div>
      `;

      // Event listener for install simulation
      const btn = card.querySelector(".btn-install-sim");
      btn.addEventListener("click", () => {
        btn.disabled = true;
        btn.textContent = "Installing...";
        btn.classList.add("installing");
        
        setTimeout(() => {
          if (this.onInstall) {
            this.onInstall(plug.id);
          }
        }, 1500);
      });

      grid.appendChild(card);
    });

    panel.appendChild(grid);
    return panel;
  }
}
