/**
 * InventoryForecastPanel.js
 * Retail ERP Enterprise — Inventory planning forecasts
 */

"use strict";

export default class InventoryForecastPanel {
  constructor(options = {}) {
    this.options = options;
    this.forecasts = options.forecasts || {};
  }

  render() {
    const card = document.createElement("div");
    card.className = "forecast-card col-span-12";
    card.innerHTML = `
      <h3 class="forecast-card-title">Inventory Forecasting & Demand Planner</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <!-- Left: Reorder & Safety Stocks -->
        <div style="border:1px solid #E9EDF5; padding:20px; border-radius:12px;">
          <h4 style="margin:0 0 16px 0; font-size:15px; color:#1E293B; font-weight:600;">Reorder & Safety Stock Projections</h4>
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${(this.forecasts.reorder || []).map(r => {
              // Find matching safety stock
              const safety = (this.forecasts.safetyStock || []).find(s => s.product === r.product);
              return `
                <div style="border-bottom:1px solid #F1F5F9; padding-bottom:12px; font-size:13px;">
                  <strong style="color:#1E293B; display:block; margin-bottom:4px;">${r.product}</strong>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; color:#6B7280;">
                    <span>Stock: <strong>${r.currentStock}</strong></span>
                    <span>Safety Stock: <strong>${safety ? safety.quantity : "N/A"}</strong></span>
                    <span>Min Limit: <strong>${r.minThreshold}</strong></span>
                    <span>Reorder In: <strong style="color:#EF4444;">${r.predictedReorderDate}</strong></span>
                  </div>
                  <div style="margin-top:6px; color:#5B3DF5; font-weight:600;">Recommended Order Qty: ${r.recommendedOrderQty}</div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Right: Stock-out & Overstock Warnings -->
        <div style="border:1px solid #E9EDF5; padding:20px; border-radius:12px;">
          <h4 style="margin:0 0 16px 0; font-size:15px; color:#1E293B; font-weight:600;">Stock-out & Overstock Warnings</h4>
          <div style="display:flex; flex-direction:column; gap:16px;">
            <!-- Stock-out predictions -->
            <div>
              <h5 style="margin:0 0 8px 0; font-size:12px; color:#EF4444; text-transform:uppercase; font-weight:700;">Stock-out Risks</h5>
              ${(this.forecasts.stockOut || []).map(s => `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
                  <span style="color:#1E293B;">${s.product}</span>
                  <span class="forecast-badge critical">${s.daysRemaining} days left</span>
                </div>
              `).join("")}
            </div>

            <!-- Overstock predictions -->
            <div style="margin-top:12px;">
              <h5 style="margin:0 0 8px 0; font-size:12px; color:#D97706; text-transform:uppercase; font-weight:700;">Overstock Alerts</h5>
              ${(this.forecasts.overstock || []).map(o => `
                <div style="border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
                  <strong style="color:#1E293B; display:block;">${o.product}</strong>
                  <span style="font-size:12px; color:#6B7280;">Current: ${o.currentStock} | Demand: ${o.demandRate}</span>
                  <span class="forecast-badge warning" style="display:inline-block; margin-top:4px;">Risk: ${o.lossRisk}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
    return card;
  }
}
