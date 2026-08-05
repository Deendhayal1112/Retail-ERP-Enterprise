/**
 * CodeSplittingPanel.js
 * Retail ERP Enterprise — Chunk Counts and Route Boundary Diagnostics Panel
 */

"use strict";

export default class CodeSplittingPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card code-splitting-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
          Code Splitting
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Optimal</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row"><span class="stat-label">Route Chunks</span><span class="stat-value val-routes">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Component Chunks</span><span class="stat-value val-components">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Dynamic Imports</span><span class="stat-value val-dynamic">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Lazy Boundaries</span><span class="stat-value val-lazy">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Total Chunks</span><span class="stat-value val-chunks">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Avg Chunk Size</span><span class="stat-value val-avg-size">-- KB</span></div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const c = metrics.codeSplitting;

    this.element.querySelector(".val-routes").textContent = c.routeChunksCount;
    this.element.querySelector(".val-components").textContent = c.componentChunksCount;
    this.element.querySelector(".val-dynamic").textContent = c.dynamicImportsCount;
    this.element.querySelector(".val-lazy").textContent = c.lazyLoadedCount;
    this.element.querySelector(".val-chunks").textContent = c.totalChunkCount;
    this.element.querySelector(".val-avg-size").textContent = `${c.avgChunkSizeKb} KB`;

    const badge = this.element.querySelector(".status-badge");
    if (c.totalChunkCount > 30 || c.avgChunkSizeKb > 400) {
      badge.textContent = "Review";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Optimal";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
