/**
 * RendererMetrics.js
 * Retail ERP Enterprise — Renderer Metrics Widget
 */

"use strict";

export default class RendererMetrics {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card renderer-metrics-card";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
          Renderer Metrics
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Normal</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Frame Rate (FPS)</span>
          <span class="stat-value val-fps">-- FPS</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Render Time</span>
          <span class="stat-value val-render-time">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Paint Time</span>
          <span class="stat-value val-paint-time">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Component Count</span>
          <span class="stat-value val-component-count">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Re-render Count</span>
          <span class="stat-value val-re-render">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">UI Responsiveness</span>
          <span class="stat-value val-responsiveness">--</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element || !metrics || !metrics.renderer) return;
    const r = metrics.renderer;

    this.element.querySelector(".val-fps").textContent = `${r.fps} FPS`;
    this.element.querySelector(".val-render-time").textContent = `${r.renderTimeMs} ms`;
    this.element.querySelector(".val-paint-time").textContent = `${r.paintTimeMs} ms`;
    this.element.querySelector(".val-component-count").textContent = r.componentCount;
    this.element.querySelector(".val-re-render").textContent = r.reRenderCount;
    this.element.querySelector(".val-responsiveness").textContent = r.uiResponsiveness;

    const badge = this.element.querySelector(".status-badge");
    if (r.fps < 55) {
      badge.textContent = "Warning";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Normal";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
