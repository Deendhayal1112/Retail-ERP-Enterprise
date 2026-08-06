/**
 * PredictiveInsightsPanel.js
 * Retail ERP Enterprise — Sales and stock-out forecast trends
 */

"use strict";

export default class PredictiveInsightsPanel {
  constructor(options = {}) {
    this.options = options;
    this.forecasts = options.forecasts || {};
  }

  render() {
    const card = document.createElement("div");
    card.className = "analytics-center-card col-span-12";
    card.innerHTML = `
      <h3 class="analytics-center-card-title">Predictive Insights & Stock-out Forecasting</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <!-- Left: Sales forecasts -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Sales Forecasting (3-Month Outlook)</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${(this.forecasts.sales || []).map(s => `
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
                <span style="color:#6B7280;">${s.month}</span>
                <strong style="color:#1E293B;">₹${s.value.toLocaleString()} <span style="font-size:11px; color:#10B981;">(Conf. ${s.confidence})</span></strong>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Right: Stock-out predictions -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Stock-out Prediction Alerts</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${(this.forecasts.inventory || []).map(i => `
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
                <div>
                  <strong style="color:#1E293B; display:block;">${i.product}</strong>
                  <span style="font-size:11px; color:${i.daysRemaining <= 3 ? "#EF4444" : "#D97706"};">${i.status}</span>
                </div>
                <span class="analytics-badge ${i.daysRemaining <= 3 ? "warning" : "stable"}">${i.daysRemaining} days remaining</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
    return card;
  }
}
