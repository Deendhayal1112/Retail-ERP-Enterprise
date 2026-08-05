/**
 * HelpCenterManager.js
 * Retail ERP Enterprise — AI Support Assistant & Ticket Dispatcher
 */

"use strict";

class HelpCenterManager {
  constructor() {
    this.supportTickets = [];
  }

  async askAIAssistant(query) {
    // Simulated AI response matching query tags
    const normalized = query.toLowerCase();
    let responseText = "Our Enterprise support agent is analyzing your query. Please refer to Administrator Guides for detailed database parameters.";
    
    if (normalized.includes("login") || normalized.includes("password")) {
      responseText = "If you have issues logging in: Ensure SQLite Database service status is active and user role permissions maps standard categories.";
    } else if (normalized.includes("backup") || normalized.includes("restore")) {
      responseText = "Database backups: To perform database backups, navigate to Backup & Restore in sidebar, choose standard WAL directories.";
    } else if (normalized.includes("performance") || normalized.includes("slow")) {
      responseText = "Performance tuning: Ensure PRAGMA synchronous = NORMAL and WAL mode is turned on inside Database Settings tab.";
    }

    // Delay response to simulate AI inference time
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      query,
      reply: responseText,
      timestamp: new Date().toLocaleTimeString()
    };
  }

  async submitSupportTicket(ticketData) {
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: ticketId,
      ...ticketData,
      status: "Open",
      createdAt: new Date().toISOString()
    };
    this.supportTickets.push(newTicket);
    return { success: true, ticketId, ticket: newTicket };
  }
}

module.exports = HelpCenterManager;
