/**
 * PackagingManager.js
 * Retail ERP Enterprise — Simulated Installer Packaging Subsystem
 */

"use strict";

class PackagingManager {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.activeJobs = new Map();
  }

  async runPackage(format) {
    if (this.activeJobs.has(format)) {
      throw new Error(`Packaging job for ${format} is already in progress.`);
    }

    this.activeJobs.set(format, true);
    
    // Simulate step progress intervals
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send("release:package-progress", {
          format,
          progress
        });
      }

      if (progress >= 100) {
        clearInterval(interval);
        this.activeJobs.delete(format);
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
          this.mainWindow.webContents.send("release:package-completed", {
            format,
            success: true,
            filePath: `dist/installers/Retail_ERP_v0.2.0_${format.replace(/\s+/g, "_")}.exe`
          });
        }
      }
    }, 150);

    return { success: true, message: `Compilation started for ${format}.` };
  }
}

module.exports = PackagingManager;
