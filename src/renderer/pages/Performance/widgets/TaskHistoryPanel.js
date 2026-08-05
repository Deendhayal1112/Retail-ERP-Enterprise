/**
 * TaskHistoryPanel.js
 * Retail ERP Enterprise — Historical Completed/Failed Tasks Panel
 */

"use strict";

export default class TaskHistoryPanel {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card task-history-panel";
    card.style.gridColumn = "1 / -1"; // Spans full width
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "16px";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Job Execution History
        </h3>
        <span class="metric-card-badge badge-normal count-badge">0 Finished</span>
      </div>
      <div class="history-list" style="display:flex; flex-direction:column; gap:8px; max-height:300px; overflow-y:auto; padding-right:4px;">
        <div class="empty-state" style="color:var(--neutral-500); font-size:13px; text-align:center; padding:32px 0;">No completed operations in this session.</div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(tasks) {
    if (!this.element) return;
    const history = tasks.filter(t => ["COMPLETED", "FAILED", "CANCELLED"].includes(t.status));

    this.element.querySelector(".count-badge").textContent = `${history.length} Finished`;

    const container = this.element.querySelector(".history-list");
    if (history.length === 0) {
      container.innerHTML = `<div class="empty-state" style="color:var(--neutral-500); font-size:13px; text-align:center; padding:32px 0;">No completed operations in this session.</div>`;
      return;
    }

    const stateStyles = {
      COMPLETED: { color: "#10B981", label: "Completed" },
      FAILED: { color: "#EF4444", label: "Failed" },
      CANCELLED: { color: "#64748B", label: "Cancelled" }
    };

    // Sort by completion time (newest first)
    const sorted = [...history].sort((a, b) => (b.completedTime || 0) - (a.completedTime || 0));

    container.innerHTML = sorted.map(task => {
      const style = stateStyles[task.status] || { color: "#475569", label: task.status };
      const start = task.startedTime || task.createdTime;
      const end = task.completedTime || Date.now();
      const dur = ((end - start) / 1000).toFixed(1);
      const isFailed = task.status === "FAILED";

      return `
        <div class="history-row" style="border-bottom:1px solid rgba(0,0,0,0.04); padding:8px 0; display:flex; justify-content:space-between; align-items:center; font-size:13px;">
          <div style="display:flex; flex-direction:column; gap:2px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight:700; color:#1E293B;">${task.name}</span>
              <span style="font-size:10px; font-weight:700; background:rgba(0,0,0,0.04); color:#475569; border-radius:4px; padding:1px 6px; text-transform:uppercase;">${task.type}</span>
            </div>
            ${isFailed && task.error ? `<span style="font-size:11px; color:#EF4444; font-weight:500;">Reason: ${task.error}</span>` : ""}
            <span style="font-size:11px; color:#64748B;">Duration: ${dur}s • Priority: ${task.priority}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:700; color:${style.color}; text-transform:uppercase; font-size:11px;">${style.label}</span>
          </div>
        </div>`;
    }).join("");
  }
}
