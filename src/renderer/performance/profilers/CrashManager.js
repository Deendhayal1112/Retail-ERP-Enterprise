/**
 * CrashManager.js
 * Retail ERP Enterprise — Unhandled Exception and Crash Handler Simulator
 */

"use strict";

export default class CrashManager {
  collect() {
    return {
      crashesCount: 0,
      lastCrashTime: null,
      unhandledExceptions: []
    };
  }
}
