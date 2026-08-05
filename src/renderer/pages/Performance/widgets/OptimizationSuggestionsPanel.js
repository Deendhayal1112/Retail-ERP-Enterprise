/**
 * OptimizationSuggestionsPanel.js
 * Retail ERP Enterprise — Build, Bundle & Dependency Optimization Panel
 */

"use strict";

export default class OptimizationSuggestionsPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-logs-panel optimization-suggestions-panel";

    card.innerHTML = `
      <h3 style="margin:0; font-size:16px; font-weight:700; color:#1E293B; display:flex; align-items:center; gap:8px;">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
        Build & Dependency Recommendations
      </h3>
      <div class="logs-list-wrapper build-suggestions-list"></div>
    `;

    this.element = card;
    return card;
  }

  update(metrics, alerts = []) {
    if (!this.element) return;
    const wrapper = this.element.querySelector(".build-suggestions-list");
    if (!wrapper) return;

    const palette = {
      bundle: { bg: "rgba(239, 68, 68, 0.06)",  border: "rgba(239, 68, 68, 0.12)",  tag: "#DC2626" },
      asset:  { bg: "rgba(245, 158, 11, 0.06)", border: "rgba(245, 158, 11, 0.12)", tag: "var(--warning-500)" },
      split:  { bg: "rgba(99, 102, 241, 0.06)",  border: "rgba(99, 102, 241, 0.12)",  tag: "#4F46E5" },
      dep:    { bg: "rgba(16, 185, 129, 0.06)",  border: "rgba(16, 185, 129, 0.12)",  tag: "var(--success-500)" },
      tree:   { bg: "rgba(139, 92, 246, 0.06)",  border: "rgba(139, 92, 246, 0.12)",  tag: "#7C3AED" }
    };

    // Merge dynamic telemetry alerts and static build suggestions
    const alertItems = alerts.slice(0, 5).map(a => ({
      category: a.category, description: `${a.message}: ${a.value}`, isAlert: true
    }));
    const staticItems = (metrics.suggestions || []).map(s => ({ ...s, isAlert: false }));
    const all = [...alertItems, ...staticItems];

    if (all.length === 0) {
      wrapper.innerHTML = `<div style="color:var(--neutral-500); font-size:13px; text-align:center; padding:16px;">Bundles are fully optimized.</div>`;
    } else {
      wrapper.innerHTML = all.map(item => {
        const c = palette[item.category] || palette.bundle;
        return `
          <div class="log-item-row" style="background-color:${c.bg}; border:1px solid ${c.border};">
            <span class="log-time" style="color:${c.tag}; font-weight:700; white-space:nowrap;">[${item.category.toUpperCase()}]</span>
            <span class="log-message" style="margin-left:8px;">${item.description}</span>
            <span class="log-value-badge" style="background-color:${c.bg}; color:${c.tag}; border:1px solid ${c.border};">${item.isAlert ? "Alert" : "Recommendation"}</span>
          </div>`;
      }).join("");
    }
  }
}
