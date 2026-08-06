/**
 * APISecurityPanel.js
 * Retail ERP Enterprise — API Security & Keys Management Panel
 *
 * Provides API key creation form, listing with masked keys, revoke controls,
 * scope selectors, and full audit trail table.
 */

"use strict";

export default class APISecurityPanel {
  /**
   * @param {Object}   options
   * @param {Array}    options.apiKeys      - Existing API keys (masked).
   * @param {Array}    options.scopes       - All available permission scopes.
   * @param {Array}    options.auditLogs    - Audit trail entries.
   * @param {Function} options.onGenerate   - Callback({ label, scopes, createdBy }) => Promise<key>
   * @param {Function} options.onRevoke     - Callback(id) => Promise
   */
  constructor(options = {}) {
    this.apiKeys   = options.apiKeys   || [];
    this.scopes    = options.scopes    || [];
    this.auditLogs = options.auditLogs || [];
    this.onGenerate = options.onGenerate || null;
    this.onRevoke   = options.onRevoke   || null;
    this.newKeyResult = null; // Store newly created key once for display
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "api-security-panel";

    panel.appendChild(this._buildKeysSection());
    panel.appendChild(this._buildAuditSection());

    return panel;
  }

  _buildKeysSection() {
    const section = document.createElement("div");
    section.className = "security-keys-section";

    // Keys list + create form side-by-side
    const grid = document.createElement("div");
    grid.className = "keys-layout-grid";

    // Left: Keys table
    const leftCol = document.createElement("div");
    leftCol.className = "keys-list-col";
    leftCol.innerHTML = `<h3 class="section-subtitle">API Keys Registry</h3>`;

    if (this.newKeyResult) {
      const alert = document.createElement("div");
      alert.className = "new-key-alert";
      alert.innerHTML = `
        <p class="new-key-warning">⚠️ <strong>Copy this key now.</strong> It will not be shown again.</p>
        <div class="new-key-display font-mono">${this.newKeyResult}</div>
      `;
      leftCol.appendChild(alert);
    }

    const table = document.createElement("div");
    table.className = "keys-table-wrapper";
    table.innerHTML = `
      <table class="keys-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Masked Key</th>
            <th>Scopes</th>
            <th>Status</th>
            <th>Last Used</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.apiKeys.map(key => `
            <tr>
              <td class="font-semibold">${key.label}</td>
              <td class="font-mono text-xs">${key.key}</td>
              <td class="text-xs">
                <div class="scope-tags-mini">
                  ${key.scopes.slice(0, 2).map(s => `<span class="scope-mini">${s}</span>`).join("")}
                  ${key.scopes.length > 2 ? `<span class="scope-mini scope-more">+${key.scopes.length - 2}</span>` : ""}
                </div>
              </td>
              <td>
                <span class="key-status-badge ${key.status === "active" ? "badge-success" : "badge-danger"}">${key.status.toUpperCase()}</span>
              </td>
              <td class="text-xs text-muted">${key.lastUsed ? new Date(key.lastUsed).toLocaleString("en-IN") : "Never"}</td>
              <td class="text-right">
                ${key.status === "active"
                  ? `<button class="btn-revoke-key" data-id="${key.id}">Revoke</button>`
                  : `<span class="revoked-label text-muted text-xs">Revoked</span>`}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    table.querySelectorAll(".btn-revoke-key").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm(`Revoke this API key? This action cannot be undone.`)) {
          if (this.onRevoke) await this.onRevoke(id);
        }
      });
    });

    leftCol.appendChild(table);

    // Right: Create Key Form
    const rightCol = document.createElement("div");
    rightCol.className = "keys-form-col";
    rightCol.innerHTML = `
      <h3 class="section-subtitle">Generate New API Key</h3>
      <form class="generate-key-form">
        <div class="form-field">
          <label>Key Label</label>
          <input type="text" name="label" placeholder="e.g. Logistics Integration Key" required />
        </div>
        <div class="form-field mt-3">
          <label>Created By</label>
          <input type="text" name="createdBy" placeholder="Your name or service ID" required />
        </div>
        <div class="form-field mt-3">
          <label>Permission Scopes</label>
          <div class="scopes-checkbox-grid">
            ${this.scopes.map(scope => `
              <label class="scope-checkbox-label">
                <input type="checkbox" name="scope" value="${scope}" />
                <span class="scope-name font-mono">${scope}</span>
              </label>
            `).join("")}
          </div>
        </div>
        <button type="submit" class="btn-generate-key">Generate Key</button>
      </form>
    `;

    const form = rightCol.querySelector(".generate-key-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const label = form.elements["label"].value.trim();
      const createdBy = form.elements["createdBy"].value.trim();
      const scopes = [...form.querySelectorAll("input[name='scope']:checked")].map(cb => cb.value);

      if (scopes.length === 0) {
        window.Toast?.show("Please select at least one permission scope.", "danger", 3000);
        return;
      }

      if (this.onGenerate) {
        const result = await this.onGenerate({ label, scopes, createdBy });
        if (result?.success) {
          this.newKeyResult = result.key?.key;
          window.Toast?.show("API key generated. Copy it now — it will not be shown again.", "success", 5000);
        }
      }
    });

    grid.appendChild(leftCol);
    grid.appendChild(rightCol);
    section.appendChild(grid);
    return section;
  }

  _buildAuditSection() {
    const section = document.createElement("div");
    section.className = "audit-trail-section mt-6";

    section.innerHTML = `
      <h3 class="section-subtitle">Security Audit Trail</h3>
      <div class="audit-table-wrapper">
        <table class="audit-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Key ID</th>
              <th>Actor</th>
              <th>IP Address</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            ${this.auditLogs.slice(0, 20).map(log => `
              <tr>
                <td class="font-mono text-xs">${new Date(log.timestamp).toLocaleString("en-IN")}</td>
                <td>
                  <span class="audit-action-badge audit-${log.action.toLowerCase().replace("_", "-")}">${log.action}</span>
                </td>
                <td class="font-mono text-xs text-muted">${log.keyId}</td>
                <td class="font-semibold text-xs">${log.actor}</td>
                <td class="font-mono text-xs text-muted">${log.ip}</td>
                <td class="text-xs text-secondary">${log.detail || "—"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;

    return section;
  }
}
