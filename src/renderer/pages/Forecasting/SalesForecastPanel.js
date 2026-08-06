/**
 * SalesForecastPanel.js
 * Retail ERP Enterprise — Sales Forecast panels layout
 */

"use strict";

export default class SalesForecastPanel {
  constructor(options = {}) {
    this.options = options;
    this.projections = options.projections || {};
  }

  render() {
    const card = document.createElement("div");
    card.className = "forecast-card col-span-12";
    card.innerHTML = `
      <h3 class="forecast-card-title">Sales Projections Outlook</h3>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:24px;">
        <!-- Card: Monthly Projections -->
        <div style="border:1px solid #E9EDF5; padding:20px; border-radius:12px;">
          <h4 style="margin:0 0 16px 0; font-size:15px; color:#1E293B; font-weight:600;">Monthly & Quarterly Forecast</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${(this.projections.monthly || []).concat(this.projections.quarterly || []).map(m => `
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
                <span style="color:#6B7280;">${m.label}</span>
                <strong style="color:#1E293B;">${m.value} <span style="font-size:11px; color:#10B981;">(Conf. ${m.confidence})</span></strong>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Card: Daily & Weekly Projections -->
        <div style="border:1px solid #E9EDF5; padding:20px; border-radius:12px;">
          <h4 style="margin:0 0 16px 0; font-size:15px; color:#1E293B; font-weight:600;">Short-Term Forecast</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${(this.projections.daily || []).concat(this.projections.weekly || []).map(w => `
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
                <span style="color:#6B7280;">${w.label}</span>
                <strong style="color:#1E293B;">${w.value} <span style="font-size:11px; color:#10B981;">(Conf. ${w.confidence})</span></strong>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Card: Seasonal Adjustments -->
        <div style="border:1px solid #E9EDF5; padding:20px; border-radius:12px;">
          <h4 style="margin:0 0 16px 0; font-size:15px; color:#1E293B; font-weight:600;">Seasonal Projections Index</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${(this.projections.seasonal || []).map(s => `
              <div style="border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
                <strong style="color:#1E293B; display:block;">${s.label}</strong>
                <span style="font-size:12px; color:#10B981; font-weight:500;">${s.value} <span style="color:#6B7280;">(Conf. ${s.confidence})</span></span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
    return card;
  }
}
