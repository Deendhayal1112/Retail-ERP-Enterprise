/**
 * BootProfiler.js
 * Retail ERP Enterprise — 6-Stage Boot Timeline Simulation
 */

"use strict";

export default class BootProfiler {
  constructor() {
    // Seed realistic baseline durations per stage (ms)
    this.baseDurations = [80, 240, 180, 320, 420, 560];
    this.runCount = 0;
  }

  collect() {
    this.runCount++;

    // Generate jittered durations per run
    const stages = [
      "App Launch",
      "Main Process Ready",
      "Window Creation",
      "Renderer Ready",
      "First Paint",
      "UI Interactive"
    ];

    let elapsed = 0;
    const stageData = stages.map((name, i) => {
      const jitter = Math.round((Math.random() - 0.5) * 40);
      const duration = Math.max(30, this.baseDurations[i] + jitter);
      elapsed += duration;
      return {
        name,
        durationMs: duration,
        elapsedMs: elapsed,
        status: "complete"
      };
    });

    const totalBootMs = elapsed;
    const firstPaintMs = stageData.slice(0, 5).reduce((s, d) => s + d.durationMs, 0);
    const splashDurationMs = stageData[0].durationMs + stageData[1].durationMs;

    return { stages: stageData, totalBootMs, firstPaintMs, splashDurationMs };
  }
}
