/**
 * DeploymentStatusPanel.js
 * Retail ERP Enterprise — Deployment History & Status Panel
 */

"use strict";

export default class DeploymentStatusPanel {
  constructor(options = {}) {
    this.options = options;
    this.history = options.history || [];
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "deploy-center-card col-span-12";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h3 class="deploy-center-card-title" style="margin:0;">Deployment History & Hot-Patch Control</h3>
        <button class="deploy-btn" style="height:36px; padding:0 16px; background-color:#5B3DF5; color:#FFFFFF; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">
          Deploy to Production
        </button>
      </div>

      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="deploy-progress-wrap" style="display:none; padding:16px; border:1px solid #E9EDF5; border-radius:12px; background-color:#F8FAFC;">
          <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; color:#1E293B;">
            <span class="deploy-label">Deploying...</span>
            <span class="deploy-percentage">0%</span>
          </div>
          <div style="width:100%; height:10px; background-color:#E9EDF5; border-radius:6px; overflow:hidden; margin-top:10px;">
            <div class="deploy-progress-fill" style="height:100%; background-color:#5B3DF5; width:0%; transition:width 200ms ease;"></div>
          </div>
        </div>

        <div class="deployments-list-container" style="display:grid; grid-template-columns:1fr; gap:16px;"></div>
      </div>
    `;

    const container = card.querySelector(".deployments-list-container");
    this.history.forEach(d => {
      const row = document.createElement("div");
      row.className = "deploy-row-item";
      row.innerHTML = `
        <div>
          <strong style="color:#1E293B; font-size:14px; display:block;">${d.id} | v${d.version}</strong>
          <span style="font-size:12px; color:#6B7280;">Target: ${d.environment} | Run Date: ${d.date}</span>
        </div>
        <span class="deploy-badge ${d.status.toLowerCase()}">${d.status}</span>
      `;
      container.appendChild(row);
    });

    card.querySelector(".deploy-btn").addEventListener("click", () => {
      this.startDeployment();
    });

    this.element = card;
    return card;
  }

  async startDeployment() {
    const progressWrap = this.element.querySelector(".deploy-progress-wrap");
    const progressFill = this.element.querySelector(".deploy-progress-fill");
    const progressLabel = this.element.querySelector(".deploy-label");
    const progressPerc = this.element.querySelector(".deploy-percentage");

    progressLabel.textContent = "Deploying hot-patch to Production...";
    progressPerc.textContent = "0%";
    progressFill.style.width = "0%";
    progressWrap.style.display = "block";

    const removeProgressListener = window.api.ipc.on("deploy:progress", (data) => {
      progressPerc.textContent = `${data.progress}%`;
      progressFill.style.width = `${data.progress}%`;
    });

    const removeCompleteListener = window.api.ipc.on("deploy:completed", (data) => {
      progressPerc.textContent = "100%";
      progressFill.style.width = "100%";
      
      setTimeout(() => {
        progressWrap.style.display = "none";
        alert("Deployment completed successfully!\nNew production builds catalog updated.");
        
        if (this.options.onDeployComplete) {
          this.options.onDeployComplete(data.history);
        }

        removeProgressListener();
        removeCompleteListener();
      }, 500);
    });

    try {
      await window.api.ipc.invoke("deploy:run-deployment", "Production", "0.2.0-beta");
    } catch (err) {
      console.error("Deploy failed:", err);
      progressWrap.style.display = "none";
      removeProgressListener();
      removeCompleteListener();
    }
  }
}
