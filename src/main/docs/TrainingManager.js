/**
 * TrainingManager.js
 * Retail ERP Enterprise — Operator Interactive Tour & Courses Subsystem
 */

"use strict";

class TrainingManager {
  constructor() {
    this.courses = [
      { id: "basic_ops", name: "POS Terminal Checkout Operations", duration: "45 mins", progressPercent: 100, completed: true },
      { id: "inv_mgmt", name: "Inventory Stock Audits & Ledger Codes", duration: "1.5 hours", progressPercent: 35, completed: false },
      { id: "sys_diag", name: "Diagnostics, SQLite Tuning & Logs Audit", duration: "2 hours", progressPercent: 0, completed: false }
    ];
    
    this.tourSteps = [
      { step: 1, title: "Welcome & Setup", message: "Connect database file and check license validation status." },
      { step: 2, title: "Operations Hub", message: "Review transaction metrics ledger and cash balances cards." },
      { step: 3, title: "System Diagnostics", message: "Monitor renderer thread loops and tune cache PRAGMAs." }
    ];
  }

  async getCourses() {
    return this.courses;
  }

  async startInteractiveTour() {
    return {
      success: true,
      steps: this.tourSteps
    };
  }

  async enrollCourse(courseId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) throw new Error("Target training course not found.");
    course.progressPercent = 10;
    return { success: true, course };
  }

  async updateCourseProgress(courseId, increment) {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      course.progressPercent = Math.min(100, course.progressPercent + increment);
      if (course.progressPercent === 100) course.completed = true;
    }
    return { success: true, course };
  }
}

module.exports = TrainingManager;
