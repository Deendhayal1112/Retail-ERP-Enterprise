/**
 * ReleaseManager.js
 * Retail ERP Enterprise — Primary Release Lifecycle Orchestrator
 */

"use strict";

const { LifecycleStates } = require("./VersionConstants");

class ReleaseManager {
  constructor() {
    this.currentState = LifecycleStates.BETA;
  }

  async getReleaseState() {
    return this.currentState;
  }

  async promoteLifecycleState(newState) {
    if (!Object.values(LifecycleStates).includes(newState)) {
      throw new Error(`Invalid lifecycle state: ${newState}`);
    }
    this.currentState = newState;
    return { success: true, state: this.currentState };
  }
}

module.exports = ReleaseManager;
