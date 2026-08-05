/**
 * SecurityRecommendations.js
 * Retail ERP Enterprise — Vulnerability Assessment & Remediation Recommendations
 */

"use strict";

export default class SecurityRecommendations {
  constructor(options = {}) {
    this.options = options;
    this.findings = options.findings || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "security-card col-span-12";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h3 class="security-card-title" style="margin:0;">Vulnerability Remediation Guidelines</h3>
        <button class="download-report-btn" style="height:36px; padding:0 16px; background-color:#5B3DF5; color:#FFFFFF; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">
          Download PDF Report
        </button>
      </div>
      <div class="findings-list" style="display:flex; flex-direction:column; gap:16px;"></div>
    `;

    const list = card.querySelector(".findings-list");
    if (this.findings.length === 0) {
      list.innerHTML = `<p style="font-size:13px; color:#6B7280; text-align:center; padding:16px 0;">No active vulnerabilities detected.</p>`;
    } else {
      this.findings.forEach(finding => {
        const row = document.createElement("div");
        row.style.border = "1px solid #E9EDF5";
        row.style.borderRadius = "12px";
        row.style.padding = "16px";
        row.style.display = "flex";
        row.style.flexDirection = "column";
        row.style.gap = "8px";

        const badgeClass = finding.severity.toLowerCase();

        row.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="severity-badge ${badgeClass}">${finding.severity}</span>
              <strong style="font-size:14px; color:#1E293B;">${finding.title}</strong>
            </div>
            <span style="font-size:11px; font-weight:600; color:#64748B;">Category: ${finding.category}</span>
          </div>
          <p style="margin:0; font-size:13px; color:#475569;">${finding.description}</p>
          <div style="background-color:#F8FAFC; border:1px solid #E9EDF5; border-radius:8px; padding:10px; font-size:12px; margin-top:4px;">
            <span style="color:#5B3DF5; font-weight:700; display:block; margin-bottom:4px;">Remediation Rule:</span>
            <code style="color:#1E293B; font-family:monospace;">${finding.recommendation}</code>
          </div>
        `;
        list.appendChild(row);
      });
    }

    // Bind report download button
    card.querySelector(".download-report-btn").addEventListener("click", () => {
      this.downloadReport();
    });

    return card;
  }

  async downloadReport() {
    try {
      const result = await window.api.ipc.invoke("security:download-report", {
        findings: this.findings,
        compliance: this.options.complianceChecklists
      });
      if (result && result.success) {
        alert(`Security report successfully compiled and saved to: ${result.filePath}`);
      }
    } catch (err) {
      console.error("Report download error:", err);
    }
  }
}
