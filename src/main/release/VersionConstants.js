/**
 * VersionConstants.js
 * Retail ERP Enterprise — Version Control & Code Signing Constants
 */

"use strict";

const LifecycleStates = {
  DEVELOPMENT: "Development",
  ALPHA: "Alpha",
  BETA: "Beta",
  RELEASE_CANDIDATE: "Release Candidate",
  STABLE: "Stable",
  LTS: "LTS"
};

const SigningPlatforms = {
  WINDOWS_CODESIGN: "Windows Code Signing",
  MACOS_NOTARIZATION: "macOS Notarization",
  LINUX_PACKAGE: "Linux Package Signing"
};

module.exports = {
  LifecycleStates,
  SigningPlatforms
};
