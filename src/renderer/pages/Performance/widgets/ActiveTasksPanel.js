/**
 * ActiveTasksPanel.js
 * Retail ERP Enterprise — Active Background Tasks Panel
 */

"use strict";

export default class ActiveTasksPanel {
  constructor(onCancelClick = () => {}) {
    this.element = null;
    this.onCancelClick = onCancelClick;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card active-tasks-panel";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "16px";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Active Task Execution
        </h3>
        <span class="metric-card-badge badge-normal count-badge">0 Running</span>
      </div>
      <div class="active-tasks-list" style="display:flex; flex-direction:column; gap:16px; min-height:100px;">
        <div class="empty-state" style="color:var(--neutral-500); font-size:13px; text-align:center; padding:32px 0;">No active background tasks.</div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(tasks) {
    if (!this.element) return;
    const running = tasks.filter(t => t.status === "RUNNING" || t.status === "STARTING");

    this.element.querySelector(".count-badge").textContent = `${running.length} Running`;

    const container = this.element.querySelector(".active-tasks-list");
    if (running.length === 0) {
      container.innerHTML = `<div class="empty-state" style="color:var(--neutral-500); font-size:13px; text-align:center; padding:32px 0;">No active background tasks.</div>`;
      return;
    }

    container.innerHTML = running.map(task => {
      const pct = task.progress ? task.progress.pct : 0;
      const stage = task.progress ? task.progress.stage : "Initializing";
      const msg = task.progress ? task.progress.message : "Preparing executor...";

      return `
        <div class="task-row" style="background:rgba(37,99,235,0.02); border:1px solid rgba(37,99,235,0.08); border-radius:8px; padding:12px; display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span style="font-weight:700; font-size:14px; color:#1E293B;">${task.name}</span>
              <span style="font-size:11px; color:#64748B; background:#F1F5F9; border-radius:4px; padding:2px 6px; margin-left:8px; text-transform:uppercase;">${task.type}</span>
            </div>
            <button class="cancel-btn perf-btn-primary" data-id="${task.id}" style="background:#EF4444; font-size:11px; padding:4px 8px; border-radius:4px;">Cancel</button>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:12px; color:#475569; font-weight:600;">
            <span>Stage: ${stage}</span>
            <span>${pct}%</span>
          </div>
          <div style="width:100%; height:6px; background:#F1F5F9; border-radius:3px; overflow:hidden;">
            <div style="width:${pct}%; height:100%; background:#2563EB; border-radius:3px; transition:width 0.4s ease;"></div>
          </div>
          <span style="font-size:11px; color:#64748B; font-style:italic;">${msg}</span>
        </div>`;
    }).join("");

    // Bind cancellation click handlers
    container.querySelectorAll(".cancel-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = btn.getAttribute("data-id");
        this.onCancelClick(id);
      });
    });
  }
}
