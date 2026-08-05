/**
 * UserManagement.js
 * Retail ERP Enterprise — User Management Module Component
 *
 * Implements:
 * - UserManagement    (Master component coordinating table, toolbar, search and sidebar details panel)
 * - UserTable         (Lists operator users, active roles and status indicators)
 * - UserToolbar       (Query filters, exports settings, and user add triggers)
 * - UserSearch        (Inline filtering textbox input)
 * - UserDetailsPanel  (Detailed info pane display for the active selected row)
 * - UserProfileCard   (Avatar + Name header block inside details sidebar)
 * - UserStatusBadge   (Pill status badge color-coded: active, locked, disabled)
 * - UserActionsMenu   (Context triggers list for Reset Password, Lock, Disable actions)
 * - AddUserDialog     (Dynamic popup modal appending user data)
 */

"use strict";

export class UserStatusBadge {
  /**
   * @param {Object} options
   * @param {string} options.status e.g. "Active" | "Locked" | "Disabled"
   */
  constructor(options = {}) {
    this.status = options.status || "Active";
  }

  render() {
    const pill = document.createElement("span");
    pill.className = `user-status-pill ${this.status.toLowerCase()}`;
    pill.textContent = this.status;
    return pill;
  }
}

export class UserProfileCard {
  /**
   * @param {Object} options
   * @param {string} options.fullName
   * @param {string} options.username
   */
  constructor(options = {}) {
    this.fullName = options.fullName || "User";
    this.username = options.username || "username";
  }

  render() {
    const head = document.createElement("header");
    head.className = "user-detail-profile-header";

    const initials = this.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

    head.innerHTML = `
      <div class="detail-avatar-large">${initials}</div>
      <div class="detail-profile-titles">
        <h5 class="detail-fullname">${this.fullName}</h5>
        <span class="detail-username-label">@${this.username}</span>
      </div>
    `;

    return head;
  }
}

export class UserActionsMenu {
  /**
   * @param {Object}   options
   * @param {Object}   options.user     Target user data metadata
   * @param {Function} options.onAction Callback on actions dispatch
   */
  constructor(options = {}) {
    this.user     = options.user     || {};
    this.onAction = options.onAction || null;
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "user-action-links-list";

    const actions = [
      { key: "edit",    label: "✏️ Edit User Details" },
      { key: "reset",   label: "🔑 Reset Password" },
      { key: "toggle",  label: this.user.status === "Active" ? "🔒 Lock Account" : "🔓 Unlock Account" },
      { key: "disable", label: this.user.status === "Disabled" ? "👁️ Enable User" : "🚫 Disable User" },
      { key: "delete",  label: "🗑️ Delete User Account" }
    ];

    actions.forEach(act => {
      const btn = document.createElement("button");
      btn.className = "user-action-link-btn";
      btn.textContent = act.label;
      btn.addEventListener("click", () => {
        console.log(`[User Action] Dispatched ${act.key} for user: ${this.user.username}`);
        if (this.onAction) this.onAction(act.key, this.user);
      });
      wrap.appendChild(btn);
    });

    return wrap;
  }
}

export class UserDetailsPanel {
  /**
   * @param {Object}   options
   * @param {Object}   options.selectedUser Target selected user row
   * @param {Function} options.onAction     Callback for action triggers
   */
  constructor(options = {}) {
    this.selectedUser = options.selectedUser || null;
    this.onAction     = options.onAction     || null;
  }

  render() {
    const pane = document.createElement("aside");
    pane.className = "user-details-sidebar";

    if (!this.selectedUser) {
      pane.innerHTML = `
        <div class="user-details-empty-state">
          <span>👥</span>
          <span>Select an operator user row from the table list to manage access credentials.</span>
        </div>
      `;
      return pane;
    }

    // 1. Profile Avatar Header
    const profileHeader = new UserProfileCard({
      fullName: this.selectedUser.fullName,
      username: this.selectedUser.username
    });
    pane.appendChild(profileHeader.render());

    // 2. Info rows: Basic Information
    const basicSec = document.createElement("div");
    basicSec.className = "user-detail-info-group";
    basicSec.innerHTML = `
      <h6 class="detail-group-title">Basic Information</h6>
      <div class="detail-info-row"><span>Email</span><span class="detail-info-val">${this.selectedUser.email}</span></div>
      <div class="detail-info-row"><span>Phone</span><span class="detail-info-val">${this.selectedUser.phone}</span></div>
    `;
    pane.appendChild(basicSec);

    // 3. Info rows: Organization Information
    const orgSec = document.createElement("div");
    orgSec.className = "user-detail-info-group";
    orgSec.innerHTML = `
      <h6 class="detail-group-title">Organization Details</h6>
      <div class="detail-info-row"><span>Department</span><span class="detail-info-val">${this.selectedUser.department}</span></div>
      <div class="detail-info-row"><span>Assigned Role</span><span class="detail-info-val">${this.selectedUser.role}</span></div>
    `;
    pane.appendChild(orgSec);

    // 4. Info rows: Account Information
    const accSec = document.createElement("div");
    accSec.className = "user-detail-info-group";
    accSec.innerHTML = `
      <h6 class="detail-group-title">Account Security Details</h6>
      <div class="detail-info-row"><span>Account Status</span><span class="detail-info-val" style="font-weight:700;">${this.selectedUser.status}</span></div>
      <div class="detail-info-row"><span>Last Session Login</span><span class="detail-info-val">${this.selectedUser.lastLogin}</span></div>
    `;
    pane.appendChild(accSec);

    // 5. Actions Link List
    const actionList = new UserActionsMenu({
      user: this.selectedUser,
      onAction: this.onAction
    });
    pane.appendChild(actionList.render());

    return pane;
  }
}

export class UserSearch {
  /**
   * @param {Object}   options
   * @param {Function} options.onSearch Filter query callback
   */
  constructor(options = {}) {
    this.onSearch = options.onSearch || null;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "user-search-box-wrap";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "user-search-input";
    input.placeholder = "Filter user catalog...";
    input.setAttribute("aria-label", "Search user profiles");

    input.addEventListener("input", (e) => {
      if (this.onSearch) this.onSearch(e.target.value.toLowerCase());
    });

    wrapper.appendChild(input);
    return wrapper;
  }
}

export class UserToolbar {
  /**
   * @param {Object}   options
   * @param {Function} options.onAddUser     Trigger modal open
   * @param {Function} options.onFilterQuery Text filter callback
   */
  constructor(options = {}) {
    this.onAddUser     = options.onAddUser     || null;
    this.onFilterQuery = options.onFilterQuery || null;
  }

  render() {
    const row = document.createElement("div");
    row.className = "user-toolbar-row";

    // Search Box
    const search = new UserSearch({ onSearch: this.onFilterQuery });
    row.appendChild(search.render());

    // Action buttons
    const actions = document.createElement("div");
    actions.className = "user-toolbar-actions";

    const addBtn = document.createElement("button");
    addBtn.className = "user-btn primary";
    addBtn.textContent = "+ Add User Profile";
    addBtn.addEventListener("click", () => {
      if (this.onAddUser) this.onAddUser();
    });
    actions.appendChild(addBtn);

    const refreshBtn = document.createElement("button");
    refreshBtn.className = "user-btn";
    refreshBtn.textContent = "↻ Refresh";
    refreshBtn.addEventListener("click", () => {
      console.log("[User Management Toolbar] Refreshing user dataset.");
    });
    actions.appendChild(refreshBtn);

    row.appendChild(actions);
    return row;
  }
}

export class UserTable {
  /**
   * @param {Object}   options
   * @param {Object[]} options.users        Display users catalog list
   * @param {Object}   options.selectedUser Active selected row item
   * @param {Function} options.onSelectRow   Row select event dispatcher
   */
  constructor(options = {}) {
    this.users        = options.users        || [];
    this.selectedUser = options.selectedUser || null;
    this.onSelectRow   = options.onSelectRow   || null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "user-table-card";

    const scrollWrap = document.createElement("div");
    scrollWrap.className = "user-table-scroll";

    const table = document.createElement("table");
    table.className = "user-data-table";

    // 1. Table Header
    table.innerHTML = `
      <thead>
        <tr>
          <th>Full Name / Username</th>
          <th>Email Address</th>
          <th>Phone Number</th>
          <th>Department</th>
          <th>Security Role</th>
          <th>Status</th>
          <th>Last Login Session</th>
        </tr>
      </thead>
    `;

    // 2. Table Body
    const tbody = document.createElement("tbody");

    this.users.forEach(user => {
      const tr = document.createElement("tr");
      if (this.selectedUser && this.selectedUser.username === user.username) {
        tr.className = "selected";
      }

      const initials = user.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

      tr.innerHTML = `
        <td class="user-table-profile-cell">
          <div class="user-table-avatar">${initials}</div>
          <div style="display:flex; flex-direction:column;">
            <span class="user-table-name">${user.fullName}</span>
            <span class="user-table-username">@${user.username}</span>
          </div>
        </td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.department}</td>
        <td style="font-weight:700;">${user.role}</td>
        <td></td>
        <td>${user.lastLogin}</td>
      `;

      // Append status pill dynamically
      const badge = new UserStatusBadge({ status: user.status });
      tr.querySelectorAll("td")[5].appendChild(badge.render());

      tr.addEventListener("click", () => {
        tbody.querySelectorAll("tr").forEach(row => row.classList.remove("selected"));
        tr.classList.add("selected");
        if (this.onSelectRow) this.onSelectRow(user);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    scrollWrap.appendChild(table);
    card.appendChild(scrollWrap);

    // 3. Pagination Footer
    const footer = document.createElement("footer");
    footer.className = "user-pagination-bar";
    footer.innerHTML = `
      <span>Showing <strong>${this.users.length}</strong> of <strong>${this.users.length}</strong> operator accounts</span>
      <div class="pagination-controls">
        <button class="user-btn" disabled>&lt; Previous</button>
        <button class="user-btn" disabled>Next &gt;</button>
      </div>
    `;
    card.appendChild(footer);

    return card;
  }
}

export class AddUserDialog {
  /**
   * @param {Object}   options
   * @param {Function} options.onSave   Save dispatch handler
   * @param {Function} options.onCancel Close callback
   */
  constructor(options = {}) {
    this.onSave   = options.onSave   || null;
    this.onCancel = options.onCancel || null;
  }

  render() {
    const overlay = document.createElement("div");
    overlay.className = "add-user-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "add-user-dialog";

    modal.innerHTML = `
      <header class="add-user-modal-header">
        <h5 class="add-user-modal-title">Create User Profile</h5>
        <button class="user-row-action-btn close-modal-btn">✕</button>
      </header>
      <div class="add-user-modal-body">
        <div class="form-field-group">
          <label class="form-field-label">Full Name</label>
          <input type="text" class="profile-form-input val-name" placeholder="John Doe" />
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Username</label>
          <input type="text" class="profile-form-input val-user" placeholder="johndoe" />
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Email Address</label>
          <input type="email" class="profile-form-input val-email" placeholder="johndoe@company.com" />
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Department</label>
          <select class="profile-form-select val-dept">
            <option value="Sales">Sales</option>
            <option value="Inventory">Inventory</option>
            <option value="Management">Management</option>
          </select>
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Security Role</label>
          <select class="profile-form-select val-role">
            <option value="Cashier">Cashier</option>
            <option value="Manager">Manager</option>
            <option value="Administrator">Administrator</option>
          </select>
        </div>
      </div>
      <footer class="add-user-modal-footer">
        <button class="user-btn cancel-btn">Cancel</button>
        <button class="user-btn primary save-btn">Save Profile</button>
      </footer>
    `;

    // Connect close triggers
    const close = () => {
      overlay.remove();
      if (this.onCancel) this.onCancel();
    };

    modal.querySelector(".close-modal-btn").addEventListener("click", close);
    modal.querySelector(".cancel-btn").addEventListener("click", close);

    modal.querySelector(".save-btn").addEventListener("click", () => {
      const name = modal.querySelector(".val-name").value;
      const user = modal.querySelector(".val-user").value;
      const email = modal.querySelector(".val-email").value;
      const dept = modal.querySelector(".val-dept").value;
      const role = modal.querySelector(".val-role").value;

      if (!name || !user || !email) {
        alert("Please fill in name, username, and email fields.");
        return;
      }

      console.log(`[User Creator] Mapped inputs: ${user}`);
      if (this.onSave) {
        this.onSave({
          fullName: name,
          username: user,
          email: email,
          phone: "+1 (555) 000-0000",
          department: dept,
          role: role,
          status: "Active",
          lastLogin: "Never"
        });
      }
      overlay.remove();
    });

    overlay.appendChild(modal);
    return overlay;
  }
}

// ─────────────────────────────────────────────────────
// MAIN USER MANAGEMENT PAGE VIEW COORDINATOR
// ─────────────────────────────────────────────────────

export default class UserManagement {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
    this.selectedUser = null;

    // Static default list of users
    this.users = [
      { fullName: "System Administrator", username: "admin",      email: "admin@retailerp.com",     phone: "+1 (555) 942-8201", department: "IT Support", role: "Administrator", status: "Active",   lastLogin: "2m ago" },
      { fullName: "Alice Smith",          username: "alice",      email: "alice.s@retailerp.com",   phone: "+1 (555) 902-8501", department: "Sales",      role: "Manager",       status: "Active",   lastLogin: "15m ago" },
      { fullName: "Bob Johnson",          username: "bob",        email: "bob.j@retailerp.com",     phone: "+1 (555) 919-4820", department: "Inventory",  role: "Cashier",       status: "Locked",   lastLogin: "3d ago" },
      { fullName: "Charlotte Green",      username: "charlotte",  email: "char.g@retailerp.com",    phone: "+1 (555) 901-2940", department: "Management", role: "Manager",       status: "Disabled", lastLogin: "Yesterday" }
    ];

    this.filteredUsers = [...this.users];
  }

  _updateWorkspace() {
    if (!this.element) return;

    // Clear existing main components viewports
    const mainWorkspace = this.element.querySelector(".user-main-workspace");
    const sidebarPane   = this.element.querySelector(".user-sidebar-pane");

    if (mainWorkspace) {
      // Keep toolbar, but replace table
      const prevTable = mainWorkspace.querySelector(".user-table-card");
      if (prevTable) prevTable.remove();

      const tableObj = new UserTable({
        users: this.filteredUsers,
        selectedUser: this.selectedUser,
        onSelectRow: (u) => {
          this.selectedUser = u;
          this._updateWorkspace();
        }
      });
      mainWorkspace.appendChild(tableObj.render());
    }

    if (sidebarPane) {
      sidebarPane.innerHTML = "";
      const sidebarObj = new UserDetailsPanel({
        selectedUser: this.selectedUser,
        onAction: (actionKey, userObj) => {
          console.log(`[UserManagement Master Action] ${actionKey} on: ${userObj.username}`);
          if (actionKey === "delete") {
            this.users = this.users.filter(u => u.username !== userObj.username);
            this.filteredUsers = this.filteredUsers.filter(u => u.username !== userObj.username);
            this.selectedUser = null;
          } else if (actionKey === "toggle") {
            userObj.status = userObj.status === "Active" ? "Locked" : "Active";
          } else if (actionKey === "disable") {
            userObj.status = userObj.status === "Disabled" ? "Active" : "Disabled";
          }
          this._updateWorkspace();
        }
      });
      sidebarPane.appendChild(sidebarObj.render());
    }
  }

  render() {
    const container = document.createElement("div");
    container.className = "user-management-container";

    // Left Workspace: Toolbar + Table
    const workspace = document.createElement("div");
    workspace.className = "user-main-workspace";

    // 1. Toolbar
    const toolbar = new UserToolbar({
      onAddUser: () => {
        const dialog = new AddUserDialog({
          onSave: (newUser) => {
            this.users.push(newUser);
            this.filteredUsers.push(newUser);
            this._updateWorkspace();
          }
        });
        document.body.appendChild(dialog.render());
      },
      onFilterQuery: (q) => {
        this.filteredUsers = this.users.filter(u => 
          u.fullName.toLowerCase().includes(q) || 
          u.username.toLowerCase().includes(q) || 
          u.email.toLowerCase().includes(q)
        );
        this._updateWorkspace();
      }
    });
    workspace.appendChild(toolbar.render());
    container.appendChild(workspace);

    // Right Sidebar Pane
    const sidebarPane = document.createElement("div");
    sidebarPane.className = "user-sidebar-pane";
    container.appendChild(sidebarPane);

    this.element = container;

    this._updateWorkspace();

    return container;
  }
}
