/**
 * ScenarioSimulationPanel.js
 * Retail ERP Enterprise — Scenario simulation playground with reactive outputs
 */

"use strict";

export default class ScenarioSimulationPanel {
  constructor(options = {}) {
    this.options = options;
    this.initialData = options.initialData || {};
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "forecast-card col-span-12";
    this.element = card;

    this.updateContent(this.initialData);
    return card;
  }

  updateContent(data) {
    const cases = data.cases || {};
    const risks = data.risks || [];
    const recommendations = data.recommendations || [];
    const growthPercent = parseFloat(data.growthRate || "5%");

    this.element.innerHTML = `
      <h3 class="forecast-card-title">Scenario Simulation Playground</h3>
      <p style="font-size:13px; color:#6B7280; margin:-12px 0 20px 0;">Drag the range slider to simulate different business growth scenarios and see the updated projections in Indian Rupees (₹).</p>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <!-- Left: Growth Slider & Case outputs -->
        <div style="border:1px solid #E9EDF5; padding:20px; border-radius:12px; display:flex; flex-direction:column; gap:16px;">
          <div>
            <label style="display:flex; justify-content:space-between; font-size:14px; font-weight:600; color:#1E293B; margin-bottom:8px;">
              <span>Simulated Growth Rate:</span>
              <strong id="growth-rate-label" style="color:#5B3DF5; font-size:16px;">${growthPercent}%</strong>
            </label>
            <input type="range" id="growth-rate-slider" min="-10" max="30" value="${growthPercent}" style="width:100%; height:6px; background-color:#E9EDF5; border-radius:3px; outline:none; cursor:pointer;" />
          </div>

          <div style="margin-top:12px; display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; background-color:#EFF6FF; border:1px solid #BFDBFE; padding:12px; border-radius:8px;">
              <span style="font-size:13px; color:#1E40AF; font-weight:500;">Expected Case Projection:</span>
              <strong id="expected-case-value" style="font-size:16px; color:#1E3A8A;">${cases.expected || "N/A"}</strong>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background-color:#ECFDF5; border:1px solid #A7F3D0; padding:12px; border-radius:8px;">
              <span style="font-size:13px; color:#065F46; font-weight:500;">Best Case (High Demand) Projection:</span>
              <strong id="best-case-value" style="font-size:16px; color:#064E3B;">${cases.best || "N/A"}</strong>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background-color:#FEF2F2; border:1px solid #FCA5A5; padding:12px; border-radius:8px;">
              <span style="font-size:13px; color:#991B1B; font-weight:500;">Worst Case (Low Demand) Projection:</span>
              <strong id="worst-case-value" style="font-size:16px; color:#7F1D1D;">${cases.worst || "N/A"}</strong>
            </div>
          </div>
        </div>

        <!-- Right: Risks & Recommendations -->
        <div style="border:1px solid #E9EDF5; padding:20px; border-radius:12px; display:flex; flex-direction:column; gap:16px;">
          <!-- Risk analysis -->
          <div>
            <h4 style="margin:0 0 12px 0; font-size:14px; color:#1E293B; font-weight:600;">Scenario Risk Factors</h4>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${risks.map(r => `
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
                  <span style="color:#4B5563;">${r.description}</span>
                  <span style="color:#EF4444; font-weight:600;">Prob: ${r.probability} (${r.impactCount})</span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Recommendations -->
          <div style="margin-top:8px;">
            <h4 style="margin:0 0 12px 0; font-size:14px; color:#1E293B; font-weight:600;">AI Optimization Recommendations</h4>
            <div style="display:flex; flex-direction:column; gap:10px;">
              ${recommendations.map(rec => `
                <div style="font-size:12px; background-color:#F8FAFC; border:1px solid #E9EDF5; border-radius:8px; padding:10px;">
                  <p style="margin:0 0 4px 0; color:#1E293B; font-weight:500;">${rec.tip}</p>
                  <span style="color:#10B981; font-weight:600;">Expected Savings: ${rec.expectedSavings}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach event listeners for the slider
    const slider = this.element.querySelector("#growth-rate-slider");
    if (slider) {
      slider.addEventListener("input", async () => {
        const value = parseInt(slider.value);
        this.element.querySelector("#growth-rate-label").textContent = `${value}%`;
        
        try {
          const updated = await window.api.ipc.invoke("forecasting:simulate-scenario", value);
          this.element.querySelector("#expected-case-value").textContent = updated.cases.expected;
          this.element.querySelector("#best-case-value").textContent = updated.cases.best;
          this.element.querySelector("#worst-case-value").textContent = updated.cases.worst;
        } catch (err) {
          console.error("Scenario simulation error:", err);
        }
      });
    }
  }
}
