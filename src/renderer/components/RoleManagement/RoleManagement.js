/**
 * RoleManagement.js
 * Retail ERP Enterprise — Roles & Permissions (RBAC) Management Module Component
 *
 * Implements:
 * - RoleManagement     (Master container mapping sidebars, toolbars and panels)
 * - RoleList           (Left sidebar column displaying default system role tags)
 * - RoleDetails        (Right sidebar listing actions: duplicate, assign users)
 * - PermissionMatrix   (Central checklist of CRUD permission triggers)
 * - PermissionCategory (Header row category title wrapper)
 * - PermissionToggle   (Checkbox wrapper helper with change handlers)
 * - RoleToolbar        (Top bar with Create Role actions)
 * - AssignUsersDialog  (Modal list assigning operators to this role)
 * - CreateRoleDialog   (Modal input field creating a new custom role)
 */

"use strict";

export class PermissionToggle {
  /**
   * @param {Object}   options
   * @param {string}   options.label    Checkbox text label
   * @param {boolean}  options.checked  Initial checked flag state
   * @param {Function} options.onChange Callback on check update
   */
  constructor(options = {}) {
    this.label    = options.label    || "Action";
    this.checked  = options.checked !== undefined ? options.checked : false;
    this.onChange = options.onChange || null;
  }

  render() {
    const labelEl = document.createElement("label");
    labelEl.className = "permission-checkbox-label";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "permission-checkbox-input";
    input.checked = this.checked;

    input.addEventListener("change", (e) => {
      this.checked = e.target.checked;
      if (this.onChange) this.onChange(this.checked);
    });

    labelEl.appendChild(input);
    labelEl.appendChild(document.createTextNode(this.label));

    return labelEl;
  }
}

export class PermissionCategory {
  /**
   * @param {Object}   options
   * @param {string}   options.name     Section title name
   * @param {Object}   options.state    Permissions state dictionary
   * @param {Function} options.onUpdate Callback on values change
   */
  constructor(options = {}) {
    this.name     = options.name     || "Category";
    this.state    = options.state    || { read: false, create: false, update: false, delete: false };
    this.onUpdate = options.onUpdate || null;
  }

  render() {
    const block = document.createElement("div");
    block.className = "permission-category-block";

    const header = document.createElement("header");
    header.className = "permission-category-header";
    header.textContent = this.name;
    block.appendChild(header);

    const row = document.createElement("div");
    row.className = "permission-toggles-row";

    const verbs = ["Read", "Create", "Update", "Delete"];
    verbs.forEach(v => {
      const key = v.toLowerCase();
      const toggle = new PermissionToggle({
        label: v,
        checked: this.state[key] || false,
        onChange: (checkedVal) => {
          this.state[key] = checkedVal;
          console.log(`[Permission System] Mapped: ${this.name.toLowerCase()}:${key} = ${checkedVal}`);
          if (this.onUpdate) this.onUpdate(this.state);
        }
      });
      row.appendChild(toggle.render());
    });

    block.appendChild(row);
    return block;
  }
}

export class PermissionMatrix {
  /**
   * @param {Object}   options
   * @param {Object}   options.permissions Permission sets map
   * @param {Function} options.onChange    Callback on changes
   */
  constructor(options = {}) {
    this.permissions = options.permissions || {};
    this.onChange    = options.onChange    || null;

    this.categories = ["Dashboard", "Products", "Inventory", "Customers", "Sales", "Purchases", "Reports", "Settings"];
  }

  render() {
    const card = document.createElement("div");
    card.className = "permission-matrix-card";

    this.categories.forEach(cat => {
      const key = cat.toLowerCase();
      if (!this.permissions[key]) {
        this.permissions[key] = { read: false, create: false, update: false, delete: false };
      }

      const psec = new PermissionCategory({
        name: cat,
        state: this.permissions[key],
        onUpdate: (newCategoryState) => {
          this.permissions[key] = newCategoryState;
          if (this.onChange) this.onChange(this.permissions);
        }
      });
      card.appendChild(psec.render());
    });

    return card;
  }
}

export class RoleList {
  /**
   * @param {Object}   options
   * @param {Object[]} options.roles        System roles datasets list
   * @param {string}   options.activeRole   Key of selected role
   * @param {Function} options.onSelectRole Callback when clicked
   */
  constructor(options = {}) {
    this.roles      = options.roles      || [];
    this.activeRole = options.activeRole || "administrator";
    this.onSelectRole = options.onSelectRole || null;
  }

  render() {
    const col = document.createElement("aside");
    col.className = "role-list-column";

    const header = document.createElement("header");
    header.className = "role-list-header";
    header.textContent = "System Roles";
    col.appendChild(header);

    const scroll = document.createElement("div");
    scroll.className = "role-list-scroll";

    this.roles.forEach(role => {
      const link = document.createElement("a");
      link.className = `role-item-link${role.key === this.activeRole ? " active" : ""}`;
      link.href = "#";

      link.innerHTML = `
        <span>${role.label}</span>
        <span class="role-user-count-badge">${role.usersCount}</span>
      `;

      link.addEventListener("click", (e) => {
        e.preventDefault();
        col.querySelectorAll(".role-item-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        this.activeRole = role.key;
        if (this.onSelectRole) this.onSelectRole(role.key);
      });

      scroll.appendChild(link);
    });

    col.appendChild(scroll);
    return col;
  }
}

export class RoleDetails {
  /**
   * @param {Object}   options
   * @param {Object}   options.role     Target role details data
   * @param {Function} options.onAction Callback triggers
   */
  constructor(options = {}) {
    this.role     = options.role     || {};
    this.onAction = options.onAction || null;
  }

  render() {
    const pane = document.createElement("aside");
    pane.className = "role-details-sidebar";

    pane.innerHTML = `
      <h5 class="role-details-title">${this.role.label || "System Role"}</h5>
      <p class="role-details-desc">${this.role.desc || "Define access policies variables for this scope."}</p>
      
      <div class="role-actions-list">
        <button class="role-action-btn action-users">👥 Assign Users to Role</button>
        <button class="role-action-btn action-clone">📋 Clone Permission Set</button>
        <button class="role-action-btn action-duplicate">📁 Duplicate Role</button>
        <button class="role-action-btn action-delete" style="color:var(--danger-600);">🗑️ Delete Role</button>
      </div>
    `;

    pane.querySelector(".action-users").addEventListener("click", () => {
      if (this.onAction) this.onAction("assign_users", this.role);
    });
    pane.querySelector(".action-clone").addEventListener("click", () => {
      if (this.onAction) this.onAction("clone_perms", this.role);
    });
    pane.querySelector(".action-duplicate").addEventListener("click", () => {
      if (this.onAction) this.onAction("duplicate_role", this.role);
    });
    pane.querySelector(".action-delete").addEventListener("click", () => {
      if (this.onAction) this.onAction("delete_role", this.role);
    });

    return pane;
  }
}

export class RoleToolbar {
  /**
   * @param {Object}   options
   * @param {Function} options.onCreateRole Trigger modal open
   * @param {Function} options.onSave       Trigger save modifications
   */
  constructor(options = {}) {
    this.onCreateRole = options.onCreateRole || null;
    this.onSave       = options.onSave       || null;
  }

  render() {
    const row = document.createElement("div");
    row.className = "permission-toolbar-row";

    row.innerHTML = `
      <span class="permission-toolbar-left">Access Matrix Controller</span>
    `;

    const actions = document.createElement("div");
    actions.className = "permission-toolbar-actions";

    const createBtn = document.createElement("button");
    createBtn.className = "role-btn primary";
    createBtn.textContent = "+ Create New Role";
    createBtn.addEventListener("click", () => {
      if (this.onCreateRole) this.onCreateRole();
    });
    actions.appendChild(createBtn);

    const saveBtn = document.createElement("button");
    saveBtn.className = "role-btn";
    saveBtn.textContent = "💾 Save Permissions";
    saveBtn.addEventListener("click", () => {
      console.log("[Role Management Actions] Dispatched save RBAC permissions values.");
      if (this.onSave) this.onSave();
    });
    actions.appendChild(saveBtn);

    row.appendChild(actions);
    return row;
  }
}

export class AssignUsersDialog {
  /**
   * @param {Object}   options
   * @param {Object}   options.role     Target role
   * @param {Function} options.onCancel Close callback
   */
  constructor(options = {}) {
    this.role     = options.role     || {};
    this.onCancel = options.onCancel || null;
  }

  render() {
    const overlay = document.createElement("div");
    overlay.className = "role-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "role-modal-dialog";

    modal.innerHTML = `
      <header class="role-modal-header">
        <h5 class="role-modal-title">Assign Users: ${this.role.label}</h5>
        <button class="role-action-btn close-modal-btn">✕</button>
      </header>
      <div class="role-modal-body">
        <p style="font-size:0.7rem; color:var(--text-muted);">Select operator logins to map to this role security context:</p>
        <label class="permission-checkbox-label"><input type="checkbox" checked /> System Administrator (admin)</label>
        <label class="permission-checkbox-label"><input type="checkbox" /> Alice Smith (alice)</label>
        <label class="permission-checkbox-label"><input type="checkbox" /> Bob Johnson (bob)</label>
      </div>
      <footer class="role-modal-footer">
        <button class="role-btn cancel-btn">Cancel</button>
        <button class="role-btn primary save-btn">Save Assignments</button>
      </footer>
    `;

    const close = () => {
      overlay.remove();
      if (this.onCancel) this.onCancel();
    };

    modal.querySelector(".close-modal-btn").addEventListener("click", close);
    modal.querySelector(".cancel-btn").addEventListener("click", close);
    modal.querySelector(".save-btn").addEventListener("click", () => {
      console.log("[Role assignments] Dispatched user updates.");
      overlay.remove();
    });

    overlay.appendChild(modal);
    return overlay;
  }
}

export class CreateRoleDialog {
  /**
   * @param {Object}   options
   * @param {Function} options.onSave   Save callback
   * @param {Function} options.onCancel Close callback
   */
  constructor(options = {}) {
    this.onSave   = options.onSave   || null;
    this.onCancel = options.onCancel || null;
  }

  render() {
    const overlay = document.createElement("div");
    overlay.className = "role-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "role-modal-dialog";

    modal.innerHTML = `
      <header class="role-modal-header">
        <h5 class="role-modal-title">Create Access Role</h5>
        <button class="role-action-btn close-modal-btn">✕</button>
      </header>
      <div class="role-modal-body">
        <div class="form-field-group">
          <label class="form-field-label">Role Label Name</label>
          <input type="text" class="profile-form-input val-label" placeholder="Super Manager" />
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Role Description</label>
          <input type="text" class="profile-form-input val-desc" placeholder="Scope details..." />
        </div>
      </div>
      <footer class="role-modal-footer">
        <button class="role-btn cancel-btn">Cancel</button>
        <button class="role-btn primary save-btn">Create Role</button>
      </footer>
    `;

    const close = () => {
      overlay.remove();
      if (this.onCancel) this.onCancel();
    };

    modal.querySelector(".close-modal-btn").addEventListener("click", close);
    modal.querySelector(".cancel-btn").addEventListener("click", close);
    modal.querySelector(".save-btn").addEventListener("click", () => {
      const label = modal.querySelector(".val-label").value;
      const desc = modal.querySelector(".val-desc").value;

      if (!label) {
        alert("Role name is required.");
        return;
      }

      console.log(`[Role System] Mapped custom role: ${label}`);
      if (this.onSave) {
        this.onSave({
          key: label.toLowerCase().replace(/\s+/g, "_"),
          label: label,
          desc: desc,
          usersCount: 0,
          permissions: {}
        });
      }
      overlay.remove();
    });

    overlay.appendChild(modal);
    return overlay;
  }
}

// ─────────────────────────────────────────────────────
// MAIN ROLE MANAGEMENT COORDINATOR VIEW
// ─────────────────────────────────────────────────────

export default class RoleManagement {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
    this.activeRole = "administrator";

    // Default System Roles Dataset
    this.roles = [
      { key: "administrator",   label: "Administrator",   usersCount: 1, desc: "Unrestricted master operational capabilities", permissions: { dashboard: { read: true, create: true, update: true, delete: true } } },
      { key: "store_manager",   label: "Store Manager",   usersCount: 1, desc: "Operational capabilities over catalog, billing, and logs", permissions: { dashboard: { read: true, create: true, update: true, delete: false } } },
      { key: "cashier",         label: "Cashier",         usersCount: 1, desc: "POS Checkout billing dispatch permissions", permissions: { sales: { read: true, create: true, update: false, delete: false } } },
      { key: "inventory_staff", label: "Inventory Staff", usersCount: 1, desc: "Catalog maintenance, categorizer and products grids access", permissions: { inventory: { read: true, create: true, update: true, delete: false } } },
      { key: "accountant",      label: "Accountant",      usersCount: 0, desc: "Financial ledgers logs, reports access options", permissions: { reports: { read: true, create: false, update: false, delete: false } } },
      { key: "sales_executive", label: "Sales Executive", usersCount: 0, desc: "Manage billing, clients directories entries", permissions: { sales: { read: true, create: true, update: false, delete: false } } },
      { key: "viewer",          label: "Viewer",          usersCount: 0, desc: "Read only telemetry status panels dashboards", permissions: { dashboard: { read: true, create: false, update: false, delete: false } } }
    ];
  }

  _updateWorkspace() {
    if (!this.element) return;

    // Clear existing inner widgets
    const matrixContainer = this.element.querySelector(".permission-matrix-container");
    const sidebarContainer = this.element.querySelector(".role-details-container");

    const currentRole = this.roles.find(r => r.key === this.activeRole);
    if (!currentRole) return;

    if (matrixContainer) {
      matrixContainer.innerHTML = "";
      const matrix = new PermissionMatrix({
        permissions: currentRole.permissions,
        onChange: (newPermissions) => {
          currentRole.permissions = newPermissions;
        }
      });
      matrixContainer.appendChild(matrix.render());
    }

    if (sidebarContainer) {
      sidebarContainer.innerHTML = "";
      const details = new RoleDetails({
        role: currentRole,
        onAction: (actionKey, roleObj) => {
          console.log(`[RoleManagement Master Action] ${actionKey} on: ${roleObj.key}`);
          if (actionKey === "assign_users") {
            const dialog = new AssignUsersDialog({ role: roleObj });
            document.body.appendChild(dialog.render());
          } else if (actionKey === "delete_role") {
            this.roles = this.roles.filter(r => r.key !== roleObj.key);
            this.activeRole = this.roles[0]?.key || "";
            this._updateWorkspace();
          } else if (actionKey === "duplicate_role") {
            const duplicate = {
              ...roleObj,
              key: `${roleObj.key}_copy`,
              label: `${roleObj.label} Copy`,
              usersCount: 0,
              permissions: JSON.parse(JSON.stringify(roleObj.permissions))
            };
            this.roles.push(duplicate);
            this.activeRole = duplicate.key;
            this._updateWorkspace();
          }
        }
      });
      sidebarContainer.appendChild(details.render());
    }
  }

  render() {
    const container = document.createElement("div");
    container.className = "role-management-container";

    // A. Left Nav Sidebar
    const navCol = new RoleList({
      roles: this.roles,
      activeRole: this.activeRole,
      onSelectRole: (roleKey) => {
        this.activeRole = roleKey;
        this._updateWorkspace();
      }
    });
    container.appendChild(navCol.render());

    // B. Center Workspace: Toolbar + Permission Matrix
    const centerCol = document.createElement("div");
    centerCol.className = "permission-matrix-column";

    const toolbar = new RoleToolbar({
      onCreateRole: () => {
        const dialog = new CreateRoleDialog({
          onSave: (newRole) => {
            this.roles.push(newRole);
            this.activeRole = newRole.key;
            this._updateWorkspace();
          }
        });
        document.body.appendChild(dialog.render());
      },
      onSave: () => {
        console.log("[RoleManagement] Saving changes to cache.");
      }
    });
    centerCol.appendChild(toolbar.render());

    const matrixContainer = document.createElement("div");
    matrixContainer.className = "permission-matrix-container";
    centerCol.appendChild(matrixContainer);

    container.appendChild(centerCol);

    // C. Right Sidebar: Details Panel
    const sidebarContainer = document.createElement("div");
    sidebarContainer.className = "role-details-container";
    container.appendChild(sidebarContainer);

    this.element = container;

    this._updateWorkspace();

    return container;
  }
}
