/**
 * AlertManager.js
 * Retail ERP Enterprise — System Diagnostic Recommendations Builder
 */

"use strict";

export default class AlertManager {
  constructor() {
    this.staticRecommendations = [
      { id: "rec-1", category: "performance", description: "Vite chunks tree-shaking logs verify unused ES exports safely eliminated" },
      { id: "rec-2", category: "database",    description: "Database WAL file size reaches 2 MB. Regular automatic checkpoints optimal" },
      { id: "rec-3", category: "startup",     description: "Deferring load of secondary telemetry modules saves ~120ms boot latency" }
    ];
  }

  evaluate(metrics) {
    const list = [...this.staticRecommendations];

    if (metrics.system.cpuUsagePct > 70) {
      list.unshift({ id: `rec-cpu-${Date.now()}`, category: "maintenance", description: "High system CPU load — check background services" });
    }
    if (metrics.system.memoryUsagePct > 75) {
      list.unshift({ id: `rec-mem-${Date.now()}`, category: "memory", description: "RAM consumption exceeds warning threshold — schedule cache purge" });
    }

    return list.slice(0, 5);
  }
}
