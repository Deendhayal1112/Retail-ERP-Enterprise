/**
 * DocumentationManager.js
 * Retail ERP Enterprise — Guides & Manuals manager
 */

"use strict";

const { DocCategories } = require("./DocumentationConstants");

class DocumentationManager {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.userGuides = [
      { id: "quickstart", title: "Quick Start Guide", size: "1.2 MB", format: "PDF", type: DocCategories.USER },
      { id: "manual", title: "User Operation Manual", size: "4.8 MB", format: "PDF", type: DocCategories.USER },
      { id: "faq", title: "Frequently Asked Questions", size: "850 KB", format: "HTML", type: DocCategories.USER },
      { id: "release-notes", title: "v0.2.0 Release Notes", size: "420 KB", format: "PDF", type: DocCategories.USER }
    ];

    this.adminGuides = [
      { id: "install", title: "Installation & Requirements Guide", size: "2.1 MB", format: "PDF", type: DocCategories.ADMIN },
      { id: "backup", title: "Database Backup & Disaster Recovery Guide", size: "3.5 MB", format: "PDF", type: DocCategories.ADMIN },
      { id: "security", title: "Enterprise Firewall & GPO Policy Guide", size: "1.9 MB", format: "PDF", type: DocCategories.ADMIN }
    ];

    this.devGuides = [
      { id: "arch", title: "System Architecture & IPC Layers Outline", size: "5.4 MB", format: "PDF", type: DocCategories.DEVELOPER },
      { id: "standards", title: "JS & CSS Coding Standards Codebook", size: "1.1 MB", format: "PDF", type: DocCategories.DEVELOPER }
    ];

    this.isDownloading = false;
  }

  async getUserGuides() {
    return this.userGuides;
  }

  async getAdminGuides() {
    return this.adminGuides;
  }

  async getDevGuides() {
    return this.devGuides;
  }

  async runDownload(guideId) {
    if (this.isDownloading) {
      throw new Error("Another download task is active.");
    }
    this.isDownloading = true;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send("docs:download-progress", { guideId, progress });
      }

      if (progress >= 100) {
        clearInterval(interval);
        this.isDownloading = false;
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
          this.mainWindow.webContents.send("docs:download-completed", { guideId, success: true });
        }
      }
    }, 150);

    return { success: true, message: `Downloading guide ${guideId} started.` };
  }
}

module.exports = DocumentationManager;
