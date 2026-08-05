/**
 * UserGuidePanel.js
 * Retail ERP Enterprise — Operator & User Guides Panel
 */

"use strict";

export default class UserGuidePanel {
  constructor(options = {}) {
    this.options = options;
    this.guides = options.guides || [];
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "docs-center-card col-span-12";
    card.innerHTML = `
      <h3 class="docs-center-card-title">User Documentation & Manuals</h3>
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="guides-list-container" style="display:grid; grid-template-columns:1fr; gap:16px;"></div>
        <div class="download-progress-wrap" style="display:none; padding:16px; border:1px solid #E9EDF5; border-radius:12px; background-color:#F8FAFC;">
          <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; color:#1E293B;">
            <span class="download-label">Downloading...</span>
            <span class="download-percentage">0%</span>
          </div>
          <div style="width:100%; height:10px; background-color:#E9EDF5; border-radius:6px; overflow:hidden; margin-top:10px;">
            <div class="download-progress-fill" style="height:100%; background-color:#5B3DF5; width:0%; transition:width 200ms ease;"></div>
          </div>
        </div>
      </div>
    `;

    const container = card.querySelector(".guides-list-container");
    this.guides.forEach(g => {
      const row = document.createElement("div");
      row.className = "docs-guide-row";
      row.innerHTML = `
        <div>
          <strong style="color:#1E293B; font-size:14px; display:block;">${g.title}</strong>
          <span style="font-size:12px; color:#6B7280;">Format: ${g.format} | File Size: ${g.size}</span>
        </div>
        <button class="download-guide-btn" data-id="${g.id}" style="height:32px; padding:0 12px; border:1px solid #E9EDF5; background-color:#FFFFFF; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; color:#1E293B;">
          Download Guide
        </button>
      `;

      row.querySelector(".download-guide-btn").addEventListener("click", () => {
        this.startDownload(g.id, g.title);
      });

      container.appendChild(row);
    });

    this.element = card;
    return card;
  }

  async startDownload(guideId, title) {
    const progressWrap = this.element.querySelector(".download-progress-wrap");
    const progressFill = this.element.querySelector(".download-progress-fill");
    const progressLabel = this.element.querySelector(".download-label");
    const progressPerc = this.element.querySelector(".download-percentage");

    progressLabel.textContent = `Downloading ${title}...`;
    progressPerc.textContent = "0%";
    progressFill.style.width = "0%";
    progressWrap.style.display = "block";

    const removeProgressListener = window.api.ipc.on("docs:download-progress", (event, data) => {
      if (data.guideId === guideId) {
        progressPerc.textContent = `${data.progress}%`;
        progressFill.style.width = `${data.progress}%`;
      }
    });

    const removeCompleteListener = window.api.ipc.on("docs:download-completed", (event, data) => {
      if (data.guideId === guideId) {
        progressPerc.textContent = "100%";
        progressFill.style.width = "100%";
        
        setTimeout(() => {
          progressWrap.style.display = "none";
          alert(`"${title}" downloaded successfully to your local System Documentation folder!`);
          removeProgressListener();
          removeCompleteListener();
        }, 500);
      }
    });

    try {
      await window.api.ipc.invoke("docs:run-download", guideId);
    } catch (err) {
      console.error("Download failed:", err);
      progressWrap.style.display = "none";
      removeProgressListener();
      removeCompleteListener();
    }
  }
}
