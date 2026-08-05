/**
 * QAStatusPanel.js
 * Retail ERP Enterprise — Automated QA Testing Dashboard Panel
 */

"use strict";

export default class QAStatusPanel {
  constructor(options = {}) {
    this.options = options;
    this.validations = options.validations || [];
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "qa-center-card col-span-12";
    card.innerHTML = `
      <h3 class="qa-center-card-title">Automated Validation Suites</h3>
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="test-progress-wrap" style="display:none; padding:16px; border:1px solid #E9EDF5; border-radius:12px; background-color:#F8FAFC;">
          <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; color:#1E293B;">
            <span class="test-label">Running tests...</span>
            <span class="test-percentage">0%</span>
          </div>
          <div style="width:100%; height:10px; background-color:#E9EDF5; border-radius:6px; overflow:hidden; margin-top:10px;">
            <div class="test-progress-fill" style="height:100%; background-color:#5B3DF5; width:0%; transition:width 200ms ease;"></div>
          </div>
        </div>

        <div class="validations-list-container" style="display:grid; grid-template-columns:1fr; gap:16px;"></div>
      </div>
    `;

    const container = card.querySelector(".validations-list-container");
    this.validations.forEach(t => {
      const row = document.createElement("div");
      row.className = "qa-row-item";
      row.innerHTML = `
        <div>
          <strong style="color:#1E293B; font-size:14px; display:block;">${t.name}</strong>
          <span style="font-size:12px; color:#6B7280;">Assertions: ${t.passed} / ${t.total} Passed</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span class="qa-badge ${t.status.toLowerCase()}">${t.status}</span>
          <button class="run-test-btn" data-id="${t.id}" style="height:32px; padding:0 12px; border:1px solid #E9EDF5; background-color:#FFFFFF; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; color:#1E293B;">
            Run Tests
          </button>
        </div>
      `;

      row.querySelector(".run-test-btn").addEventListener("click", () => {
        this.runTest(t.id, t.name);
      });

      container.appendChild(row);
    });

    this.element = card;
    return card;
  }

  async runTest(testId, name) {
    const progressWrap = this.element.querySelector(".test-progress-wrap");
    const progressFill = this.element.querySelector(".test-progress-fill");
    const progressLabel = this.element.querySelector(".test-label");
    const progressPerc = this.element.querySelector(".test-percentage");

    progressLabel.textContent = `Running ${name}...`;
    progressPerc.textContent = "0%";
    progressFill.style.width = "0%";
    progressWrap.style.display = "block";

    const removeProgressListener = window.api.ipc.on("qa:test-progress", (data) => {
      if (data.testId === testId) {
        progressPerc.textContent = `${data.progress}%`;
        progressFill.style.width = `${data.progress}%`;
      }
    });

    const removeCompleteListener = window.api.ipc.on("qa:test-completed", (data) => {
      if (data.testId === testId) {
        progressPerc.textContent = "100%";
        progressFill.style.width = "100%";
        
        setTimeout(() => {
          progressWrap.style.display = "none";
          alert(`Automated validation suite "${name}" completed successfully! All assertions verified.`);
          
          if (this.options.onTestComplete) {
            this.options.onTestComplete(data.validations);
          }

          removeProgressListener();
          removeCompleteListener();
        }, 500);
      }
    });

    try {
      await window.api.ipc.invoke("qa:run-regression-test", testId);
    } catch (err) {
      console.error("Test execution failed:", err);
      progressWrap.style.display = "none";
      removeProgressListener();
      removeCompleteListener();
    }
  }
}
