/**
 * TrendAnalysisPanel.js
 * Retail ERP Enterprise — Sales and Purchases Historical Trend Analyzer Panel
 */

"use strict";

export default class TrendAnalysisPanel {
  constructor(options = {}) {
    this.options = options;
    this.trends = options.trends || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "analytics-center-card col-span-12";
    card.innerHTML = `
      <h3 class="analytics-center-card-title">Monthly Trend Analysis</h3>
      <div style="display:flex; flex-direction:column; gap:20px;">
        ${this.trends.map(t => {
          // Normalize percentage width against a max scale of $70,000
          const salesPct = Math.min((t.Sales / 70000) * 100, 100);
          const purchasesPct = Math.min((t.Purchases / 70000) * 100, 100);
          
          return `
            <div style="border-bottom:1px solid #F1F5F9; padding-bottom:16px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <strong style="font-size:14px; color:#1E293B;">${t.month}</strong>
                <span style="font-size:11px; color:#6B7280;">Sales: ₹${t.Sales.toLocaleString()} | Purchases: ₹${t.Purchases.toLocaleString()}</span>
              </div>
              <div style="display:flex; flex-direction:column; gap:6px;">
                <!-- Sales bar -->
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:11px; color:#6B7280; width:60px;">Sales:</span>
                  <div style="flex:1; height:8px; background-color:#E9EDF5; border-radius:4px; overflow:hidden;">
                    <div style="height:100%; background-color:#5B3DF5; width:${salesPct}%; border-radius:4px;"></div>
                  </div>
                </div>
                <!-- Purchases bar -->
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:11px; color:#6B7280; width:60px;">Purchases:</span>
                  <div style="flex:1; height:8px; background-color:#E9EDF5; border-radius:4px; overflow:hidden;">
                    <div style="height:100%; background-color:#3B82F6; width:${purchasesPct}%; border-radius:4px;"></div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
    return card;
  }
}
