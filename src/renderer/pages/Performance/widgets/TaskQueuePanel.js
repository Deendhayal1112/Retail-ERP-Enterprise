/**
 * TaskQueuePanel.js
 * Retail ERP Enterprise — Queued Background Tasks Panel
 */

"use strict";

export default class TaskQueuePanel {
  constructor(onCancelClick = () => {}) {
    this.element = null;
    this.onCancelClick = onCancelClick;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card task-queue-panel";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "16px";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="14" y2="12"></line><line x1="4" y1="18" x2="18" y2="18"></line></svg>
          Pending Job Queue
        </h3>
        <span class="metric-card-badge badge-normal count-badge" style="background:#F59E0B; color:#FFF;">0 Queued</span>
      </div>
      <div class="queue-tasks-list" style="display:flex; flex-direction:column; gap:12px; min-height:100px;">
        <div class="empty-state" style="color:var(--neutral-500); font-size:13px; text-align:center; padding:32px 0;">No tasks in queue.</div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(tasks) {
    if (!this.element) return;
    const queued = tasks.filter(t => t.status === "QUEUED");

    this.element.querySelector(".count-badge").textContent = `${queued.length} Queued`;

    const container = this.element.querySelector(".queue-tasks-list");
    if (queued.length === 0) {
      container.innerHTML = `<div class="empty-state" style="color:var(--neutral-500); font-size:13px; text-align:center; padding:32px 0;">No tasks in queue.</div>`;
      return;
    }

    const priorityColors = {
      Critical: { bg: "rgba(239, 68, 68, 0.08)", color: "#EF4444" },
      High: { bg: "rgba(245, 158, 11, 0.08)", color: "#F59E0B" },
      Normal: { bg: "rgba(37, 99, 235, 0.08)", color: "#2563EB" },
      Low: { bg: "rgba(71, 85, 105, 0.08)", color: "#475569" },
      Background: { bg: "rgba(100, 116, 139, 0.08)", color: "#64748B" }
    };

    container.innerHTML = queued.map(task => {
      const p = priorityColors[task.priority] || priorityColors.Normal;
      const time = new Date(task.createdTime).toLocaleTimeString();

      return `
        <div class="task-row" style="border:1px solid rgba(0,0,0,0.06); border-radius:8px; padding:10px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; flex-direction:column; gap:4px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight:700; font-size:13px; color:#1E293B;">${task.name}</span>
              <span style="font-size:10px; font-weight:700; background:${p.bg}; color:${p.color}; border-radius:4px; padding:1px 6px;">${task.priority}</span>
            </div>
            <span style="font-size:11px; color:#64748B;">Enqueued at: ${time} • Type: ${task.type}</span>
          </div>
          <button class="cancel-queue-btn perf-btn-primary" data-id="${task.id}" style="background:#64748B; font-size:11px; padding:4px 8px; border-radius:4px;">Cancel</button>
        </div>`;
    }).join("");

    container.querySelectorAll(".cancel-queue-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = btn.getAttribute("data-id");
        this.onCancelClick(id);
      });
    });
  }
}
