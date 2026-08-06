/**
 * APIOverviewPanel.js
 * Retail ERP Enterprise — API Platform Overview Dashboard Panel
 *
 * Displays health metrics, endpoint method distribution, active keys count,
 * and webhooks delivery stats summary.
 */

"use strict";

export default class APIOverviewPanel {
  /**
   * @param {Object} options
   * @param {Object} options.diagnostics - Platform diagnostic summary from main process.
   */
  constructor(options = {}) {
    this.diagnostics = options.diagnostics || {};
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "api-overview-panel";

    const d = this.diagnostics;

    panel.innerHTML = `
      <div class="api-overview-header">
        <div class="api-status-badge ${d.status === "operational" ? "status-operational" : "status-degraded"}">
          <span class="status-dot"></span>
          <span>${d.status === "operational" ? "All Systems Operational" : "Service Degraded"}</span>
        </div>
        <p class="api-version-tag font-mono">API Version: <strong>${d.version || "v1"}</strong></p>
      </div>

      <!-- Summary KPI Cards -->
      <div class="api-kpi-grid">
        <div class="api-kpi-card">
          <span class="kpi-icon">🔗</span>
          <div class="kpi-content">
            <p class="kpi-label">Total Endpoints</p>
            <h2 class="kpi-value font-mono">${d.totalEndpoints || 0}</h2>
            <p class="kpi-sub text-muted">Across ${d.totalModules || 0} modules</p>
          </div>
        </div>
        <div class="api-kpi-card">
          <span class="kpi-icon">🔑</span>
          <div class="kpi-content">
            <p class="kpi-label">Active API Keys</p>
            <h2 class="kpi-value font-mono">${d.activeAPIKeys || 0}</h2>
            <p class="kpi-sub text-muted">${d.revokedAPIKeys || 0} revoked</p>
          </div>
        </div>
        <div class="api-kpi-card">
          <span class="kpi-icon">🪝</span>
          <div class="kpi-content">
            <p class="kpi-label">Active Webhooks</p>
            <h2 class="kpi-value font-mono">${d.activeWebhooks || 0}</h2>
            <p class="kpi-sub text-muted">${(d.totalWebhookDeliveries || 0).toLocaleString()} deliveries</p>
          </div>
        </div>
        <div class="api-kpi-card">
          <span class="kpi-icon">📦</span>
          <div class="kpi-content">
            <p class="kpi-label">API Modules</p>
            <h2 class="kpi-value font-mono">${d.totalModules || 0}</h2>
            <p class="kpi-sub text-muted">${(d.modules || []).join(", ")}</p>
          </div>
        </div>
      </div>

      <!-- Method Distribution -->
      <div class="api-method-dist-section">
        <h3 class="section-subtitle">Endpoint Method Distribution</h3>
        <div class="method-dist-grid">
          ${Object.entries(d.endpointsByMethod || {}).map(([method, count]) => `
            <div class="method-dist-card method-${method.toLowerCase()}">
              <span class="method-badge">${method}</span>
              <span class="method-count font-mono font-bold">${count}</span>
              <span class="method-label text-muted">endpoints</span>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Base URL Reference -->
      <div class="api-baseurl-section">
        <h3 class="section-subtitle">Base URL Reference</h3>
        <div class="baseurl-cards">
          <div class="baseurl-card">
            <span class="env-badge env-local">LOCAL</span>
            <code class="font-mono">http://localhost:4200/api/v1</code>
          </div>
          <div class="baseurl-card">
            <span class="env-badge env-prod">PRODUCTION</span>
            <code class="font-mono">https://api.retail-erp.internal/v1</code>
          </div>
        </div>
        <div class="auth-note mt-3">
          <span class="info-icon">ℹ️</span>
          All endpoints require the <code class="font-mono">X-ERP-API-Key</code> header for authentication.
        </div>
      </div>
    `;

    return panel;
  }
}
