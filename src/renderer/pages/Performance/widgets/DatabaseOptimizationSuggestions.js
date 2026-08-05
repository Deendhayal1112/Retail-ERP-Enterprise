/**
 * DatabaseOptimizationSuggestions.js
 * Retail ERP Enterprise — SQLite Optimization Recommendations Panel
 */

"use strict";

export default class DatabaseOptimizationSuggestions {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-logs-panel db-optimization-suggestions";

    card.innerHTML = `
      <h3 style="margin:0; font-size:16px; font-weight:700; color:#1E293B; display:flex; align-items:center; gap:8px;">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        SQLite Optimization Recommendations
      </h3>
      <div class="logs-list-wrapper db-suggestions-list"></div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const wrapper = this.element.querySelector(".db-suggestions-list");
    if (!wrapper) return;

    // Merge static suggestions from schema + dynamic threshold alerts
    const items = metrics.suggestions || [];

    if (items.length === 0) {
      wrapper.innerHTML = `<div style="color:var(--neutral-500); font-size:13px; text-align:center; padding:16px;">SQLite database is fully optimized. No recommendations at this time.</div>`;
    } else {
      const categoryColors = {
        index: { bg: "rgba(37, 99, 235, 0.06)", border: "rgba(37, 99, 235, 0.12)", tag: "var(--primary-600)" },
        vacuum: { bg: "rgba(245, 158, 11, 0.06)", border: "rgba(245, 158, 11, 0.12)", tag: "var(--warning-500)" },
        cache: { bg: "rgba(16, 185, 129, 0.06)", border: "rgba(16, 185, 129, 0.12)", tag: "var(--success-500)" },
        wal: { bg: "rgba(139, 92, 246, 0.06)", border: "rgba(139, 92, 246, 0.12)", tag: "#7c3aed" }
      };

      wrapper.innerHTML = items.map(sug => {
        const colors = categoryColors[sug.category] || categoryColors.index;
        return `
          <div class="log-item-row" style="background-color:${colors.bg}; border: 1px solid ${colors.border};">
            <span class="log-time" style="color:${colors.tag}; font-weight:700; white-space:nowrap;">[${sug.category.toUpperCase()}]</span>
            <span class="log-message" style="margin-left:8px;">${sug.description}</span>
            <span class="log-value-badge" style="background-color:${colors.bg}; color:${colors.tag}; border:1px solid ${colors.border};">Recommendation</span>
          </div>
        `;
      }).join("");
    }
  }
}
