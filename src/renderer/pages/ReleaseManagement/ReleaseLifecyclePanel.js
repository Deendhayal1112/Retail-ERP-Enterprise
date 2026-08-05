/**
 * ReleaseLifecyclePanel.js
 * Retail ERP Enterprise — Stability Phase Promotion Controls Panel
 */

"use strict";

export default class ReleaseLifecyclePanel {
  constructor(options = {}) {
    this.options = options;
    this.currentState = options.currentState || "Beta";
    this.lifecycleStates = ["Development", "Alpha", "Beta", "Release Candidate", "Stable", "LTS"];
  }

  render() {
    const card = document.createElement("div");
    card.className = "release-mgmt-card col-span-12";
    card.innerHTML = `
      <h3 class="release-mgmt-card-title">Release Promotion & Stability Phase</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <!-- Left: Current State status -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Active Lifecycle Status</h4>
          <div style="padding:16px; border:1px solid #E9EDF5; border-radius:12px; background-color:#F8FAFC; display:flex; flex-direction:column; gap:8px;">
            <span style="font-size:12px; color:#6B7280; font-weight:500;">Current Release Stability</span>
            <strong style="font-size:24px; color:#5B3DF5;">${this.currentState}</strong>
            <p style="margin:4px 0 0 0; font-size:12px; color:#6B7280;">Ready for code validation checks before promotion.</p>
          </div>
        </div>

        <!-- Right: Action promotes -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Promote Phase Target</h4>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            ${this.lifecycleStates.map(state => `
              <button class="promote-state-btn ${state === this.currentState ? "active" : ""}" data-state="${state}" style="height:36px; padding:0 16px; border:1px solid #E9EDF5; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; background-color:${state === this.currentState ? "#5B3DF5" : "#FFFFFF"}; color:${state === this.currentState ? "#FFFFFF" : "#1E293B"};">
                ${state}
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    card.querySelectorAll(".promote-state-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const state = btn.getAttribute("data-state");
        if (state === this.currentState) return;
        if (this.options.onPromote) {
          await this.options.onPromote(state);
        }
      });
    });

    return card;
  }
}
