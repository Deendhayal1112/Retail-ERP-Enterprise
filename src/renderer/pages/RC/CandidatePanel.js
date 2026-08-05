/**
 * CandidatePanel.js
 * Retail ERP Enterprise — Release Candidate Parameter Panel
 */

"use strict";

export default class CandidatePanel {
  constructor(options = {}) {
    this.options = options;
    this.candidate = options.candidate || {};
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "rc-center-card col-span-12";
    card.innerHTML = `
      <h3 class="rc-center-card-title">Release Candidate Metadata</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <!-- Left: Details -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Active Build Parameters</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Version</span>
              <strong style="color:#1E293B;">v${this.candidate.version}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Build Number</span>
              <strong style="color:#1E293B;">#${this.candidate.buildNumber}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Release Channel</span>
              <strong style="color:#1E293B;">${this.candidate.channel}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Timestamp</span>
              <strong style="color:#1E293B;">${this.candidate.timestamp}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Status</span>
              <span class="rc-badge passed">${this.candidate.status}</span>
            </div>
          </div>
        </div>

        <!-- Right: Release Notes -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Release notes</h4>
          <textarea class="notes-textarea" style="width:100%; height:100px; border:1px solid #E9EDF5; border-radius:8px; padding:12px; font-size:13px; color:#1F2937; box-sizing:border-box; outline:none; resize:none;">${this.candidate.notes}</textarea>
          <button class="save-notes-btn" style="height:36px; padding:0 16px; border:none; background-color:#5B3DF5; color:#FFFFFF; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; margin-top:12px;">
            Save Notes
          </button>
        </div>
      </div>
    `;

    card.querySelector(".save-notes-btn").addEventListener("click", () => {
      const val = card.querySelector(".notes-textarea").value;
      this.saveNotes(val);
    });

    this.element = card;
    return card;
  }

  async saveNotes(notes) {
    if (this.options.onSaveNotes) {
      await this.options.onSaveNotes(notes);
    }
  }
}
