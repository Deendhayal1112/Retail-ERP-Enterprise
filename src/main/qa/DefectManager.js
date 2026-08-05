/**
 * DefectManager.js
 * Retail ERP Enterprise — Bug Tracking & Defect logs manager
 */

"use strict";

const { DefectPriorities } = require("./QAConstants");

class DefectManager {
  constructor() {
    this.bugs = [
      { id: "BUG-201", title: "Sales receipt alignment margins cut off on 80mm printers", priority: DefectPriorities.HIGH, status: "Open" },
      { id: "BUG-202", title: "averageQueryTimeMs Telemetry metric fails to log PRAGMAs Synchronous state", priority: DefectPriorities.CRITICAL, status: "Retested" },
      { id: "BUG-205", title: "Theme list font colors does not load correctly in low contrast accessibility audits", priority: DefectPriorities.LOW, status: "Resolved" }
    ];
  }

  async getBugs() {
    return this.bugs;
  }

  async resolveBug(bugId) {
    const bug = this.bugs.find(b => b.id === bugId);
    if (!bug) throw new Error("Target defect log not found.");
    bug.status = bug.status === "Resolved" ? "Open" : "Resolved";
    return { success: true, bugs: this.bugs };
  }
}

module.exports = DefectManager;
