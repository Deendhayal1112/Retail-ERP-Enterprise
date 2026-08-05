/**
 * EnterpriseQACenter.js
 * Retail ERP Enterprise — Testing Strategy & QA Architecture Page Controller
 */

"use strict";

import { QAManagerInstance } from "../../performance/QAManager.js";
import { QAEvents } from "../../performance/QAEvents.js";

import QualityMetricsPanel from "./widgets/QualityMetricsPanel.js";
import TestCoveragePanel from "./widgets/TestCoveragePanel.js";
import IntegrationPanel from "./widgets/IntegrationPanel.js";
import E2EPanel from "./widgets/E2EPanel.js";
import DesktopValidationPanel from "./widgets/DesktopValidationPanel.js";

export default class EnterpriseQACenter {
  constructor() {
    this.element = null;

    this.metricsPanel = new QualityMetricsPanel();
    this.coveragePanel = new TestCoveragePanel();
    this.integrationPanel = new IntegrationPanel();
    this.e2ePanel = new E2EPanel();
    this.desktopPanel = new DesktopValidationPanel();

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
        <h1 class="performance-title" style="margin:0; font-size:24px; font-weight:800; color:#1E293B;">Enterprise QA Center</h1>
        <p class="performance-subtitle" style="margin:4px 0 0 0; font-size:13px; color:#64748B;">Automated unit testing, integration sweeps, E2E validation, and accessibility diagnostics</p>
      </div>
      <div class="performance-header-actions" style="display:flex; gap:12px;">
        <button class="perf-btn-primary btn-qa-sweep" aria-label="Run Automated Test Sweep" style="background:#10B981; font-weight:700;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Run Suite
        </button>
        <button class="perf-btn-primary btn-qa-export" aria-label="Export Testing Diagnostic Logs" style="background:#475569;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export Report
        </button>
      </div>
    `;
    mainWrap.appendChild(header);

    // Metrics Bar
    mainWrap.appendChild(this.metricsPanel.render());

    // Page body layout grid
    const layoutGrid = document.createElement("div");
    layoutGrid.className = "performance-dashboard-grid";
    layoutGrid.style.gridGap = "24px"; // 24px Grid Gap
    layoutGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(320px, 1fr))";

    layoutGrid.appendChild(this.coveragePanel.render());
    layoutGrid.appendChild(this.integrationPanel.render());
    layoutGrid.appendChild(this.e2ePanel.render());
    layoutGrid.appendChild(this.desktopPanel.render());

    mainWrap.appendChild(layoutGrid);
    this.element = mainWrap;

    // Action button events
    const runBtn = header.querySelector(".btn-qa-sweep");
    if (runBtn) {
      runBtn.addEventListener("click", (e) => {
        e.preventDefault();
        QAManagerInstance.triggerTestRun();
        if (window.Toast) window.Toast.show("Automated QA test sweep triggered.", "success", 2000);
      });
    }

    const exportBtn = header.querySelector(".btn-qa-export");
    if (exportBtn) {
      exportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleExport();
      });
    }

    // Connect telemetry events and startup manager loop
    QAEvents.on("qa-metrics-updated", this.onMetricsUpdated);
    QAManagerInstance.start();

    return mainWrap;
  }

  handleMetricsUpdated(data) {
    if (!this.element || !data) return;
    this.metricsPanel.update(data.current);
    this.coveragePanel.update(data.current);
    this.integrationPanel.update(data.current);
    this.e2ePanel.update(data.current);
    this.desktopPanel.update(data.current);
  }

  handleExport() {
    if (window.Toast) window.Toast.show("QA diagnostics report copied to clipboard!", "success", 3000);
    const payload = {
      timestamp: new Date().toISOString(),
      history: QAManagerInstance.getHistory()
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(err => {
      console.error("Clipboard export failed:", err);
    });
  }

  destroy() {
    QAEvents.off("qa-metrics-updated", this.onMetricsUpdated);
    QAManagerInstance.stop();
  }
}
