/**
 * APIModulesPanel.js
 * Retail ERP Enterprise — API Explorer / Modules Panel
 *
 * Provides an interactive endpoint browser with module filtering, path display,
 * parameter details, and mock JSON response viewer.
 */

"use strict";

export default class APIModulesPanel {
  /**
   * @param {Object}   options
   * @param {Array}    options.endpoints  - All registered API endpoints.
   * @param {Array}    options.modules    - List of module names.
   * @param {Function} options.getSample  - Callback(endpointId, language) => code string.
   */
  constructor(options = {}) {
    this.endpoints      = options.endpoints || [];
    this.modules        = options.modules   || [];
    this.getSample      = options.getSample || null;
    this.selectedModule = this.modules[0] || null;
    this.selectedEndpoint = null;
    this.selectedLanguage = "curl";
    this.element = null;
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "api-modules-panel";
    this.element = panel;

    this._buildLayout();
    return panel;
  }

  _buildLayout() {
    const panel = this.element;
    panel.innerHTML = "";

    // Module filter chips
    const moduleRow = document.createElement("div");
    moduleRow.className = "module-filter-row";
    moduleRow.innerHTML = `
      <span class="filter-label font-semibold text-muted">Module:</span>
      ${this.modules.map(m => `
        <button class="module-chip ${m === this.selectedModule ? "active" : ""}" data-module="${m}">${m}</button>
      `).join("")}
    `;
    moduleRow.querySelectorAll(".module-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        this.selectedModule = btn.getAttribute("data-module");
        this.selectedEndpoint = null;
        this._buildLayout();
      });
    });
    panel.appendChild(moduleRow);

    // Explorer split layout
    const explorer = document.createElement("div");
    explorer.className = "api-explorer-layout";

    // Left: endpoint list
    const leftCol = document.createElement("div");
    leftCol.className = "endpoint-list-col";

    const filtered = this.selectedModule
      ? this.endpoints.filter(ep => ep.module === this.selectedModule)
      : this.endpoints;

    filtered.forEach(ep => {
      const item = document.createElement("div");
      item.className = `endpoint-list-item ${this.selectedEndpoint?.id === ep.id ? "selected" : ""}`;
      item.innerHTML = `
        <span class="method-pill method-${ep.method.toLowerCase()}">${ep.method}</span>
        <span class="endpoint-path font-mono text-xs">${ep.path}</span>
      `;
      item.addEventListener("click", () => {
        this.selectedEndpoint = ep;
        this._buildLayout();
      });
      leftCol.appendChild(item);
    });

    // Right: endpoint details
    const rightCol = document.createElement("div");
    rightCol.className = "endpoint-detail-col";

    if (!this.selectedEndpoint) {
      rightCol.innerHTML = `
        <div class="empty-explorer-state">
          <p class="text-muted">← Select an endpoint from the list to explore its definition.</p>
        </div>
      `;
    } else {
      const ep = this.selectedEndpoint;

      rightCol.innerHTML = `
        <div class="endpoint-detail-header">
          <span class="method-pill method-${ep.method.toLowerCase()} lg">${ep.method}</span>
          <code class="endpoint-detail-path font-mono">${ep.path}</code>
          ${ep.auth ? `<span class="auth-required-badge">🔒 Auth Required</span>` : ""}
        </div>
        <p class="endpoint-description text-secondary mt-2">${ep.description}</p>

        ${ep.scopes?.length ? `
          <div class="detail-section mt-4">
            <h4 class="detail-section-title">Required Scopes</h4>
            <div class="scopes-row">
              ${ep.scopes.map(s => `<span class="scope-tag font-mono">${s}</span>`).join("")}
            </div>
          </div>
        ` : ""}

        ${ep.params?.length ? `
          <div class="detail-section mt-4">
            <h4 class="detail-section-title">Parameters</h4>
            <table class="params-table">
              <thead>
                <tr>
                  <th>Name</th><th>In</th><th>Required</th><th>Description</th>
                </tr>
              </thead>
              <tbody>
                ${ep.params.map(p => `
                  <tr>
                    <td class="font-mono font-semibold">${p.name}</td>
                    <td><span class="param-in-badge">${p.type}</span></td>
                    <td>${p.required ? `<span class="required-yes">Yes</span>` : `<span class="required-no">No</span>`}</td>
                    <td class="text-secondary text-xs">${p.description}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : ""}

        <div class="detail-section mt-4">
          <h4 class="detail-section-title">Mock Response (${ep.mockResponse.status})</h4>
          <pre class="mock-response-block"><code>${JSON.stringify(ep.mockResponse.body, null, 2)}</code></pre>
        </div>

        <div class="detail-section mt-4">
          <div class="code-sample-header">
            <h4 class="detail-section-title">Code Sample</h4>
            <div class="language-switcher">
              ${["curl", "javascript", "python"].map(lang => `
                <button class="lang-btn ${this.selectedLanguage === lang ? "active" : ""}" data-lang="${lang}">${lang}</button>
              `).join("")}
            </div>
          </div>
          <pre class="code-sample-block" id="code-sample-display"><code class="text-xs">Loading...</code></pre>
        </div>
      `;

      // Language switcher events
      rightCol.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          this.selectedLanguage = btn.getAttribute("data-lang");
          rightCol.querySelectorAll(".lang-btn").forEach(b => b.classList.toggle("active", b === btn));
          await this._loadSample(ep.id, rightCol);
        });
      });

      // Load initial sample
      setTimeout(() => this._loadSample(ep.id, rightCol), 0);
    }

    explorer.appendChild(leftCol);
    explorer.appendChild(rightCol);
    panel.appendChild(explorer);
  }

  async _loadSample(endpointId, container) {
    const block = container.querySelector("#code-sample-display code");
    if (!block) return;
    try {
      const code = this.getSample
        ? await this.getSample(endpointId, this.selectedLanguage)
        : "// Sample unavailable in this context.";
      block.textContent = code;
    } catch (err) {
      block.textContent = `// Error loading sample: ${err.message}`;
    }
  }
}
