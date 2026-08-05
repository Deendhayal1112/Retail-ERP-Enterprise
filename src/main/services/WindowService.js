/**
 * WindowService.js
 * Retail ERP Enterprise — Reusable Desktop Window Management Service
 *
 * Implements:
 * - Mock window lifecycle management (creation, size adjustments, focus/blur, close hooks)
 * - Decoupled from Electron APIs using mock placeholders
 * - Dependency Injection Ready
 */

"use strict";

export default class WindowService {
  /**
   * @param {Object} logger Logger instance
   */
  constructor(logger = console) {
    this.logger = logger;
    this.windows = new Map();
    this.logger.info("[WindowService] Service initialized. Ready for window lifecycle management.");
  }

  /**
   * Mock Window Creation
   * @param {string} id Window identifier
   * @param {Object} config Configurations map
   */
  createWindow(id, config = {}) {
    this.logger.info(`[WindowService] Creating mock window: "${id}" with config:`, config);
    const mockWindow = {
      id,
      config,
      isFocused: true,
      isVisible: true,
      loadURL: (url) => this.logger.info(`[WindowService] [MockWindow:${id}] URL loaded: ${url}`),
      focus: () => {
        mockWindow.isFocused = true;
        this.logger.info(`[WindowService] [MockWindow:${id}] Focused.`);
      },
      blur: () => {
        mockWindow.isFocused = false;
        this.logger.info(`[WindowService] [MockWindow:${id}] Focus lost.`);
      },
      close: () => {
        this.logger.info(`[WindowService] [MockWindow:${id}] Closing window...`);
        this.windows.delete(id);
      }
    };

    this.windows.set(id, mockWindow);
    return mockWindow;
  }

  /**
   * Get window by ID
   * @param {string} id Window identifier
   */
  getWindow(id) {
    return this.windows.get(id);
  }

  /**
   * Destroy all windows gracefully
   */
  destroyAllWindows() {
    this.logger.info("[WindowService] Destroying all active mock windows gracefully...");
    for (const [id, win] of this.windows.entries()) {
      win.close();
    }
  }
}
