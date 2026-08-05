/**
 * SigningManager.js
 * Retail ERP Enterprise — Code Signing & Certificate Verification Subsystem
 */

"use strict";

const { SigningPlatforms } = require("./VersionConstants");

class SigningManager {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.signatures = [
      { platform: SigningPlatforms.WINDOWS_CODESIGN, verified: true, certOwner: "Retail ERP Ent. Ltd", timestamp: "2026-08-05 11:20" },
      { platform: SigningPlatforms.MACOS_NOTARIZATION, verified: true, certOwner: "Apple Developer ID", timestamp: "2026-08-05 11:25" },
      { platform: SigningPlatforms.LINUX_PACKAGE, verified: false, certOwner: "GPG Signer key", timestamp: "N/A" }
    ];
    this.isSigning = false;
  }

  async getSignatures() {
    return this.signatures;
  }

  async runSigning(platform) {
    if (this.isSigning) {
      throw new Error("Another signing task is currently active.");
    }

    this.isSigning = true;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send("signing:progress", { platform, progress });
      }

      if (progress >= 100) {
        clearInterval(interval);
        this.isSigning = false;
        
        // Mark as verified
        const sig = this.signatures.find(s => s.platform === platform);
        if (sig) {
          sig.verified = true;
          sig.timestamp = new Date().toISOString().slice(0, 16).replace("T", " ");
        }

        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
          this.mainWindow.webContents.send("signing:completed", {
            platform,
            success: true,
            signatures: this.signatures
          });
        }
      }
    }, 150);

    return { success: true, message: `Signing started for ${platform}.` };
  }
}

module.exports = SigningManager;
