/**
 * CompanySwitcherPanel.js
 * Retail ERP Enterprise — Company Context Switcher Panel
 */

"use strict";

export default class CompanySwitcherPanel {
  /**
   * @param {Object}   options
   * @param {Array}    options.companies       List of active companies.
   * @param {string}   options.activeCompanyId Active company ID.
   * @param {Function} options.onSwitchCompany Callback on company switch click.
   */
  constructor(options = {}) {
    this.companies = options.companies || [];
    this.activeCompanyId = options.activeCompanyId || "";
    this.onSwitchCompany = options.onSwitchCompany || null;
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "companies-switcher-panel";

    panel.innerHTML = `
      <h2 class="panel-section-title">Active Workspace Selector</h2>
      <p class="panel-section-desc">Hot swap between locations to reload inventory balances, sales metrics, and checkout channels. Switching triggers database partition isolation, permission matrices updates, and local memory cache clears.</p>
    `;

    const grid = document.createElement("div");
    grid.className = "switcher-cards-grid";

    this.companies.filter(x => x.status === "active").forEach(c => {
      const card = document.createElement("div");
      const isActive = c.id === this.activeCompanyId;
      card.className = `switcher-card ${isActive ? "active-workspace" : ""}`;

      card.innerHTML = `
        <div class="switcher-card-header">
          <div class="workspace-info">
            <span class="workspace-logo">${c.logo}</span>
            <h3 class="workspace-name">${c.name}</h3>
          </div>
          ${isActive ? `<span class="active-badge font-semibold">ACTIVE</span>` : `<button class="btn-activate-workspace" data-id="${c.id}">Switch Workspace</button>`}
        </div>
        <p class="workspace-meta font-mono">${c.gstin} | ${c.phone}</p>
        
        <!-- Steps feedback loader simulated -->
        <div class="activation-progress-steps hidden">
          <div class="progress-step done">✓ Invalidate local memory cache</div>
          <div class="progress-step done">✓ Re-bind SQLite directory isolation context</div>
          <div class="progress-step done">✓ Reload access credentials matrix</div>
          <div class="progress-step done">✓ Refresh sidebar navigation permissions</div>
        </div>
      `;

      const btn = card.querySelector(".btn-activate-workspace");
      if (btn) {
        btn.addEventListener("click", () => {
          btn.disabled = true;
          btn.textContent = "Switching...";
          
          const progress = card.querySelector(".activation-progress-steps");
          progress.classList.remove("hidden");

          setTimeout(() => {
            if (this.onSwitchCompany) {
              this.onSwitchCompany(c.id);
            }
          }, 1800);
        });
      }

      grid.appendChild(card);
    });

    panel.appendChild(grid);
    return panel;
  }
}
