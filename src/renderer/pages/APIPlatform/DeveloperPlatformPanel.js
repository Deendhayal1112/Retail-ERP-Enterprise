/**
 * DeveloperPlatformPanel.js
 * Retail ERP Enterprise — Developer Platform Panel
 *
 * Provides webhook subscriptions management, OpenAPI spec viewer,
 * SDK quickstart guide, and test delivery simulation controls.
 */

"use strict";

export default class DeveloperPlatformPanel {
  /**
   * @param {Object}   options
   * @param {Array}    options.webhooks          - Active webhook subscriptions.
   * @param {Array}    options.webhookEvents     - Available event types.
   * @param {Array}    options.deliveryLogs      - Webhook delivery history.
   * @param {Object}   options.openAPISpec       - Full OpenAPI 3.1 spec object.
   * @param {Object}   options.sdkInfo           - SDK guide info.
   * @param {Function} options.onRegisterWebhook - Callback({ label, url, events }) => Promise
   * @param {Function} options.onDeleteWebhook   - Callback(id) => Promise
   * @param {Function} options.onSimulate        - Callback({ id, event }) => Promise
   */
  constructor(options = {}) {
    this.webhooks         = options.webhooks         || [];
    this.webhookEvents    = options.webhookEvents    || [];
    this.deliveryLogs     = options.deliveryLogs     || [];
    this.openAPISpec      = options.openAPISpec      || {};
    this.sdkInfo          = options.sdkInfo          || {};
    this.onRegisterWebhook = options.onRegisterWebhook || null;
    this.onDeleteWebhook   = options.onDeleteWebhook   || null;
    this.onSimulate        = options.onSimulate        || null;
    this.devActiveTab      = "webhooks";
    this.element           = null;
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "developer-platform-panel";
    this.element = panel;
    this._buildLayout();
    return panel;
  }

  _buildLayout() {
    const panel = this.element;
    panel.innerHTML = "";

    // Inner tab toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "dev-inner-tab-toolbar";
    const devTabs = [
      { key: "webhooks", label: "Webhooks" },
      { key: "openapi",  label: "OpenAPI Spec" },
      { key: "sdk",      label: "SDK & Quickstart" }
    ];
    devTabs.forEach(t => {
      const btn = document.createElement("button");
      btn.className = `dev-inner-tab-btn ${this.devActiveTab === t.key ? "active" : ""}`;
      btn.textContent = t.label;
      btn.addEventListener("click", () => {
        this.devActiveTab = t.key;
        this._buildLayout();
      });
      toolbar.appendChild(btn);
    });
    panel.appendChild(toolbar);

    if (this.devActiveTab === "webhooks") {
      panel.appendChild(this._buildWebhooksTab());
    } else if (this.devActiveTab === "openapi") {
      panel.appendChild(this._buildOpenAPITab());
    } else if (this.devActiveTab === "sdk") {
      panel.appendChild(this._buildSDKTab());
    }
  }

  _buildWebhooksTab() {
    const wrap = document.createElement("div");
    wrap.className = "webhooks-tab-content";

    // Split: list + form
    const grid = document.createElement("div");
    grid.className = "webhooks-layout-grid";

    // Left: subscriptions list
    const leftCol = document.createElement("div");
    leftCol.className = "webhooks-list-col";
    leftCol.innerHTML = `<h3 class="section-subtitle">Active Webhook Subscriptions</h3>`;

    if (this.webhooks.length === 0) {
      leftCol.innerHTML += `<div class="empty-state-inner">No webhook subscriptions registered.</div>`;
    } else {
      this.webhooks.forEach(wh => {
        const card = document.createElement("div");
        card.className = `webhook-sub-card ${wh.status}`;
        card.innerHTML = `
          <div class="wh-card-header">
            <h4 class="wh-card-label font-semibold">${wh.label}</h4>
            <span class="wh-status-badge ${wh.status === "active" ? "badge-success" : "badge-warning"}">${wh.status.toUpperCase()}</span>
          </div>
          <p class="wh-url font-mono text-xs text-secondary">${wh.url}</p>
          <div class="wh-events-list">
            ${wh.events.map(e => `<span class="wh-event-chip font-mono">${e}</span>`).join("")}
          </div>
          <div class="wh-stats mt-2">
            <span class="text-xs text-muted">✅ ${wh.deliveredCount.toLocaleString()} delivered</span>
            <span class="text-xs text-danger ml-3">❌ ${wh.failedCount} failed</span>
          </div>
          <div class="wh-actions mt-3">
            <select class="sim-event-select text-xs">
              ${wh.events.map(e => `<option value="${e}">${e}</option>`).join("")}
            </select>
            <button class="btn-simulate-webhook text-xs" data-id="${wh.id}">▶ Test</button>
            <button class="btn-delete-webhook text-xs" data-id="${wh.id}">🗑 Delete</button>
          </div>
        `;

        card.querySelector(".btn-simulate-webhook").addEventListener("click", async () => {
          const evtType = card.querySelector(".sim-event-select").value;
          if (this.onSimulate) {
            const res = await this.onSimulate({ id: wh.id, event: evtType });
            if (res?.success) {
              window.Toast?.show(`Test delivery simulated: ${evtType}`, "success", 3000);
            }
          }
        });

        card.querySelector(".btn-delete-webhook").addEventListener("click", async () => {
          if (confirm(`Delete webhook subscription: ${wh.label}?`)) {
            if (this.onDeleteWebhook) await this.onDeleteWebhook(wh.id);
          }
        });

        leftCol.appendChild(card);
      });
    }

    // Right: Register form
    const rightCol = document.createElement("div");
    rightCol.className = "webhooks-form-col";
    rightCol.innerHTML = `
      <h3 class="section-subtitle">Register New Webhook</h3>
      <form class="register-webhook-form">
        <div class="form-field">
          <label>Webhook Label</label>
          <input type="text" name="label" placeholder="e.g. Logistics Platform Events" required />
        </div>
        <div class="form-field mt-3">
          <label>Target URL</label>
          <input type="url" name="url" placeholder="https://your-endpoint.example.com/hooks" required />
        </div>
        <div class="form-field mt-3">
          <label>Subscribe to Events</label>
          <div class="events-checkbox-grid">
            ${this.webhookEvents.map(we => `
              <label class="event-checkbox-label">
                <input type="checkbox" name="event" value="${we.event}" />
                <div>
                  <span class="event-name font-mono font-semibold">${we.event}</span>
                  <span class="event-module text-xs text-muted"> — ${we.module}</span>
                </div>
              </label>
            `).join("")}
          </div>
        </div>
        <button type="submit" class="btn-register-webhook">Register Webhook</button>
      </form>
    `;

    const form = rightCol.querySelector(".register-webhook-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const label = form.elements["label"].value.trim();
      const url   = form.elements["url"].value.trim();
      const events = [...form.querySelectorAll("input[name='event']:checked")].map(cb => cb.value);

      if (events.length === 0) {
        window.Toast?.show("Please subscribe to at least one event.", "danger", 3000);
        return;
      }
      if (this.onRegisterWebhook) {
        await this.onRegisterWebhook({ label, url, events });
      }
    });

    grid.appendChild(leftCol);
    grid.appendChild(rightCol);
    wrap.appendChild(grid);

    // Delivery logs
    if (this.deliveryLogs.length > 0) {
      const logsSection = document.createElement("div");
      logsSection.className = "delivery-logs-section mt-5";
      logsSection.innerHTML = `
        <h3 class="section-subtitle">Recent Test Delivery Logs</h3>
        <table class="delivery-logs-table">
          <thead>
            <tr><th>Timestamp</th><th>Event</th><th>Status</th><th>Latency</th><th>URL</th></tr>
          </thead>
          <tbody>
            ${this.deliveryLogs.slice(0, 10).map(log => `
              <tr>
                <td class="font-mono text-xs">${new Date(log.timestamp).toLocaleString("en-IN")}</td>
                <td class="font-mono text-xs font-semibold">${log.event}</td>
                <td><span class="badge-success text-xs">${log.status}</span></td>
                <td class="font-mono text-xs">${log.latencyMs}ms</td>
                <td class="text-xs text-secondary">${log.url}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
      wrap.appendChild(logsSection);
    }

    return wrap;
  }

  _buildOpenAPITab() {
    const wrap = document.createElement("div");
    wrap.className = "openapi-tab-content";

    const specJSON = JSON.stringify(this.openAPISpec, null, 2);

    wrap.innerHTML = `
      <div class="openapi-header-row">
        <h3 class="section-subtitle">OpenAPI 3.1 Specification</h3>
        <button class="btn-copy-spec">📋 Copy JSON</button>
      </div>
      <p class="text-secondary text-xs mb-3">
        This specification can be imported directly into Postman, Insomnia, or Swagger UI.
      </p>
      <pre class="openapi-spec-block"><code class="text-xs">${specJSON}</code></pre>
    `;

    wrap.querySelector(".btn-copy-spec").addEventListener("click", () => {
      navigator.clipboard?.writeText(specJSON).then(() => {
        window.Toast?.show("OpenAPI spec copied to clipboard.", "success", 2500);
      }).catch(() => {
        window.Toast?.show("Clipboard access unavailable in this context.", "danger", 2500);
      });
    });

    return wrap;
  }

  _buildSDKTab() {
    const sdk = this.sdkInfo;
    const wrap = document.createElement("div");
    wrap.className = "sdk-tab-content";

    wrap.innerHTML = `
      <div class="sdk-intro-card">
        <h3 class="sdk-title font-bold">${sdk.name || "Enterprise SDK"}</h3>
        <div class="sdk-meta">
          <span>Version: <strong>${sdk.version}</strong></span>
          <span>Language: <strong>${sdk.language}</strong></span>
        </div>
        <div class="sdk-install-block mt-3">
          <p class="sdk-install-label text-muted text-xs">Install via npm:</p>
          <pre class="sdk-command-block"><code class="font-mono">${sdk.installCommand || ""}</code></pre>
          <button class="btn-copy-install">📋 Copy</button>
        </div>
        <a href="${sdk.repositoryUrl}" class="sdk-repo-link" target="_blank">View Repository →</a>
      </div>

      <div class="sdk-quickstart-card mt-5">
        <h4 class="section-subtitle">Quickstart Example</h4>
        <pre class="sdk-quickstart-block"><code class="font-mono text-xs">${sdk.quickstart || ""}</code></pre>
        <button class="btn-copy-quickstart">📋 Copy Quickstart</button>
      </div>
    `;

    wrap.querySelector(".btn-copy-install").addEventListener("click", () => {
      navigator.clipboard?.writeText(sdk.installCommand || "").then(() => {
        window.Toast?.show("Install command copied.", "success", 2500);
      });
    });

    wrap.querySelector(".btn-copy-quickstart").addEventListener("click", () => {
      navigator.clipboard?.writeText(sdk.quickstart || "").then(() => {
        window.Toast?.show("Quickstart code copied.", "success", 2500);
      });
    });

    return wrap;
  }
}
