/**
 * DeploymentManager.js
 * Retail ERP Enterprise — Deployment Operations & Logs Subsystem
 */

"use strict";

class DeploymentManager {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.history = [
      { id: "DEP-105", version: "0.2.0-beta", environment: "Staging", date: "2026-08-05 14:10", status: "Success" },
      { id: "DEP-104", version: "0.1.9-alpha", environment: "Testing", date: "2026-07-28 09:45", status: "Success" },
      { id: "DEP-101", version: "0.1.5", environment: "Production", date: "2026-07-10 23:15", status: "Rollback" }
    ];
    this.isDeploying = false;
  }

  async getHistory() {
    return this.history;
  }

  async runDeployment(environment, version) {
    if (this.isDeploying) {
      throw new Error("Another deployment execution is currently active.");
    }
    this.isDeploying = true;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send("deploy:progress", { environment, progress });
      }

      if (progress >= 100) {
        clearInterval(interval);
        this.isDeploying = false;
        
        // Add new entry to history
        const newDepId = `DEP-${Math.floor(106 + Math.random() * 50)}`;
        this.history.unshift({
          id: newDepId,
          version,
          environment,
          date: new Date().toISOString().slice(0, 16).replace("T", " "),
          status: "Success"
        });

        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
          this.mainWindow.webContents.send("deploy:completed", {
            environment,
            success: true,
            history: this.history
          });
        }
      }
    }, 150);

    return { success: true, message: `Deployment started on ${environment}.` };
  }
}

module.exports = DeploymentManager;
