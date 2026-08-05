/**
 * ServiceRegistry.js
 * Retail ERP Enterprise — Desktop Services Dependency Injection Core Registry
 *
 * Implements:
 * - Central orchestrator for DI instantiation
 * - Life cycle hooks for service registry bootstrapping
 * - Decoupled mock architectures
 */

"use strict";

import WindowService from "./WindowService.js";
import MenuService from "./MenuService.js";
import TrayService from "./TrayService.js";
import FileService from "./FileService.js";
import BackupService from "./BackupService.js";
import RestoreService from "./RestoreService.js";
import PrintService from "./PrintService.js";
import PDFService from "./PDFService.js";
import UpdateService from "./UpdateService.js";
import NotificationService from "./NotificationService.js";
import IPCService from "./IPCService.js";

export default class ServiceRegistry {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.services = new Map();
  }

  /**
   * Bootstrap service dependencies
   */
  bootstrap() {
    this.logger.info("[ServiceRegistry] Bootstrapping all core desktop architectural services...");

    // 1. Core utilities
    this.register("ipc", new IPCService(this.logger));
    this.register("file", new FileService(this.logger));

    // 2. Hardware / OS Integration services
    this.register("window", new WindowService(this.logger));
    this.register("menu", new MenuService(this.logger));
    this.register("tray", new TrayService(this.logger));
    this.register("print", new PrintService(this.logger));
    this.register("pdf", new PDFService(this.logger));
    this.register("notification", new NotificationService(this.logger));

    // 3. Maintenance services
    this.register("backup", new BackupService(this.logger));
    this.register("restore", new RestoreService(this.logger));
    this.register("update", new UpdateService(this.logger));

    this.logger.info("[ServiceRegistry] Bootstrapping completed. All services registered successfully.");
  }

  /**
   * Register a service instance
   * @param {string} name     Service identifier key
   * @param {Object} instance Service class object
   */
  register(name, instance) {
    this.services.set(name, instance);
  }

  /**
   * Resolve a service dependency
   * @param {string} name Service identifier key
   */
  get(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service not found in registry: ${name}`);
    }
    return service;
  }
}
