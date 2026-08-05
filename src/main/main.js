"use strict";

/**
 * main.js
 * Retail ERP Enterprise — Electron Main Process Entry Point
 *
 * Bootstraps the Electron application shell, validates centralized configurations,
 * secures single-instance locks, and handles lifecycle events.
 *
 * Phase 1 — Step 4: Application Configuration Integration
 */

// Load environment configuration and secrets
require("../config/secrets");

const { app, ipcMain } = require("electron");
const appConfig = require("../config/app.config");
const logger = require("../shared/logger/logger");
const errorHandler = require("../shared/errors/errorHandler");
const windowManager = require("./managers/windowManager");

// 1. Validate Centralized Application Configuration before boot
try {
  appConfig.validate();
  logger.info("Centralized configurations validated successfully. ✅");
} catch (err) {
  // Config error is fatal, log it and shut down immediately
  logger.error(`FATAL: Configuration validation failed: ${err.message}`);
  process.exit(1);
}

// 2. Register Global Process Error Listeners
errorHandler.registerProcessErrorHandlers();

logger.info(
  `Bootstrapping ${appConfig.app.name} v${appConfig.app.version} in [${appConfig.app.environment}] mode...`,
);

// 3. Enforce Single Instance Lock
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  logger.warn("Another instance is already running. Exiting.");
  app.quit();
  process.exit(0);
}

// 4. Register Shutdown Hook for Graceful Exit
process.on("graceful-shutdown", (exitCode = 0) => {
  logger.info("Graceful shutdown initiated. Cleaning up resources...");

  // Close all open windows
  windowManager.closeAllWindows();

  // Gracefully release SQLite connection and pragmas
  try {
    const database = require("../backend/database");
    database.close();
  } catch (err) {
    logger.error(`Error closing database during shutdown: ${err.message}`);
  }

  logger.info("Shutdown complete. Goodbye.");
  app.quit();
  process.exit(exitCode);
});

// 5. Register Whitelisted IPC Event Handlers

/**
 * Validates the IPC sender to ensure it is a trusted local frame.
 * @param {Electron.IpcMainInvokeEvent|Electron.IpcMainEvent} event Electron IPC event.
 */
const validateSender = (event) => {
  if (!event || !event.sender) {
    throw new Error("Invalid IPC event context.");
  }
  
  // Use event.senderFrame if available (more secure), otherwise fallback to sender.getURL()
  const url = event.senderFrame ? event.senderFrame.url : event.sender.getURL();
  
  if (!url) {
    logger.warn("Security Alert: Blocked IPC message due to missing sender URL.");
    throw new Error("Access Denied: Missing sender origin.");
  }

  const isLocalFile = url.startsWith("file://");
  const isDevTools = url.startsWith("chrome-extension://") || url.startsWith("devtools://");

  if (!isLocalFile && (!isDevTools || appConfig.isProduction)) {
    logger.warn(`Security Alert: Blocked IPC message from unauthorized origin: ${url}`);
    throw new Error("Access Denied: Unauthorized IPC origin.");
  }
};

// Return read-only metadata to sandboxed renderer processes
ipcMain.handle("app:get-info", (event) => {
  validateSender(event);
  return {
    name: appConfig.app.name,
    version: appConfig.app.version,
    environment: appConfig.app.environment,
  };
});

// Window minimizes handler
ipcMain.on("window:minimize", (event) => {
  validateSender(event);
  const win = windowManager.getMainWindow();
  if (win) {
    win.minimize();
  }
});

// Window maximizes/unmaximizes handler
ipcMain.on("window:maximize", (event) => {
  validateSender(event);
  const win = windowManager.getMainWindow();
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

// Window close handler
ipcMain.on("window:close", (event) => {
  validateSender(event);
  const win = windowManager.getMainWindow();
  if (win) {
    win.close();
  }
});

// Return current maximized status
ipcMain.handle("window:is-maximized", (event) => {
  validateSender(event);
  const win = windowManager.getMainWindow();
  return win ? win.isMaximized() : false;
});

// Safe logging delegation handler
ipcMain.on("log:write", (event, payload) => {
  validateSender(event);
  const { level, message, meta } = payload || {};
  const cleanMeta = { source: "renderer", ...meta };

  switch (level) {
    case "debug":
      logger.debug(message, cleanMeta);
      break;
    case "warn":
      logger.warn(message, cleanMeta);
      break;
    case "error":
      logger.error(message, cleanMeta);
      break;
    case "info":
    default:
      logger.info(message, cleanMeta);
      break;
  }
});

// 6. Electron App Lifecycle Listeners

app.whenReady().then(() => {
  logger.info("Electron app ready event fired.");
  logger.info("Environment verification complete. Main process running.");

  // Register authentication IPC handler bindings
  const { registerAuthIpcHandlers } = require("./ipc/auth.ipc");
  registerAuthIpcHandlers();

  // Register background task IPC handler bindings
  const { registerBackgroundIpcHandlers } = require("./ipc/background.ipc");
  registerBackgroundIpcHandlers();

  // Initialize Security, Compliance, and Audit Managers
  try {
    const securityManager = require("./security/SecurityManager");
    const complianceManager = require("./security/ComplianceManager");
    const auditManager = require("./security/AuditManager");
    const securityReportManager = require("./security/SecurityReportManager");

    securityManager.initialize();
    complianceManager.initialize();
    auditManager.initialize();
    securityReportManager.initialize();
    logger.info("Security subsystems successfully initialized. ✅");
  } catch (err) {
    logger.error(`Failed to initialize security subsystems: ${err.message}`);
  }

  // Initialize Release and Distribution Managers
  try {
    const PackagingManager = require("./release/PackagingManager");
    const DistributionManager = require("./release/DistributionManager");
    const InstallerManager = require("./release/InstallerManager");
    const ReleaseArtifactManager = require("./release/ReleaseArtifactManager");
    const VersionManager = require("./release/VersionManager");
    const SigningManager = require("./release/SigningManager");
    const RollbackManager = require("./release/RollbackManager");
    const ReleaseMetadataManager = require("./release/ReleaseMetadataManager");
    const ReleaseManager = require("./release/ReleaseManager");
    const ReleaseEvents = require("./release/ReleaseEvents");

    const packagingMgr = new PackagingManager(null);
    const distributionMgr = new DistributionManager();
    const installerMgr = new InstallerManager();
    const releaseArtifactMgr = new ReleaseArtifactManager();
    const versionMgr = new VersionManager();
    const signingMgr = new SigningManager(null);
    const rollbackMgr = new RollbackManager();
    const releaseMetadataMgr = new ReleaseMetadataManager();
    const releaseMgr = new ReleaseManager();

    // Register handlers via ReleaseEvents helper
    ReleaseEvents.register({
      "release:start-package": async (event, format) => {
        validateSender(event);
        packagingMgr.mainWindow = windowManager.getMainWindow();
        return await packagingMgr.runPackage(format);
      },
      "release:get-artifacts": async (event) => {
        validateSender(event);
        return await releaseArtifactMgr.getArtifacts();
      },
      "release:get-channels": async (event) => {
        validateSender(event);
        return await distributionMgr.getChannels();
      },
      "release:get-validations": async (event) => {
        validateSender(event);
        return await installerMgr.getValidations();
      },
      "release:get-manifest": async (event) => {
        validateSender(event);
        return await releaseArtifactMgr.getManifest();
      },
      "release:toggle-validation": async (event, id) => {
        validateSender(event);
        return await installerMgr.toggleValidation(id);
      },
      "release:toggle-channel": async (event, channel) => {
        validateSender(event);
        return await distributionMgr.toggleChannel(channel);
      },
      "release:compile-manifest": async (event, data) => {
        validateSender(event);
        return await releaseArtifactMgr.compileManifestReport(data);
      },
      "version:get-info": async (event) => {
        validateSender(event);
        return await versionMgr.getVersionInfo();
      },
      "version:get-history": async (event) => {
        validateSender(event);
        return await versionMgr.getVersionHistory();
      },
      "version:promote": async (event, targetSemVer) => {
        validateSender(event);
        return await versionMgr.promoteBuild(targetSemVer);
      },
      "signing:get-signatures": async (event) => {
        validateSender(event);
        return await signingMgr.getSignatures();
      },
      "signing:start": async (event, platform) => {
        validateSender(event);
        signingMgr.mainWindow = windowManager.getMainWindow();
        return await signingMgr.runSigning(platform);
      },
      "rollback:get-archives": async (event) => {
        validateSender(event);
        return await rollbackMgr.getArchives();
      },
      "rollback:trigger-rollback": async (event, version) => {
        validateSender(event);
        return await rollbackMgr.triggerRollback(version);
      },
      "release:get-changelogs": async (event) => {
        validateSender(event);
        return await releaseMetadataMgr.getChangelogs();
      },
      "release:compile-metadata": async (event, data) => {
        validateSender(event);
        return await releaseMetadataMgr.compileReleaseMetadata(data);
      },
      "release:get-lifecycle-state": async (event) => {
        validateSender(event);
        return await releaseMgr.getReleaseState();
      },
      "release:promote-lifecycle-state": async (event, newState) => {
        validateSender(event);
        return await releaseMgr.promoteLifecycleState(newState);
      }
    });

    logger.info("Release and Versioning subsystems successfully initialized. ✅");
  } catch (err) {
    logger.error(`Failed to initialize release subsystems: ${err.message}`);
  }

  // Initialize Documentation and Training Subsystem
  try {
    const DocumentationManager = require("./docs/DocumentationManager");
    const HelpCenterManager = require("./docs/HelpCenterManager");
    const KnowledgeBaseManager = require("./docs/KnowledgeBaseManager");
    const TrainingManager = require("./docs/TrainingManager");
    const DocumentationEvents = require("./docs/DocumentationEvents");

    const docsMgr = new DocumentationManager(null);
    const helpMgr = new HelpCenterManager();
    const kbMgr = new KnowledgeBaseManager();
    const trainingMgr = new TrainingManager();

    DocumentationEvents.register({
      "docs:get-user-guides": async (event) => {
        validateSender(event);
        return await docsMgr.getUserGuides();
      },
      "docs:get-admin-guides": async (event) => {
        validateSender(event);
        return await docsMgr.getAdminGuides();
      },
      "docs:get-dev-guides": async (event) => {
        validateSender(event);
        return await docsMgr.getDevGuides();
      },
      "docs:run-download": async (event, guideId) => {
        validateSender(event);
        docsMgr.mainWindow = windowManager.getMainWindow();
        return await docsMgr.runDownload(guideId);
      },
      "help:ask-ai": async (event, query) => {
        validateSender(event);
        return await helpMgr.askAIAssistant(query);
      },
      "training:get-courses": async (event) => {
        validateSender(event);
        return await trainingMgr.getCourses();
      },
      "training:start-tour": async (event) => {
        validateSender(event);
        return await trainingMgr.startInteractiveTour();
      },
      "training:enroll": async (event, courseId) => {
        validateSender(event);
        return await trainingMgr.enrollCourse(courseId);
      },
      "training:update-progress": async (event, courseId, increment) => {
        validateSender(event);
        return await trainingMgr.updateCourseProgress(courseId, increment);
      }
    });

    logger.info("Documentation & User Training subsystems successfully initialized. ✅");
  } catch (err) {
    logger.error(`Failed to initialize documentation subsystems: ${err.message}`);
  }

  // Create primary application main window
  windowManager.createMainWindow();

  if (appConfig.electron.isDev) {
    logger.info("Main window launched successfully.");
  }
});

// Second instance triggered handler
app.on("second-instance", (_event, _commandLine, _workingDirectory) => {
  logger.warn("Second instance execution attempted. Focusing main window.");
  // Restore and focus the existing main window
  windowManager.createMainWindow();
});

// Quit when all windows are closed (standard Electron behavior)
app.on("window-all-closed", () => {
  logger.info("All application windows closed.");
  if (process.platform !== "darwin") {
    process.emit("graceful-shutdown", 0);
  }
});

app.on("activate", () => {
  logger.info("App activate event fired (macOS).");
  // macOS dock icon clicked recreate window logic
  windowManager.createMainWindow();
});

app.on("before-quit", () => {
  logger.info("App before-quit event fired.");
});

app.on("will-quit", () => {
  logger.info("App will-quit event fired.");
  try {
    const database = require("../backend/database");
    database.close();
  } catch (err) {
    logger.error(`Error closing database on will-quit: ${err.message}`);
  }
});
