/**
 * ReleaseConstants.js
 * Retail ERP Enterprise — Distribution & Release Management Constants
 */

"use strict";

const PackagingFormats = {
  WINDOWS_NSIS: "Windows NSIS",
  WINDOWS_PORTABLE: "Windows Portable",
  MACOS_DMG: "macOS DMG",
  MACOS_ZIP: "macOS ZIP",
  LINUX_APPIMAGE: "Linux AppImage",
  LINUX_DEB_RPM: "Linux DEB/RPM"
};

const ValidationPhases = {
  FRESH_INSTALL: "Fresh Install",
  UPGRADE: "Upgrade",
  REPAIR: "Repair",
  SILENT_INSTALL: "Silent Install",
  UNINSTALL: "Uninstall",
  DATA_PRESERVATION: "Data Preservation"
};

const DistributionChannels = {
  INTERNAL_QA: "Internal QA",
  BETA: "Beta",
  STABLE: "Stable",
  ENTERPRISE: "Enterprise",
  OFFLINE: "Offline Distribution",
  ARTIFACT_REPO: "Artifact Repository"
};

module.exports = {
  PackagingFormats,
  ValidationPhases,
  DistributionChannels
};
