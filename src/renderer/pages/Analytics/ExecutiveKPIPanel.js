/**
 * ExecutiveKPIPanel.js
 * Retail ERP Enterprise — Detailed Executive Key Performance Indicators
 */

"use strict";

export default class ExecutiveKPIPanel {
  constructor(options = {}) {
    this.options = options;
    this.kpis = options.kpis || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "analytics-center-card col-span-12";
    card.innerHTML = `
      <h3 class="analytics-center-card-title">Key Performance Indicators (KPIs)</h3>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:24px;">
        ${this.kpis.map(kpi => `
          <div style="border:1px solid #E9EDF5; border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; color:#6B7280; font-weight:600;">${kpi.name}</span>
              <span class="analytics-badge ${kpi.status.toLowerCase()}">${kpi.status}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:baseline;">
              <strong style="font-size:22px; color:#111827;">${kpi.value}</strong>
              <span style="font-size:12px; font-weight:700; color:${kpi.status === "Positive" ? "#10B981" : kpi.status === "Warning" ? "#EF4444" : "#3B82F6"};">${kpi.change}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
    return card;
  }
}
