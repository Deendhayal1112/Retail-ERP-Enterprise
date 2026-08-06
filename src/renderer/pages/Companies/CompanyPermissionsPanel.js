/**
 * CompanyPermissionsPanel.js
 * Retail ERP Enterprise — Multi-Company Permissions Matrix Panel
 */

"use strict";

export default class CompanyPermissionsPanel {
  /**
   * @param {Object}   options
   * @param {Array}    options.companies       List of companies.
   * @param {string}   options.activeCompanyId Active company ID.
   * @param {Function} options.onGetMatrix     IPC getter helper to load permissions matrix.
   * @param {Function} options.onSaveRolePerms Callback on update role scopes.
   */
  constructor(options = {}) {
    this.companies = options.companies || [];
    this.activeCompanyId = options.activeCompanyId || "";
    this.onGetMatrix = options.onGetMatrix || null;
    this.onSaveRolePerms = options.onSaveRolePerms || null;

    this.selectedCompanyId = this.activeCompanyId || this.companies[0]?.id || "";
    this.matrix = null;
  }

  async loadMatrix() {
    if (this.onGetMatrix && this.selectedCompanyId) {
      this.matrix = await this.onGetMatrix(this.selectedCompanyId);
    }
  }

  async render() {
    const panel = document.createElement("div");
    panel.className = "companies-permissions-panel";

    if (this.companies.length === 0) {
      panel.innerHTML = `<div class="empty-state">No registered companies available to view permissions matrix.</div>`;
      return panel;
    }

    await this.loadMatrix();

    // Select row
    const selectRow = document.createElement("div");
    selectRow.className = "company-select-row";
    selectRow.innerHTML = `
      <label class="select-label font-semibold">Select Company Matrix:</label>
      <select class="company-dropdown-select">
        ${this.companies.map(c => `<option value="${c.id}" ${c.id === this.selectedCompanyId ? "selected" : ""}>${c.name}</option>`).join("")}
      </select>
    `;
    panel.appendChild(selectRow);

    const matrixWrapper = document.createElement("div");
    matrixWrapper.className = "matrix-wrapper";
    panel.appendChild(matrixWrapper);

    const renderMatrixTable = () => {
      if (!this.matrix) {
        matrixWrapper.innerHTML = `<div class="empty-state-inner">Failed to load permissions matrix for ${this.selectedCompanyId}.</div>`;
        return;
      }

      const allPermissions = [
        { key: "database:read", label: "Read Database Rows" },
        { key: "database:write", label: "Write/Edit Database Rows" },
        { key: "settings:write", label: "Edit Company Settings" },
        { key: "users:manage", label: "Add/Remove Team Members" },
        { key: "reports:export", label: "Export Tax & Finance Reports" },
        { key: "pos:checkout", label: "Perform POS Cart Checkout" }
      ];

      const roles = ["admin", "manager", "employee"];

      matrixWrapper.innerHTML = `
        <div class="matrix-table-container">
          <table class="matrix-table">
            <thead>
              <tr>
                <th class="col-permission">Permission Scope</th>
                ${roles.map(r => `<th class="col-role text-center">${r.toUpperCase()}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${allPermissions.map(p => {
                return `
                  <tr>
                    <td class="col-permission">
                      <span class="scope-name">${p.label}</span>
                      <code class="font-mono scope-key">${p.key}</code>
                    </td>
                    ${roles.map(r => {
                      const hasPerm = this.matrix[r] && this.matrix[r].includes(p.key);
                      return `
                        <td class="col-role text-center">
                          <input type="checkbox" class="matrix-check" data-role="${r}" data-key="${p.key}" ${hasPerm ? "checked" : ""} />
                        </td>
                      `;
                    }).join("")}
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
          <button class="btn-save-matrix">Save Matrix Permissions</button>
        </div>
      `;

      // Save listener
      matrixWrapper.querySelector(".btn-save-matrix").addEventListener("click", () => {
        const checkedBoxes = matrixWrapper.querySelectorAll(".matrix-check");
        const updatedMatrix = { admin: [], manager: [], employee: [] };

        checkedBoxes.forEach(box => {
          if (box.checked) {
            const role = box.getAttribute("data-role");
            const key = box.getAttribute("data-key");
            updatedMatrix[role].push(key);
          }
        });

        roles.forEach(role => {
          if (this.onSaveRolePerms) {
            this.onSaveRolePerms(this.selectedCompanyId, role, updatedMatrix[role]);
          }
        });
      });
    };

    const dropdown = selectRow.querySelector(".company-dropdown-select");
    dropdown.addEventListener("change", async (e) => {
      this.selectedCompanyId = e.target.value;
      await this.loadMatrix();
      renderMatrixTable();
    });

    renderMatrixTable();

    return panel;
  }
}
