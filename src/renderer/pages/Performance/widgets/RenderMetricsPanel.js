/**
 * RenderMetricsPanel.js
 * Retail ERP Enterprise — Rendering Performance Metrics Panel
 */

"use strict";

export default class RenderMetricsPanel {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card rendering-metrics-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          Rendering Performance
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Optimal</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Frame Rate (FPS)</span>
          <span class="stat-value val-fps">-- FPS</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Render Duration</span>
          <span class="stat-value val-render-dur">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Commit Time</span>
          <span class="stat-value val-commit">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Paint Time</span>
          <span class="stat-value val-paint">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Re-render Count</span>
          <span class="stat-value val-rerenders">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Hydration Status</span>
          <span class="stat-value val-hydration">--</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const r = metrics.rendering;

    this.element.querySelector(".val-fps").textContent = `${r.fps} FPS`;
    this.element.querySelector(".val-render-dur").textContent = `${r.renderDurationMs} ms`;
    this.element.querySelector(".val-commit").textContent = `${r.commitTimeMs} ms`;
    this.element.querySelector(".val-paint").textContent = `${r.paintTimeMs} ms`;
    this.element.querySelector(".val-rerenders").textContent = r.reRenderCount;
    this.element.querySelector(".val-hydration").textContent = r.hydrationStatus;

    const badge = this.element.querySelector(".status-badge");
    if (r.fps < 58) {
      badge.textContent = "Warning";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Optimal";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
