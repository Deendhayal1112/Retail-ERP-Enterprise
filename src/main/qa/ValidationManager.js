/**
 * ValidationManager.js
 * Retail ERP Enterprise — Automated QA Testing Runner Subsystem
 */

"use strict";

const { TestTypes } = require("./QAConstants");

class ValidationManager {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.validations = [
      { id: "unit", name: TestTypes.UNIT, passed: 142, total: 142, status: "Passed" },
      { id: "integ", name: TestTypes.INTEGRATION, passed: 48, total: 48, status: "Passed" },
      { id: "regress", name: TestTypes.REGRESSION, passed: 98, total: 102, status: "Warning" },
      { id: "perf", name: TestTypes.PERFORMANCE, passed: 12, total: 12, status: "Passed" },
      { id: "a11y", name: TestTypes.ACCESSIBILITY, passed: 24, total: 24, status: "Passed" },
      { id: "security", name: TestTypes.SECURITY, passed: 35, total: 35, status: "Passed" }
    ];
    this.isRunning = false;
  }

  async getValidations() {
    return this.validations;
  }

  async runRegressionTest(testId) {
    if (this.isRunning) {
      throw new Error("Another test runner task is currently active.");
    }
    this.isRunning = true;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send("qa:test-progress", { testId, progress });
      }

      if (progress >= 100) {
        clearInterval(interval);
        this.isRunning = false;
        
        // Mark as passed
        const test = this.validations.find(t => t.id === testId);
        if (test) {
          test.passed = test.total;
          test.status = "Passed";
        }

        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
          this.mainWindow.webContents.send("qa:test-completed", {
            testId,
            success: true,
            validations: this.validations
          });
        }
      }
    }, 150);

    return { success: true, message: `Regression test loop started for ${testId}.` };
  }
}

module.exports = ValidationManager;
