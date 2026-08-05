/**
 * MemoryOptimizationSuggestions.js
 * Retail ERP Enterprise — Memory & Resource Optimization Recommendations Panel
 */

"use strict";

export default class MemoryOptimizationSuggestions {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-logs-panel memory-optimization-suggestions";
    card.innerHTML = `
      <h3 style="margin:0; font-size:16px; font-weight:700; color:#1E293B; display:flex; align-items:center; gap:8px;">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        Memory & Resource Optimization Suggestions
      </h3>
      <div class="logs-list-wrapper mem-suggestions-list"></div>
    `;
    this.element = card;
    return card;
  }

  update(metrics, alerts = []) {
    if (!this.element) return;
    const wrapper = this.element.querySelector(".mem-suggestions-list");
    if (!wrapper) return;

    // Merge static schema suggestions with live threshold alerts
    const staticItems = (metrics.suggestions || []).map(s => ({ ...s, isAlert: false }));
    const alertItems = alerts.slice(0, 5).map(a => ({
      id: `alert-${a.timestamp}`,
      category: a.category,
      description: `${a.message}: ${a.value}`,
      isAlert: true
    }));

    const all = [...alertItems, ...staticItems];

    const palette = {
      cache:    { bg: "rgba(37,99,235,0.06)",   border: "rgba(37,99,235,0.12)",   tag: "var(--primary-600)" },
      gc:       { bg: "rgba(16,185,129,0.06)",   border: "rgba(16,185,129,0.12)",  tag: "var(--success-500)" },
      leak:     { bg: "rgba(239,68,68,0.06)",    border: "rgba(239,68,68,0.12)",   tag: "#dc2626" },
      ram:      { bg: "rgba(245,158,11,0.06)",   border: "rgba(245,158,11,0.12)",  tag: "var(--warning-500)" },
      heap:     { bg: "rgba(245,158,11,0.06)",   border: "rgba(245,158,11,0.12)",  tag: "var(--warning-500)" },
      resource: { bg: "rgba(139,92,246,0.06)",   border: "rgba(139,92,246,0.12)", tag: "#7c3aed" }
    };

    if (all.length === 0) {
      wrapper.innerHTML = `<div style="color:var(--neutral-500);font-size:13px;text-align:center;padding:16px;">Memory and resources are within optimal bounds.</div>`;
    } else {
      wrapper.innerHTML = all.map(item => {
        const c = palette[item.category] || palette.cache;
        const label = item.isAlert ? "Alert" : "Recommendation";
        return `
          <div class="log-item-row" style="background-color:${c.bg};border:1px solid ${c.border};">
            <span class="log-time" style="color:${c.tag};font-weight:700;white-space:nowrap;">[${item.category.toUpperCase()}]</span>
            <span class="log-message" style="margin-left:8px;">${item.description}</span>
            <span class="log-value-badge" style="background-color:${c.bg};color:${c.tag};border:1px solid ${c.border};">${label}</span>
          </div>`;
      }).join("");
    }
  }
}
