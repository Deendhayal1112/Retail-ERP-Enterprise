/**
 * CICDDashboard.js
 * Retail ERP Enterprise — CI/CD Pipeline Telemetry Dashboard Page Controller
 */

"use strict";

import { CICDManagerInstance } from "../../performance/CICDManager.js";
import { CICDEvents } from "../../performance/CICDEvents.js";

import BuildPipelinePanel from "./widgets/BuildPipelinePanel.js";
import TestPipelinePanel from "./widgets/TestPipelinePanel.js";
import QualityGatePanel from "./widgets/QualityGatePanel.js";
import DeploymentPanel from "./widgets/DeploymentPanel.js";
import ReleaseStatusPanel from "./widgets/ReleaseStatusPanel.js";

export default class CICDDashboard {
  constructor() {
    this.element = null;

    this.buildPanel = new BuildPipelinePanel();
    this.testPanel = new TestPipelinePanel();
    this.gatePanel = new QualityGatePanel();
    this.deployPanel = new DeploymentPanel();
    this.releasePanel = new ReleaseStatusPanel();

    this.onMetricsUpdated = this.handleMetricsUpdated.bind(this);
  }

  render() {
    const mainWrap = document.createElement("div");
    mainWrap.className = "performance-center-wrapper";
    mainWrap.style.padding = "32px"; // 32px page padding
    mainWrap.style.display = "flex";
    mainWrap.style.flexDirection = "column";
    mainWrap.style.gap = "24px"; // 24px section gap

    // Header
    const header = document.createElement("header");
    header.className = "performance-header-row";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.innerHTML = `
      <div class="performance-header-info">
        <h1 class="performance-title" style="margin:0; font-size:24px; font-weight:800; color:#1E293B;">CI/CD Pipeline</h1>
        <p class="performance-subtitle" style="margin:4px 0 0 0; font-size:13px; color:#64748B;">Build automation status, quality gates compliance, multi-platform installer packaging, and release candidate history</p>
      </div>
      <div class="performance-header-actions" style="display:flex; gap:12px;">
        <button class="perf-btn-primary btn-run-pipeline" aria-label="Trigger CI/CD Pipeline Check" style="background:#10B981; font-weight:700;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
          Run Pipeline
        </button>
        <button class="perf-btn-primary btn-pipeline-export" aria-label="Export Build logs" style="background:#475569;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export Logs
        </button>
      </div>
    `;
    mainWrap.appendChild(header);

    // Page body layout grid
    const layoutGrid = document.createElement("div");
    layoutGrid.className = "performance-dashboard-grid";
    layoutGrid.style.gridGap = "24px"; // 24px Grid Gap
    layoutGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(280px, 1fr))";

    layoutGrid.appendChild(this.buildPanel.render());
    layoutGrid.appendChild(this.testPanel.render());
    layoutGrid.appendChild(this.gatePanel.render());
    layoutGrid.appendChild(this.deployPanel.render());

    mainWrap.appendChild(layoutGrid);

    // Release candidates historical runs
    mainWrap.appendChild(this.releasePanel.render());

    this.element = mainWrap;

    // Button triggers
    const sweepBtn = header.querySelector(".btn-run-pipeline");
    if (sweepBtn) {
      sweepBtn.addEventListener("click", (e) => {
        e.preventDefault();
        CICDManagerInstance.triggerPipelineSweep();
        if (window.Toast) window.Toast.show("Automated build validation triggered.", "success", 2000);
      });
    }

    const exportBtn = header.querySelector(".btn-pipeline-export");
    if (exportBtn) {
      exportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleExport();
      });
    }

    // Subscribe to events and start telemetry loop
    CICDEvents.on("cicd-metrics-updated", this.onMetricsUpdated);
    CICDManagerInstance.start();

    return mainWrap;
  }

  handleMetricsUpdated(data) {
    if (!this.element || !data) return;
    this.buildPanel.update(data.current);
    this.testPanel.update(data.current);
    this.gatePanel.update(data.current);
    this.deployPanel.update(data.current);
    this.releasePanel.update(data.current);
  }

  handleExport() {
    if (window.Toast) window.Toast.show("CI/CD pipeline report copied to clipboard!", "success", 3000);
    const payload = {
      timestamp: new Date().toISOString(),
      history: CICDManagerInstance.getHistory()
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(err => {
      console.error("Clipboard export failed:", err);
    });
  }

  destroy() {
    CICDEvents.off("cicd-metrics-updated", this.onMetricsUpdated);
    CICDManagerInstance.stop();
  }
}
