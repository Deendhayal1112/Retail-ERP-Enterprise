/**
 * AssistantPanel.js
 * Retail ERP Enterprise — AI Chat Interface Panel
 */

"use strict";

export default class AssistantPanel {
  constructor(options = {}) {
    this.options = options;
    this.history = options.history || [];
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "ai-center-card col-span-12";
    card.innerHTML = `
      <h3 class="ai-center-card-title">Enterprise Chat Copilot</h3>
      <div style="display:flex; flex-direction:column; gap:16px;">
        <!-- Chat bubbles window -->
        <div class="chat-messages-container">
          ${this.history.map(msg => `
            <div class="chat-bubble ${msg.sender}">
              ${msg.text}
            </div>
          `).join("")}
        </div>

        <!-- Suggested prompts shortcuts -->
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          <span class="suggested-prompt-chip" data-prompt="Show latest sales stats">Show Sales Stats</span>
          <span class="suggested-prompt-chip" data-prompt="Check active stock level alerts">Isolate Stock Alerts</span>
          <span class="suggested-prompt-chip" data-prompt="Are there any database error logs?">Audit UAT Error Logs</span>
        </div>

        <!-- Inputs toolbar -->
        <div style="display:flex; gap:12px;">
          <input class="chat-input-box" type="text" placeholder="Type prompt command or ask insights..." style="flex:1; height:40px; border:1px solid #E9EDF5; border-radius:8px; padding:0 16px; font-size:13px; color:#1F2937; outline:none; box-sizing:border-box;">
          <button class="send-prompt-btn" style="height:40px; padding:0 20px; background-color:#5B3DF5; color:#FFFFFF; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">
            Submit
          </button>
        </div>
      </div>
    `;

    card.querySelectorAll(".suggested-prompt-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const val = chip.getAttribute("data-prompt");
        this.submitPrompt(val);
      });
    });

    card.querySelector(".send-prompt-btn").addEventListener("click", () => {
      const input = card.querySelector(".chat-input-box");
      if (input.value.trim()) {
        this.submitPrompt(input.value);
        input.value = "";
      }
    });

    card.querySelector(".chat-input-box").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const input = card.querySelector(".chat-input-box");
        if (input.value.trim()) {
          this.submitPrompt(input.value);
          input.value = "";
        }
      }
    });

    this.element = card;
    this.scrollToBottom();
    return card;
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = this.element.querySelector(".chat-messages-container");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);
  }

  async submitPrompt(val) {
    if (this.options.onSubmit) {
      await this.options.onSubmit(val);
    }
  }
}
