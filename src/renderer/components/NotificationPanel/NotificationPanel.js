"use strict";

class NotificationPanel {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "notificationpanel-placeholder";
    div.textContent = "NotificationPanel Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = NotificationPanel;
