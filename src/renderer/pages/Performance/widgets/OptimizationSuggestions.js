/**
 * OptimizationSuggestions.js
 * Retail ERP Enterprise — Optimization Suggestions Panel
 */

"use strict";

export default class OptimizationSuggestions {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-logs-panel optimization-suggestions-panel";

    card.innerHTML = `
      <h3 style="margin:0; font-size:16px; font-weight:700; color:#1E293B; display:flex; align-items:center; gap:8px;">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        Memoization & Split Suggestions
      </h3>
      <div class="logs-list-wrapper suggestions-list-wrapper">
        <!-- populated dynamically -->
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const wrapper = this.element.querySelector(".suggestions-list-wrapper");
    if (!wrapper) return;

    if (!metrics.suggestions || metrics.suggestions.length === 0) {
      wrapper.innerHTML = `<div style="color:var(--neutral-500); font-size:13px; text-align:center; padding:16px;">All renderer elements optimized. No suggestion points.</div>`;
    } else {
      wrapper.innerHTML = metrics.suggestions.map(sug => `
        <div class="log-item-row" style="background-color: rgba(37, 99, 235, 0.05); border: 1px solid rgba(37, 99, 235, 0.1);">
          <span class="log-time" style="color: var(--primary-600); font-weight:700;">[${sug.category.toUpperCase()}]</span>
          <span class="log-message" style="margin-left: 8px;">${sug.description}</span>
          <span class="log-value-badge" style="background-color: rgba(37, 99, 235, 0.1); color: var(--primary-600);">Recommendation</span>
        </div>
      `).join("");
    }
  }
}
