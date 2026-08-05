/**
 * DistributionManager.js
 * Retail ERP Enterprise — Multi-channel Release Deployer Subsystem
 */

"use strict";

const { DistributionChannels } = require("./ReleaseConstants");

class DistributionManager {
  constructor() {
    this.targets = [
      { channel: DistributionChannels.INTERNAL_QA, active: true, deployedCount: 14, lastDeploy: "2026-08-01 10:00" },
      { channel: DistributionChannels.BETA, active: true, deployedCount: 8, lastDeploy: "2026-08-02 14:30" },
      { channel: DistributionChannels.STABLE, active: false, deployedCount: 2, lastDeploy: "2026-07-15 09:00" },
      { channel: DistributionChannels.ENTERPRISE, active: false, deployedCount: 0, lastDeploy: "N/A" }
    ];
  }

  async getChannels() {
    return this.targets;
  }

  async toggleChannel(channelName) {
    const target = this.targets.find(t => t.channel === channelName);
    if (!target) throw new Error("Distribution channel not found");
    target.active = !target.active;
    if (target.active) {
      target.lastDeploy = new Date().toISOString().slice(0, 16).replace("T", " ");
      target.deployedCount += 1;
    }
    return this.targets;
  }
}

module.exports = DistributionManager;
