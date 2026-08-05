/**
 * StartupMetrics.js
 * Retail ERP Enterprise — Startup Metrics Widget
 */

"use strict";

export default class StartupMetrics {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card startup-metrics-card";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-14h-9l1-8z"></path></svg>
          Startup Metrics
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Normal</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Total Startup Time</span>
          <span class="stat-value val-total-time">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Splash Screen Duration</span>
          <span class="stat-value val-splash">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Module Loading</span>
          <span class="stat-value val-modules">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Dependency Loading</span>
          <span class="stat-value val-dependencies">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Service Initialization</span>
          <span class="stat-value val-services">-- ms</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const s = metrics.startup;

    this.element.querySelector(".val-total-time").textContent = `${s.startupTimeMs} ms`;
    this.element.querySelector(".val-splash").textContent = `${s.splashDurationMs} ms`;
    this.element.querySelector(".val-modules").textContent = `${s.moduleLoadTimeMs} ms`;
    this.element.querySelector(".val-dependencies").textContent = `${s.dependencyLoadTimeMs} ms`;
    this.element.querySelector(".val-services").textContent = `${s.serviceInitTimeMs} ms`;
  }
}
