/**
 * InsightsPanel.js
 * Retail ERP Enterprise — AI Business Intelligence Insights
 */

"use strict";

export default class InsightsPanel {
  constructor(options = {}) {
    this.options = options;
    this.context = options.context || {};
    this.providers = options.providers || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "ai-center-card col-span-12";
    card.innerHTML = `
      <h3 class="ai-center-card-title">Cognitive Insights & Providers Registry</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <!-- Left: Active context parameters -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Prompt Context Variables</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Active role</span>
              <strong style="color:#1E293B;">${this.context.activeRole}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Database Status</span>
              <strong style="color:#1E293B;">${this.context.databaseStatus}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Diagnostics level</span>
              <strong style="color:#1E293B;">${this.context.diagnosticsLevel}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Telemetry sweep</span>
              <strong style="color:#1E293B;">${this.context.lastTelemetrySweep}</strong>
            </div>
          </div>
        </div>

        <!-- Right: Providers Checklist -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Supported AI LLMs</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${this.providers.map(p => `
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
                <div>
                  <strong style="color:#1E293B; display:block;">${p.name}</strong>
                  <span style="font-size:11px; color:#6B7280;">Type: ${p.type}</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="ai-badge ${p.active ? "active" : "inactive"}">${p.active ? "Enabled" : "Disabled"}</span>
                  <button class="toggle-prov-btn" data-id="${p.id}" style="height:24px; padding:0 8px; border:1px solid #E9EDF5; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer; background-color:#FFFFFF;">
                    Toggle
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    card.querySelectorAll(".toggle-prov-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.toggleProvider(id);
      });
    });

    return card;
  }

  async toggleProvider(id) {
    if (this.options.onToggleProvider) {
      await this.options.onToggleProvider(id);
    }
  }
}
