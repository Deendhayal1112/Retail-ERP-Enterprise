/**
 * TrainingPanel.js
 * Retail ERP Enterprise — Onboarding Walkthrough & Training Courses
 */

"use strict";

export default class TrainingPanel {
  constructor(options = {}) {
    this.options = options;
    this.courses = options.courses || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "docs-center-card col-span-12";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <h3 class="docs-center-card-title" style="margin:0;">Interactive Onboarding & Training Courses</h3>
        <button class="start-tour-btn" style="height:36px; padding:0 16px; background-color:#5B3DF5; color:#FFFFFF; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">
          Start Interactive Tour
        </button>
      </div>

      <div style="display:grid; grid-template-columns:1fr; gap:20px;">
        <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin:0;">Operator Qualifications & Training Courses</h4>
        <div class="courses-list-container" style="display:grid; grid-template-columns:1fr; gap:16px;"></div>
      </div>
    `;

    const container = card.querySelector(".courses-list-container");
    this.courses.forEach(c => {
      const row = document.createElement("div");
      row.style.border = "1px solid #E9EDF5";
      row.style.borderRadius = "12px";
      row.style.padding = "16px";
      row.style.display = "flex";
      row.style.flexDirection = "column";
      row.style.gap = "8px";

      row.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="font-size:14px; color:#1E293B; display:block;">${c.name}</strong>
            <span style="font-size:12px; color:#6B7280;">Duration: ${c.duration}</span>
          </div>
          <button class="start-course-btn" data-id="${c.id}" style="height:32px; padding:0 12px; border:1px solid #E9EDF5; background:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; color:#1E293B;">
            ${c.completed ? "Review Course" : "Resume Course"}
          </button>
        </div>
        <div style="display:flex; align-items:center; gap:12px; margin-top:8px;">
          <div style="flex:1; height:8px; background-color:#E9EDF5; border-radius:4px; overflow:hidden;">
            <div style="height:100%; background-color:#10B981; width:${c.progressPercent}%;"></div>
          </div>
          <span style="font-size:12px; font-weight:600; color:#475569;">${c.progressPercent}%</span>
        </div>
      `;

      row.querySelector(".start-course-btn").addEventListener("click", () => {
        this.startCourse(c.id);
      });

      container.appendChild(row);
    });

    card.querySelector(".start-tour-btn").addEventListener("click", () => {
      this.startTour();
    });

    return card;
  }

  async startTour() {
    try {
      const result = await window.api.ipc.invoke("training:start-tour");
      if (result && result.success) {
        alert("Initializing interactive tour...\n\n" + result.steps.map(s => `Step ${s.step}: ${s.title}\n${s.message}`).join("\n\n"));
      }
    } catch (err) {
      console.error("Failed to start tour:", err);
    }
  }

  async startCourse(courseId) {
    if (this.options.onEnroll) {
      await this.options.onEnroll(courseId);
    }
  }
}
