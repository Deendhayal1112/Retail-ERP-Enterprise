/**
 * FinancialForecastPanel.js
 * Retail ERP Enterprise — Revenue and cash flow predictive models
 */

"use strict";

export default class FinancialForecastPanel {
  constructor(options = {}) {
    this.options = options;
    this.financials = options.financials || {};
  }

  render() {
    const card = document.createElement("div");
    card.className = "forecast-card col-span-12";
    card.innerHTML = `
      <h3 class="forecast-card-title">Financial Projections & Cash Flow Forecast</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <!-- Left: Revenues & Profits -->
        <div style="border:1px solid #E9EDF5; padding:20px; border-radius:12px;">
          <h4 style="margin:0 0 16px 0; font-size:15px; color:#1E293B; font-weight:600;">Projected Profits & Cash Inflow</h4>
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${(this.financials.revenue || []).map(r => `
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
                <span style="color:#6B7280;">Revenue: ${r.label}</span>
                <strong style="color:#111827;">${r.value} <span style="font-size:11px; color:#10B981;">(${r.status})</span></strong>
              </div>
            `).join("")}

            <!-- Profit Margins -->
            ${(this.financials.profit || []).map(p => `
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
                <span style="color:#6B7280;">${p.label}</span>
                <strong style="color:#10B981;">${p.value}</strong>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Right: Cash Flow Forecasts -->
        <div style="border:1px solid #E9EDF5; padding:20px; border-radius:12px;">
          <h4 style="margin:0 0 16px 0; font-size:15px; color:#1E293B; font-weight:600;">Cash Flow Projections (Net Operations)</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${(this.financials.cashFlow || []).map(cf => `
              <div style="border-bottom:1px solid #F1F5F9; padding-bottom:12px; font-size:13px;">
                <strong style="color:#1E293B; display:block; margin-bottom:4px;">${cf.month}</strong>
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; color:#6B7280; font-size:12px;">
                  <span>Inflows: <strong style="color:#111827;">${cf.inflows}</strong></span>
                  <span>Outflows: <strong style="color:#111827;">${cf.outflows}</strong></span>
                  <span>Net Flow: <strong style="color:#10B981;">${cf.net}</strong></span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
    return card;
  }
}
