/**
 * TaskPriorities.js
 * Retail ERP Enterprise — Background Task Priorities Registry
 */

"use strict";

const TaskPriorities = {
  CRITICAL: "Critical",
  HIGH: "High",
  NORMAL: "Normal",
  LOW: "Low",
  BACKGROUND: "Background"
};

// Numeric priority weights for queue sorting (higher = runs first)
const PriorityWeights = {
  [TaskPriorities.CRITICAL]: 5,
  [TaskPriorities.HIGH]: 4,
  [TaskPriorities.NORMAL]: 3,
  [TaskPriorities.LOW]: 2,
  [TaskPriorities.BACKGROUND]: 1
};

module.exports = {
  TaskPriorities,
  PriorityWeights
};
