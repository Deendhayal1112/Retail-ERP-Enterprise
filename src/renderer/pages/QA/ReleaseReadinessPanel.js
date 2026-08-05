/**
 * ReleaseReadinessPanel.js
 * Retail ERP Enterprise — Production Sign-Off & Go-Live recommendation
 */

"use strict";

export default class ReleaseReadinessPanel {
  constructor(options = {}) {
    this.options = options;
    this.readiness = options.readiness || {};
  }

  render() {
    const card = document.createElement("div");
    card.className = "qa-center-card col-span-12";
    card.innerHTML = `
      <h3 class="qa-center-card-title">Production Readiness & Go-Live Recommendation</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <!-- Left: Status list -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Stakeholders Approvals</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">QA Lead Sign-Off</span>
              <button class="verify-ready-btn" data-role="qaLeadApproved" style="height:26px; font-size:11px; padding:0 8px; border:1px solid #E9EDF5; border-radius:4px; font-weight:600; cursor:pointer; background-color:${this.readiness.qaLeadApproved ? "#D1FAE5" : "#FEF3C7"}; color:${this.readiness.qaLeadApproved ? "#065F46" : "#92400E"};">
                ${this.readiness.qaLeadApproved ? "APPROVED" : "PENDING"}
              </button>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">UAT Manager Sign-Off</span>
              <button class="verify-ready-btn" data-role="uatManagerApproved" style="height:26px; font-size:11px; padding:0 8px; border:1px solid #E9EDF5; border-radius:4px; font-weight:600; cursor:pointer; background-color:${this.readiness.uatManagerApproved ? "#D1FAE5" : "#FEF3C7"}; color:${this.readiness.uatManagerApproved ? "#065F46" : "#92400E"};">
                ${this.readiness.uatManagerApproved ? "APPROVED" : "PENDING"}
              </button>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Business Sponsor Sign-Off</span>
              <button class="verify-ready-btn" data-role="businessSponsorApproved" style="height:26px; font-size:11px; padding:0 8px; border:1px solid #E9EDF5; border-radius:4px; font-weight:600; cursor:pointer; background-color:${this.readiness.businessSponsorApproved ? "#D1FAE5" : "#FEF3C7"}; color:${this.readiness.businessSponsorApproved ? "#065F46" : "#92400E"};">
                ${this.readiness.businessSponsorApproved ? "APPROVED" : "PENDING"}
              </button>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Technical Lead Sign-Off</span>
              <button class="verify-ready-btn" data-role="technicalLeadApproved" style="height:26px; font-size:11px; padding:0 8px; border:1px solid #E9EDF5; border-radius:4px; font-weight:600; cursor:pointer; background-color:${this.readiness.technicalLeadApproved ? "#D1FAE5" : "#FEF3C7"}; color:${this.readiness.technicalLeadApproved ? "#065F46" : "#92400E"};">
                ${this.readiness.technicalLeadApproved ? "APPROVED" : "PENDING"}
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Sign-off rating details -->
        <div style="padding:16px; border:1px solid #E9EDF5; border-radius:12px; background-color:#F8FAFC; display:flex; flex-direction:column; gap:8px;">
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Go-Live Status Recommendation</span>
          ${this.readiness.qaLeadApproved && this.readiness.uatManagerApproved && this.readiness.businessSponsorApproved && this.readiness.technicalLeadApproved ? `
            <strong style="font-size:20px; color:#10B981; margin:4px 0 0 0;">RECOMMEND GO-LIVE</strong>
            <p style="margin:4px 0 0 0; font-size:12px; color:#6B7280;">All gates and validations successfully completed. Ready for production rollout.</p>
          ` : `
            <strong style="font-size:20px; color:#D97706; margin:4px 0 0 0;">PENDING VALIDATION GATES</strong>
            <p style="margin:4px 0 0 0; font-size:12px; color:#6B7280;">Awaiting approvals for pending gates. Check defect logs.</p>
          `}
        </div>
      </div>
    `;

    card.querySelectorAll(".verify-ready-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const role = btn.getAttribute("data-role");
        this.toggleVerify(role);
      });
    });

    return card;
  }

  async toggleVerify(role) {
    if (this.options.onToggle) {
      await this.options.onToggle(role);
    }
  }
}
