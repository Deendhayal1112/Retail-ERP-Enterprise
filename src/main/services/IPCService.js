/**
 * IPCService.js
 * Retail ERP Enterprise — Reusable Desktop Secure IPC Communications Service
 *
 * Implements:
 * - Mock Secure IPC channels registering and validation
 * - Decoupled from Electron APIs using mock placeholders
 * - Dependency Injection Ready
 */

"use strict";

export default class IPCService {
  /**
   * @param {Object} logger Logger instance
   */
  constructor(logger = console) {
    this.logger = logger;
    this.handlers = new Map();
    this.allowedChannels = new Set([
      "auth:login",
      "auth:logout",
      "settings:load",
      "settings:save",
      "backup:create",
      "backup:restore",
      "print:send",
      "pdf:generate",
      "update:check"
    ]);
    this.logger.info("[IPCService] Service initialized. Ready for secure IPC channel registrations.");
  }

  /**
   * Safe registration of an IPC handler
   * @param {string}   channel  IPC channel name string
   * @param {Function} listener Callback response mapping handler
   */
  registerHandler(channel, listener) {
    if (!this.allowedChannels.has(channel)) {
      this.logger.warn(`[IPCService] Blocked registration attempt on unauthorized channel: "${channel}"`);
      throw new Error(`Unauthorized IPC channel registration: ${channel}`);
    }

    this.logger.info(`[IPCService] Registering handler for secure channel: "${channel}"`);
    this.handlers.set(channel, listener);
  }

  /**
   * Simulate sending a message through the secure bridge
   * @param {string} channel IPC channel name
   * @param {Object} payload Query parameter parameters
   */
  simulateIPCMessage(channel, payload = {}) {
    this.logger.info(`[IPCService] Simulating message on channel: "${channel}" with payload:`, payload);
    const handler = this.handlers.get(channel);
    if (!handler) {
      this.logger.warn(`[IPCService] No handler registered for channel: "${channel}"`);
      return Promise.reject(new Error(`No handler registered for channel: ${channel}`));
    }
    return Promise.resolve(handler(payload));
  }
}
