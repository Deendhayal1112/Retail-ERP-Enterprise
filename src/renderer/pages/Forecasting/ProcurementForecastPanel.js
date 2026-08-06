/**
 * ProcurementForecastPanel.js
 * Retail ERP Enterprise — Purchase planning and vendor capacity
 */

"use strict";

export default class ProcurementForecastPanel {
  constructor(options = {}) {
    this.options = options;
    this.procurement = options.procurement || {};
  }

  render() {
    const card = document.createElement("div");
    card.className = "forecast-card col-span-12";
    card.innerHTML = `
      <h3 class="forecast-card-title">Procurement Planning & Supplier Projections</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <!-- Left: Purchase Plan & Budgets -->
        <div style="border:1px solid #E9EDF5; padding:20px; border-radius:12px;">
          <h4 style="margin:0 0 16px 0; font-size:15px; color:#1E293B; font-weight:600;">Recommended Purchases & Budgets</h4>
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${(this.procurement.purchasePlan || []).map(p => `
              <div style="border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
                <strong style="color:#1E293B; display:block;">Order from: ${p.supplier}</strong>
                <div style="display:flex; justify-content:space-between; margin-top:4px; color:#6B7280;">
                  <span>Est. Cost: <strong style="color:#111827;">${p.expectedCost}</strong></span>
                  <span>Lead Time: <strong>${p.deliveryTime}</strong></span>
                </div>
                <div style="margin-top:4px; font-size:11px; color:#5B3DF5;">Recommeded Order Date: ${p.recommendedOrderDate}</div>
              </div>
            `).join("")}

            <!-- Budget allocated -->
            ${(this.procurement.budgetPlan || []).map(b => `
              <div style="background-color:#F8FAFC; border:1px solid #E9EDF5; border-radius:8px; padding:12px; font-size:12px; margin-top:8px;">
                <strong style="color:#1E293B; display:block; margin-bottom:4px;">Q3 Procurement Budget: ${b.allocatedBudget}</strong>
                <div style="display:flex; justify-content:space-between; color:#6B7280;">
                  <span>Proj. Spend: ${b.projectedSpend}</span>
                  <span style="color:#10B981;">Remaining: ${b.variance}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Right: Lead Times & Vendor Capacities -->
        <div style="border:1px solid #E9EDF5; padding:20px; border-radius:12px;">
          <h4 style="margin:0 0 16px 0; font-size:15px; color:#1E293B; font-weight:600;">Vendor Lead Times & Capacity Limits</h4>
          <div style="display:flex; flex-direction:column; gap:16px;">
            <!-- Vendor capacities -->
            <div>
              <h5 style="margin:0 0 8px 0; font-size:11px; color:#6B7280; text-transform:uppercase; font-weight:700;">Active Supplier Capacity</h5>
              ${(this.procurement.vendorCapacity || []).map(v => `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
                  <span style="color:#1E293B;">${v.vendor}</span>
                  <span style="font-weight:600; color:${v.currentCapacity >= "90%" ? "#EF4444" : "#10B981"};">${v.currentCapacity} Capacity (${v.status})</span>
                </div>
              `).join("")}
            </div>

            <!-- Procurement Calendar -->
            <div style="margin-top:12px;">
              <h5 style="margin:0 0 8px 0; font-size:11px; color:#6B7280; text-transform:uppercase; font-weight:700;">Procurement Calendar Milestones</h5>
              ${(this.procurement.calendar || []).map(c => `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
                  <div>
                    <strong style="color:#1E293B; display:block;">${c.event}</strong>
                    <span style="font-size:11px; color:#6B7280;">Due: ${c.date}</span>
                  </div>
                  <span class="forecast-badge ${c.priority.toLowerCase()}">${c.priority}</span>
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
