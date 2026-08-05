/**
 * StartupSuggestions.js
 * Retail ERP Enterprise — Boot Optimization Recommendations Panel
 */

"use strict";

export default class StartupSuggestions {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-logs-panel startup-suggestions";
    card.innerHTML = `
      <h3 style="margin:0;font-size:16px;font-weight:700;color:#1E293B;display:flex;align-items:center;gap:8px;">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        Startup Optimization Recommendations
      </h3>
      <div class="logs-list-wrapper startup-suggestions-list"></div>
    `;
    this.element = card;
    return card;
  }

  update(metrics, alerts = []) {
    if (!this.element) return;
    const wrapper = this.element.querySelector(".startup-suggestions-list");
    if (!wrapper) return;

    const palette = {
      lazy:     { bg: "rgba(99,102,241,0.06)",  border: "rgba(99,102,241,0.12)",  tag: "#4F46E5" },
      cache:    { bg: "rgba(37,99,235,0.06)",   border: "rgba(37,99,235,0.12)",   tag: "var(--primary-600)" },
      module:   { bg: "rgba(245,158,11,0.06)",  border: "rgba(245,158,11,0.12)",  tag: "var(--warning-500)" },
      service:  { bg: "rgba(16,185,129,0.06)",  border: "rgba(16,185,129,0.12)",  tag: "var(--success-500)" },
      critical: { bg: "rgba(239,68,68,0.06)",   border: "rgba(239,68,68,0.12)",   tag: "#DC2626" }
    };

    // Merge live alerts + static suggestions
    const alertItems = alerts.slice(0, 5).map(a => ({
      category: a.category, description: `${a.message}: ${a.value}`, isAlert: true
    }));
    const staticItems = (metrics.suggestions || []).map(s => ({ ...s, isAlert: false }));
    const all = [...alertItems, ...staticItems];

    if (all.length === 0) {
      wrapper.innerHTML = `<div style="color:var(--neutral-500);font-size:13px;text-align:center;padding:16px;">Startup is fully optimized. No recommendations at this time.</div>`;
    } else {
      wrapper.innerHTML = all.map(item => {
        const c = palette[item.category] || palette.cache;
        return `
          <div class="log-item-row" style="background-color:${c.bg};border:1px solid ${c.border};">
            <span class="log-time" style="color:${c.tag};font-weight:700;white-space:nowrap;">[${item.category.toUpperCase()}]</span>
            <span class="log-message" style="margin-left:8px;">${item.description}</span>
            <span class="log-value-badge" style="background-color:${c.bg};color:${c.tag};border:1px solid ${c.border};">${item.isAlert ? "Alert" : "Recommendation"}</span>
          </div>`;
      }).join("");
    }
  }
}
