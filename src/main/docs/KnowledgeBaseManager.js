/**
 * KnowledgeBaseManager.js
 * Retail ERP Enterprise — Knowledge Base & FAQ Search Index Subsystem
 */

"use strict";

class KnowledgeBaseManager {
  constructor() {
    this.articles = [
      { id: "kb_101", title: "Configuring Multi-Store Databases", tags: ["database", "sqlite", "sync"], reads: 142 },
      { id: "kb_102", title: "Authenticode Certificate Expiry Policy", tags: ["security", "signing", "gpo"], reads: 89 },
      { id: "kb_103", title: "Optimizing IPC Message Transfer Frame", tags: ["developer", "performance", "ipc"], reads: 215 },
      { id: "kb_104", title: "Configuring Network Printers & POS Triggers", tags: ["hardware", "setup", "pos"], reads: 64 }
    ];
  }

  async searchArticles(keyword) {
    if (!keyword) return this.articles;
    const term = keyword.toLowerCase();
    return this.articles.filter(art => 
      art.title.toLowerCase().includes(term) || 
      art.tags.some(t => t.toLowerCase().includes(term))
    );
  }

  async incrementReadCount(articleId) {
    const article = this.articles.find(a => a.id === articleId);
    if (article) article.reads += 1;
    return { success: true, article };
  }
}

module.exports = KnowledgeBaseManager;
