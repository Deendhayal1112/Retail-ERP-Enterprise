/**
 * RecommendationPanel.js
 * Retail ERP Enterprise — System maintenance recommendations panel
 */

"use strict";

export default class RecommendationPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-logs-panel recommendation-panel";
    card.innerHTML = `
      <h3 style="margin:0; font-size:16px; font-weight:700; color:#1E293B; display:flex; align-items:center; gap:8px;">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        Diagnostics Recommendations
      </h3>
      <div class="logs-list-wrapper recommendation-list"></div>
    `;
    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const wrapper = this.element.querySelector(".recommendation-list");
    if (!wrapper) return;

    const items = metrics.recommendations || [];

    if (items.length === 0) {
      wrapper.innerHTML = `<div style="color:var(--neutral-500); font-size:13px; text-align:center; padding:16px;">System diagnostics are within baseline parameters.</div>`;
      return;
    }

    const categoryColors = {
      performance: { bg: "rgba(37, 99, 235, 0.06)", border: "rgba(37, 99, 235, 0.12)", tag: "var(--primary-600)" },
      database: { bg: "rgba(16, 185, 129, 0.06)", border: "rgba(16, 185, 129, 0.12)", tag: "var(--success-500)" },
      startup: { bg: "rgba(139, 92, 246, 0.06)", border: "rgba(139, 92, 246, 0.12)", tag: "#7c3aed" },
      maintenance: { bg: "rgba(245, 158, 11, 0.06)", border: "rgba(245, 158, 11, 0.12)", tag: "var(--warning-500)" },
      memory: { bg: "rgba(245, 158, 11, 0.06)", border: "rgba(245, 158, 11, 0.12)", tag: "var(--warning-500)" }
    };

    wrapper.innerHTML = items.map(rec => {
      const colors = categoryColors[rec.category] || categoryColors.performance;
      return `
        <div class="log-item-row" style="background-color:${colors.bg}; border: 1px solid ${colors.border};">
          <span class="log-time" style="color:${colors.tag}; font-weight:700; white-space:nowrap;">[${rec.category.toUpperCase()}]</span>
          <span class="log-message" style="margin-left:8px;">${rec.description}</span>
          <span class="log-value-badge" style="background-color:${colors.bg}; color:${colors.tag}; border:1px solid ${colors.border};">Maintenance</span>
        </div>`;
    }).join("");
  }
}
