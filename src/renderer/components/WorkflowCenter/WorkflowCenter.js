/**
 * WorkflowCenter.js
 * Retail ERP Enterprise — Reusable Workflow Optimization System Component
 *
 * Implements:
 * - WorkflowCenter   (Main coordinator wrapper grid container)
 * - WorkflowCard     (Individual process card box)
 * - WorkflowProgress (Unified horizontal progress indicator bar)
 * - WorkflowStep     (Detail of active process step and meta description)
 * - PendingTasks     (Sidebar notification queue list of approvals)
 * - WorkflowStatus   (Status pill badge active/paused/complete)
 * - ResumeWorkflow   (Nav action trigger buttons)
 */

"use strict";

export class WorkflowStatus {
  /**
   * @param {Object} options
   * @param {string} options.state e.g. "active", "paused", "complete"
   */
  constructor(options = {}) {
    this.state = options.state || "active";
  }

  render() {
    const badge = document.createElement("span");
    badge.className = `workflow-status-badge ${this.state}`;
    badge.textContent = this.state;
    return badge;
  }
}

export class WorkflowProgress {
  /**
   * @param {Object} options
   * @param {number} options.percent Completion percent (0 - 100)
   */
  constructor(options = {}) {
    this.percent = options.percent || 0;
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "workflow-progress-wrapper";

    wrap.innerHTML = `
      <div class="workflow-progress-labels">
        <span>Completion Progress</span>
        <span>${this.percent}%</span>
      </div>
      <div class="workflow-progress-bar-container">
        <div class="workflow-progress-bar-fill" style="width: ${this.percent}%"></div>
      </div>
    `;

    return wrap;
  }
}

export class WorkflowStep {
  /**
   * @param {Object} options
   * @param {string} options.stepName Current step label
   * @param {string} options.desc     Step description
   */
  constructor(options = {}) {
    this.stepName = options.stepName || "Initial Step";
    this.desc     = options.desc     || "Step details description...";
  }

  render() {
    const div = document.createElement("div");
    div.className = "workflow-step-indicator";
    div.innerHTML = `
      <span>Active Step: <strong>${this.stepName}</strong></span>
      <div style="font-size: 0.675rem; color: var(--text-muted); margin-top: 2px;">${this.desc}</div>
    `;
    return div;
  }
}

export class ResumeWorkflow {
  /**
   * @param {Object}   options
   * @param {Function} options.onResume Callback on resume click
   * @param {Function} options.onCancel Callback on cancel click
   */
  constructor(options = {}) {
    this.onResume = options.onResume || null;
    this.onCancel = options.onCancel || null;
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "workflow-actions-row";

    const cancel = document.createElement("button");
    cancel.className = "workflow-btn";
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", () => {
      if (this.onCancel) this.onCancel();
    });
    wrap.appendChild(cancel);

    const resume = document.createElement("button");
    resume.className = "workflow-btn primary";
    resume.textContent = "Resume";
    resume.addEventListener("click", () => {
      if (this.onResume) this.onResume();
    });
    wrap.appendChild(resume);

    return wrap;
  }
}

export class WorkflowCard {
  /**
   * @param {Object}   options
   * @param {string}   options.id        Unique ID key
   * @param {string}   options.icon      Emoji representation
   * @param {string}   options.name      Visual workflow title label
   * @param {string}   options.state     Active status "active"|"paused"|"complete"
   * @param {number}   options.percent   Progress completion percent (0-100)
   * @param {string}   options.stepName  Active step title
   * @param {string}   options.stepDesc  Active step sub description
   * @param {Function} options.onChange  State update callback
   */
  constructor(options = {}) {
    this.id        = options.id        || "";
    this.icon      = options.icon      || "⚙️";
    this.name      = options.name      || "Workflow Name";
    this.state     = options.state     || "active";
    this.percent   = options.percent   || 0;
    this.stepName  = options.stepName  || "Step";
    this.stepDesc  = options.stepDesc  || "Description";
    this.onChange  = options.onChange  || null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "workflow-card";

    // Top: Icon + Name + Status
    const top = document.createElement("div");
    top.className = "workflow-card-top";

    const info = document.createElement("div");
    info.className = "workflow-card-info";
    info.innerHTML = `<span>${this.icon}</span><span>${this.name}</span>`;
    top.appendChild(info);

    const statusBadge = new WorkflowStatus({ state: this.state });
    top.appendChild(statusBadge.render());
    card.appendChild(top);

    // Mid: Progress bar
    const progress = new WorkflowProgress({ percent: this.percent });
    card.appendChild(progress.render());

    // Mid: Current Active Step
    const step = new WorkflowStep({ stepName: this.stepName, desc: this.stepDesc });
    card.appendChild(step.render());

    // Bottom: Navigation Buttons
    const controls = new ResumeWorkflow({
      onResume: () => {
        console.log(`[Workflow Action] Resuming process flow: ${this.name}`);
        if (this.onChange) this.onChange("active");
      },
      onCancel: () => {
        console.log(`[Workflow Action] Cancelling process flow: ${this.name}`);
        if (this.onChange) this.onChange("paused");
      }
    });
    card.appendChild(controls.render());

    return card;
  }
}

export class PendingTasks {
  /**
   * @param {Object} options
   * @param {Object[]} options.tasks Pending list elements
   */
  constructor(options = {}) {
    this.tasks = options.tasks || [
      { title: "Approve Invoice #1029", type: "Approval", desc: "Awaiting administrator validation ($4,820.00)" },
      { title: "Restock Low Stock Shoes", type: "Task", desc: "Purchase order approval for Warehouse A items" },
      { title: "Supplier Refund Claim", type: "Review", desc: "Validate damaged apparel refund claim voucher" }
    ];
  }

  render() {
    const col = document.createElement("div");
    col.className = "workflow-sidebar-column";

    const header = document.createElement("header");
    header.className = "workflow-sidebar-header";
    header.textContent = "Pending Approvals";
    col.appendChild(header);

    const list = document.createElement("div");
    list.className = "workflow-pending-list";

    this.tasks.forEach(task => {
      const item = document.createElement("div");
      item.className = "workflow-pending-item";
      item.innerHTML = `
        <div class="pending-item-top">
          <span class="pending-item-title">${task.title}</span>
          <span class="pending-item-badge">${task.type}</span>
        </div>
        <span class="pending-item-desc">${task.desc}</span>
      `;
      item.addEventListener("click", () => {
        console.log(`[Workflow Pending Click] Resuming workflow approval: ${task.title}`);
      });
      list.appendChild(item);
    });

    col.appendChild(list);
    return col;
  }
}

// ─────────────────────────────────────────────────────
// MAIN WORKFLOW CENTER GRID COMPONENT CARD
// ─────────────────────────────────────────────────────

export default class WorkflowCenter {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Static placeholder workflow datasets
    this.workflows = [
      { id: "sales",    icon: "💰", name: "Sales Workflow",     state: "active",   percent: 60, stepName: "Process Checkout Receipt", stepDesc: "Review discounts before generating invoice" },
      { id: "inventory", icon: "📦", name: "Inventory Audit",    state: "paused",   percent: 40, stepName: "Physical Count Reconciliation", stepDesc: "Verify stock amounts match reports" },
      { id: "purchase",  icon: "🛒", name: "Supplier Purchase",  state: "active",   percent: 85, stepName: "Approve Purchase Order",   stepDesc: "Send signed order request to Brand Gamma" },
      { id: "customer",  icon: "👥", name: "Customer Loyalty",  state: "complete", percent: 100, stepName: "Deliver Member Gift Card", stepDesc: "Award customer points vouchers" }
    ];
  }

  _updateContent() {
    const grid = this.element.querySelector(".workflow-cards-column");
    if (!grid) return;

    grid.innerHTML = "";

    this.workflows.forEach(w => {
      const card = new WorkflowCard({
        id:        w.id,
        icon:      w.icon,
        name:      w.name,
        state:     w.state,
        percent:   w.percent,
        stepName:  w.stepName,
        stepDesc:  w.stepDesc,
        onChange:  (newState) => {
          w.state = newState;
          if (newState === "paused") w.percent = Math.max(0, w.percent - 5);
          if (newState === "active") w.percent = Math.min(100, w.percent + 5);
          this._updateContent();
        }
      });
      grid.appendChild(card.render());
    });
  }

  render() {
    const card = document.createElement("div");
    card.className = "workflow-center-card";

    // Header Details
    card.innerHTML = `
      <header class="workflow-center-header">
        <div class="workflow-title-group">
          <h3 class="workflow-title">Enterprise Workflow Optimization</h3>
          <span class="workflow-subtitle">Guided operational process cycles and approval checkpoints</span>
        </div>
        <div class="workflow-toolbar">
          <span class="workflow-toolbar-text">Active Processes: <strong>3 Runs</strong></span>
        </div>
      </header>
    `;

    // Inner Grid
    const bodyGrid = document.createElement("div");
    bodyGrid.className = "workflow-body-grid";

    // Left Cards Column Grid
    const cardsCol = document.createElement("div");
    cardsCol.className = "workflow-cards-column";
    bodyGrid.appendChild(cardsCol);

    // Right Sidebar
    bodyGrid.appendChild(new PendingTasks().render());

    card.appendChild(bodyGrid);
    this.element = card;

    this._updateContent();

    return card;
  }
}
