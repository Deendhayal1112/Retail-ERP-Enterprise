/**
 * BusinessIntelligencePanel.js
 * Retail ERP Enterprise — Top Products and Vendor Reliability indexes
 */

"use strict";

export default class BusinessIntelligencePanel {
  constructor(options = {}) {
    this.options = options;
    this.recommendations = options.recommendations || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "analytics-center-card col-span-12";
    card.innerHTML = `
      <h3 class="analytics-center-card-title">Business Intelligence Recommendations</h3>
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${this.recommendations.map(rec => `
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:12px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <strong style="font-size:14px; color:#1E293B;">${rec.category}</strong>
                <span class="analytics-badge ${rec.impact.toLowerCase().replace(" ", "-")}">${rec.impact}</span>
              </div>
              <p style="margin:4px 0 0 0; font-size:12px; color:#6B7280;">${rec.message}</p>
            </div>
            <button class="verify-rec-btn" data-id="${rec.id}" style="height:32px; padding:0 12px; border:1px solid #E9EDF5; background:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; color:#1E293B;">
              Apply Action
            </button>
          </div>
        `).join("")}
      </div>
    `;

    card.querySelectorAll(".verify-rec-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        alert(`Business Intelligence Recommendation "${id}" parameters applied successfully!`);
      });
    });

    return card;
  }
}
