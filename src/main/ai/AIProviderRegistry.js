/**
 * AIProviderRegistry.js
 * Retail ERP Enterprise — AI Provider Registry
 */

"use strict";

class AIProviderRegistry {
  constructor() {
    this.providers = [
      { id: "gemini", name: "Google Gemini v1.5 Pro", active: true, type: "Cloud" },
      { id: "openai", name: "OpenAI GPT-4o", active: false, type: "Cloud" },
      { id: "azure", name: "Azure OpenAI Service", active: false, type: "Enterprise Cloud" },
      { id: "ollama", name: "Ollama (Local Host)", active: true, type: "Local" },
      { id: "anthropic", name: "Anthropic Claude 3.5 Sonnet", active: false, type: "Cloud" },
      { id: "local", name: "Local Llama 3 (Embedded)", active: false, type: "Local" }
    ];
  }

  async getProviders() {
    return this.providers;
  }

  async toggleProvider(id) {
    const provider = this.providers.find(p => p.id === id);
    if (provider) {
      provider.active = !provider.active;
    }
    return { success: true, providers: this.providers };
  }
}

module.exports = AIProviderRegistry;
