"use strict";

/**
 * windowManager.js
 * Retail ERP Enterprise — Window Management Subsystem
 *
 * Responsible for managing Electron BrowserWindow instances, preserving window state,
 * handling lifecycle events, and enforcing security policies on the web preferences.
 * Designed with a multi-window registry architecture.
 *
 * Phase 1 — Step 4: Application Configuration Integration
 */

const { BrowserWindow, Menu } = require("electron");
const path = require("path");
const { URL } = require("url");
const Store = require("electron-store");
const appConfig = require("../../config/app.config");
const logger = require("../../shared/logger/logger");

// Initialize electron-store for window state persistence
const store = new Store({ name: "window-state" });

class WindowManager {
  constructor() {
    // Registry of active windows
    this.windows = new Map();
  }

  /**
   * Creates the primary application main window.
   * If it already exists, focuses on it.
   */
  createMainWindow() {
    if (this.windows.has("main")) {
      const existingWindow = this.windows.get("main");
      if (existingWindow.isMinimized()) {
        existingWindow.restore();
      }
      existingWindow.focus();
      return existingWindow;
    }

    logger.info("Creating main application window...");

    // Load persisted window bounds or fallback to defaults
    const bounds = this._getPersistedBounds();

    // BrowserWindow instance configuration
    const mainWindow = new BrowserWindow({
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      minWidth: appConfig.window.minWidth,
      minHeight: appConfig.window.minHeight,
      title: appConfig.window.title,
      center: bounds.x === undefined || bounds.y === undefined,
      show: false, // Show only after ready-to-show to prevent visual flicker
      frame: appConfig.window.frame,
      resizable: appConfig.window.resizable,
      webPreferences: {
        preload: path.join(__dirname, "../preload/preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        devTools: appConfig.electron.isDev,
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false,
        enableRemoteModule: false,
      },
    });

    // Enforce default session permission restrictions (deny geolocation, camera, etc.)
    const { session } = require("electron");
    if (session && session.defaultSession) {
      session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
        logger.warn(`Security Alert: Denied permission request for: "${permission}"`);
        callback(false);
      });
    }

    // Restrict main frame navigation to trusted local pages only
    mainWindow.webContents.on("will-navigate", (event, url) => {
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== "file:" && parsedUrl.protocol !== "devtools:") {
          logger.warn(`Security Warning: Blocked unauthorized navigation attempt to: "${url}"`);
          event.preventDefault();
        }
      } catch (err) {
        logger.error(`Error parsing navigation URL: ${err.message}`);
        event.preventDefault();
      }
    });

    // Restrict opening new browser windows (e.g. window.open)
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      logger.warn(`Security Warning: Blocked unauthorized window.open request to: "${url}"`);
      return { action: "deny" };
    });

    // Enforce Menu Bar configuration
    if (appConfig.isProduction) {
      Menu.setApplicationMenu(null);
      mainWindow.setMenuBarVisibility(false);
    } else {
      mainWindow.setAutoHideMenuBar(true);
    }

    // Register instance in our map
    this.windows.set("main", mainWindow);

    // Load the HTML shell
    const indexPath = path.join(__dirname, "../../renderer/index.html");
    mainWindow
      .loadFile(indexPath)
      .then(() => {
        logger.info(`Loaded index.html path: ${indexPath}`);
      })
      .catch((err) => {
        logger.error(`Failed to load index.html: ${err.message}`, {
          stack: err.stack,
        });
      });

    // ─────────────────────────────────────────────────────────────────
    // Register Window Event Listeners
    // ─────────────────────────────────────────────────────────────────

    // ready-to-show event (graceful window show)
    mainWindow.once("ready-to-show", () => {
      logger.info("Main window ready-to-show event received.");
      mainWindow.show();
      mainWindow.focus();
    });

    // state change event - resize/move to persist window bounds
    const saveState = () => {
      try {
        if (
          !mainWindow.isDestroyed() &&
          !mainWindow.isMaximized() &&
          !mainWindow.isMinimized()
        ) {
          const currentBounds = mainWindow.getBounds();
          store.set("main-bounds", currentBounds);
        }
      } catch (err) {
        logger.error(`Error saving window state: ${err.message}`);
      }
    };

    mainWindow.on("resize", saveState);
    mainWindow.on("move", saveState);

    // Maximization events forwarding to renderer via context bridge channel
    mainWindow.on("maximize", () => {
      logger.debug("Main window maximized.");
      mainWindow.webContents.send("window:maximized-changed", true);
    });

    mainWindow.on("unmaximize", () => {
      logger.debug("Main window unmaximized.");
      mainWindow.webContents.send("window:maximized-changed", false);
    });

    // Focus / Blur tracking
    mainWindow.on("focus", () => {
      logger.debug("Main window focused.");
    });

    mainWindow.on("blur", () => {
      logger.debug("Main window lost focus.");
    });

    // Closed event
    mainWindow.on("closed", () => {
      logger.info("Main window closed event received.");
      this.windows.delete("main");
    });

    return mainWindow;
  }

  /**
   * Retrieves the main window instance if active.
   */
  getMainWindow() {
    return this.windows.get("main");
  }

  /**
   * Close all active window instances in the registry.
   */
  closeAllWindows() {
    logger.info("Closing all registered windows...");
    for (const [name, win] of this.windows.entries()) {
      if (!win.isDestroyed()) {
        win.close();
      }
      this.windows.delete(name);
    }
  }

  /**
   * Private helper to fetch persisted bounds from store.
   */
  _getPersistedBounds() {
    const defaultWidth = appConfig.window.width;
    const defaultHeight = appConfig.window.height;

    try {
      const saved = store.get("main-bounds");
      if (saved) {
        return {
          width: saved.width || defaultWidth,
          height: saved.height || defaultHeight,
          x: saved.x,
          y: saved.y,
        };
      }
    } catch (err) {
      logger.warn(
        `Failed to read window state cache: ${err.message}. Using defaults.`,
      );
    }

    return { width: defaultWidth, height: defaultHeight };
  }
}

// Export singleton instance of WindowManager
module.exports = new WindowManager();
