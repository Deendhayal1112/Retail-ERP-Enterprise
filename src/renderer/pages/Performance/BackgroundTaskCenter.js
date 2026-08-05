/**
 * BackgroundTaskCenter.js
 * Retail ERP Enterprise — Background Services Telemetry and Queue Management Dashboard
 */

"use strict";

import TaskMetricsPanel from "./widgets/TaskMetricsPanel.js";
import ActiveTasksPanel from "./widgets/ActiveTasksPanel.js";
import TaskQueuePanel from "./widgets/TaskQueuePanel.js";
import TaskHistoryPanel from "./widgets/TaskHistoryPanel.js";

export default class BackgroundTaskCenter {
  constructor() {
    this.element = null;

    this.metricsPanel = new TaskMetricsPanel();
    this.activePanel = new ActiveTasksPanel((id) => this.handleCancel(id));
    this.queuePanel = new TaskQueuePanel((id) => this.handleCancel(id));
    this.historyPanel = new TaskHistoryPanel();

    this.onMetricsUpdated = this.handleMetricsUpdated.bind(this);
    this.unsubscribe = null;
  }

  render() {
    const mainWrap = document.createElement("div");
    mainWrap.className = "performance-center-wrapper";
    mainWrap.style.padding = "32px"; // 32px page padding
    mainWrap.style.display = "flex";
    mainWrap.style.flexDirection = "column";
    mainWrap.style.gap = "24px"; // 24px section gap

    // 1. Header Row
    const header = document.createElement("header");
    header.className = "performance-header-row";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.innerHTML = `
      <div class="performance-header-info">
        <h1 class="performance-title" style="margin:0; font-size:24px; font-weight:800; color:#1E293B;">Background Services</h1>
        <p class="performance-subtitle" style="margin:4px 0 0 0; font-size:13px; color:#64748B;">Centralized scheduler monitoring, execution queue status, and non-blocking workers</p>
      </div>
      <div class="performance-header-actions" style="display:flex; gap:12px;">
        <button class="perf-btn-primary btn-bg-export" aria-label="Export Task Logs" style="background:#475569;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export Log
        </button>
      </div>
    `;
    mainWrap.appendChild(header);

    // 2. Metrics Block at top
    mainWrap.appendChild(this.metricsPanel.render());

    // 3. New Task Trigger Panel
    const triggerCard = document.createElement("div");
    triggerCard.className = "performance-metric-card";
    triggerCard.style.padding = "24px"; // 24px card padding
    triggerCard.style.borderRadius = "16px"; // 16px card radius
    triggerCard.innerHTML = `
      <h3 style="margin:0 0 16px 0; font-size:15px; font-weight:700; color:#1E293B;">Trigger Task Simulator</h3>
      <form class="trigger-task-form" style="display:flex; gap:16px; align-items:flex-end; flex-wrap:wrap;">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:12px; font-weight:600; color:#475569;">Task Action</label>
          <select class="select-task-type" style="padding:6px 12px; border-radius:6px; border:1px solid rgba(0,0,0,0.12); font-size:13px; background:#FFF; min-width:180px;">
            <option value="backup">Nightly Database Backup</option>
            <option value="sync">Offline Queue Sync</option>
            <option value="report_gen">Compile Sales Report</option>
            <option value="pdf_gen">Generate PDF Invoice</option>
            <option value="update_check">Check Update Patches</option>
            <option value="db_maintenance">Optimize SQLite Indexes</option>
          </select>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:12px; font-weight:600; color:#475569;">Priority Level</label>
          <select class="select-task-priority" style="padding:6px 12px; border-radius:6px; border:1px solid rgba(0,0,0,0.12); font-size:13px; background:#FFF; min-width:120px;">
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
            <option value="Low">Low</option>
            <option value="Background">Background</option>
          </select>
        </div>
        <button type="submit" class="perf-btn-primary btn-run-task" style="background:#2563EB; font-size:13px; padding:7px 16px; border-radius:6px; font-weight:700;">Enqueue Job</button>
      </form>
    `;
    mainWrap.appendChild(triggerCard);

    // Bind form submit
    const form = triggerCard.querySelector(".trigger-task-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const typeSelect = form.querySelector(".select-task-type");
      const prioritySelect = form.querySelector(".select-task-priority");
      
      const payload = {
        type: typeSelect.value,
        name: typeSelect.options[typeSelect.selectedIndex].text,
        priority: prioritySelect.value,
        metadata: { source: "operator_panel" }
      };

      window.api.ipc.invoke("bg-tasks:trigger-task", payload).then(task => {
        if (window.Toast) {
          window.Toast.show(`Queued: ${task.name}`, "success", 2000);
        }
      });
    });

    // 4. Concurrency grid (Active & Queue)
    const grid = document.createElement("div");
    grid.className = "performance-dashboard-grid";
    grid.style.gridGap = "24px"; // 24px Grid Gap
    grid.style.gridTemplateColumns = "1fr 1fr";

    grid.appendChild(this.activePanel.render());
    grid.appendChild(this.queuePanel.render());
    mainWrap.appendChild(grid);

    // 5. History Panel at bottom
    mainWrap.appendChild(this.historyPanel.render());

    this.element = mainWrap;

    // Export button
    const exportBtn = header.querySelector(".btn-bg-export");
    if (exportBtn) {
      exportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleExport();
      });
    }

    // Subscribe to IPC events and launch telemetry loop
    this.unsubscribe = window.api.ipc.on("bg-tasks:metrics-updated", this.onMetricsUpdated);
    window.api.ipc.send("bg-tasks:start-telemetry");

    return mainWrap;
  }

  handleMetricsUpdated(data) {
    if (!this.element || !data) return;
    this.metricsPanel.update(data.metrics);
    this.activePanel.update(data.tasks);
    this.queuePanel.update(data.tasks);
    this.historyPanel.update(data.tasks);
  }

  handleCancel(taskId) {
    window.api.ipc.invoke("bg-tasks:cancel-task", taskId).then(() => {
      if (window.Toast) {
        window.Toast.show("Cancellation command sent.", "info", 2000);
      }
    });
  }

  handleExport() {
    window.api.ipc.invoke("bg-tasks:get-tasks").then(tasks => {
      if (window.Toast) window.Toast.show("Job diagnostics copied to clipboard!", "success", 3000);
      const payload = {
        timestamp: new Date().toISOString(),
        tasks
      };
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(err => {
        console.error("Clipboard copy failed:", err);
      });
    });
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    window.api.ipc.send("bg-tasks:stop-telemetry");
  }
}
