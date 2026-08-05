/**
 * HelpCenterPanel.js
 * Retail ERP Enterprise — AI Support Assistant Query Box View
 */

"use strict";

export default class HelpCenterPanel {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "docs-center-card col-span-12";
    card.innerHTML = `
      <h3 class="docs-center-card-title">Help Center & Support Desk</h3>
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="docs-search-bar-container">
          <input type="text" class="docs-search-input" placeholder="Ask AI Assistant (e.g. 'how to login' or 'database backups')..." />
          <button class="docs-search-btn">Ask AI</button>
        </div>

        <!-- AI reply result block -->
        <div class="ai-reply-container" style="display:none; border:1px solid #E9EDF5; border-radius:12px; padding:16px; background-color:#EEF2FF; border-left:4px solid #5B3DF5;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #E2E8F0; padding-bottom:8px; margin-bottom:8px;">
            <strong style="font-size:13px; color:#5B3DF5;">Enterprise Copilot</strong>
            <span class="ai-timestamp" style="font-size:11px; color:#6B7280;">--</span>
          </div>
          <p class="ai-reply-text" style="margin:0; font-size:13px; color:#1F2937; line-height:1.6;"></p>
        </div>
      </div>
    `;

    card.querySelector(".docs-search-btn").addEventListener("click", () => {
      this.askAI();
    });

    card.querySelector(".docs-search-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.askAI();
    });

    this.element = card;
    return card;
  }

  async askAI() {
    const input = this.element.querySelector(".docs-search-input");
    const query = input.value.trim();
    if (!query) return;

    const replyContainer = this.element.querySelector(".ai-reply-container");
    const replyText = this.element.querySelector(".ai-reply-text");
    const timestampSpan = this.element.querySelector(".ai-timestamp");
    const searchBtn = this.element.querySelector(".docs-search-btn");

    searchBtn.disabled = true;
    searchBtn.textContent = "Analyzing...";
    replyText.textContent = "AI engine processing query parameters...";
    replyContainer.style.display = "block";

    try {
      const result = await window.api.ipc.invoke("help:ask-ai", query);
      if (result && result.success) {
        replyText.textContent = result.reply;
        timestampSpan.textContent = result.timestamp;
      }
    } catch (err) {
      console.error("AI help search error:", err);
      replyText.textContent = "Failed to query the AI assistant. Ensure services status is active.";
    } finally {
      searchBtn.disabled = false;
      searchBtn.textContent = "Ask AI";
    }
  }
}
