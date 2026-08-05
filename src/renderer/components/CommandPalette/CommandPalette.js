/**
 * CommandPalette.js
 * Retail ERP Enterprise — Reusable Global Command Palette Overlay
 *
 * Implements:
 * - CommandPalette (Coordinator modal manager)
 * - CommandInput (Text field search input filter)
 * - CommandGroup (Visual group box panel)
 * - CommandItem (Individual navigation/action option row)
 * - RecentCommands (Logs of previous command hits)
 * - KeyboardHints (Navigation footers)
 * - EmptyCommandState (No matches fallback screen)
 */

"use strict";

export class CommandInput {
  /**
   * @param {Object}   options
   * @param {Function} options.onInput Callback when text changes
   */
  constructor(options = {}) {
    this.onInput = options.onInput || null;
    this.inputEl = null;
  }

  clear() {
    if (this.inputEl) {
      this.inputEl.value = "";
      this.inputEl.focus();
    }
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "command-input-wrapper";
    wrap.innerHTML = `
      <span class="command-input-prefix">&gt;</span>
      <input type="text" class="command-input-field" placeholder="Type a command or quick action..." aria-label="Command search input" />
    `;

    const input = wrap.querySelector(".command-input-field");
    this.inputEl = input;

    if (this.onInput) {
      input.addEventListener("input", (e) => this.onInput(e.target.value));
    }

    return wrap;
  }
}

export class CommandItem {
  /**
   * @param {Object} options
   * @param {string}  options.icon     Visual emoji representation
   * @param {string}  options.text     Main label text
   * @param {string}  options.shortcut Optional shortcut label e.g. "G + D"
   * @param {boolean} options.focused  Keyboard focus indicator
   */
  constructor(options = {}) {
    this.icon     = options.icon     || "⚙️";
    this.text     = options.text     || "Command Name";
    this.shortcut = options.shortcut || "";
    this.focused  = options.focused  || false;
  }

  render() {
    const row = document.createElement("div");
    row.className = `command-item-row${this.focused ? " focused" : ""}`;
    row.setAttribute("role", "option");
    row.setAttribute("aria-selected", this.focused ? "true" : "false");

    row.innerHTML = `
      <div class="command-item-left">
        <span class="command-item-icon">${this.icon}</span>
        <span>${this.text}</span>
      </div>
      ${this.shortcut ? `<kbd class="command-item-kbd-shortcut">${this.shortcut}</kbd>` : ""}
    `;

    row.addEventListener("click", () => {
      console.log(`[CommandPalette Execution] Running command action: ${this.text}`);
    });

    return row;
  }
}

export class CommandGroup {
  /**
   * @param {Object}   options
   * @param {string}   options.label Header title category name
   * @param {Object[]} options.items List of command items parameters
   * @param {number}   options.startIndex Global index boundary start
   * @param {number}   options.selectedIndex Currently focused index globally
   */
  constructor(options = {}) {
    this.label         = options.label         || "Group";
    this.items         = options.items         || [];
    this.startIndex    = options.startIndex    || 0;
    this.selectedIndex = options.selectedIndex || -1;
  }

  render() {
    const box = document.createElement("div");
    box.className = "command-group-box";

    const header = document.createElement("span");
    header.className = "command-group-header";
    header.textContent = this.label;
    box.appendChild(header);

    this.items.forEach((item, localIdx) => {
      const globalIdx = this.startIndex + localIdx;
      const cmd = new CommandItem({
        icon:     item.icon,
        text:     item.text,
        shortcut: item.shortcut,
        focused:  globalIdx === this.selectedIndex
      });
      box.appendChild(cmd.render());
    });

    return box;
  }
}

export class RecentCommands {
  constructor(options = {}) {
    this.commands = options.commands || ["Go to Dashboard", "Toggle Light/Dark Theme"];
  }

  render() {
    const box = document.createElement("div");
    box.className = "command-group-box";

    const header = document.createElement("span");
    header.className = "command-group-header";
    header.textContent = "Recent Commands";
    box.appendChild(header);

    this.commands.forEach(cmdText => {
      const cmd = new CommandItem({
        icon: "⏳",
        text: cmdText
      });
      box.appendChild(cmd.render());
    });

    return box;
  }
}

export class KeyboardHints {
  render() {
    const footer = document.createElement("footer");
    footer.className = "command-palette-footer";
    footer.innerHTML = `
      <div class="command-footer-left">
        <span>Press</span><kbd class="command-footer-kbd">ESC</kbd><span>to close</span>
      </div>
      <div class="command-footer-right">
        <div class="command-footer-guide">
          <kbd class="command-footer-kbd">↑↓</kbd><span>Navigate</span>
        </div>
        <div class="command-footer-guide">
          <kbd class="command-footer-kbd">Enter</kbd><span>Execute</span>
        </div>
      </div>
    `;
    return footer;
  }
}

export class EmptyCommandState {
  render() {
    const box = document.createElement("div");
    box.className = "command-empty-box";
    box.innerHTML = `
      <span class="command-empty-title">No matching commands found</span>
      <span class="command-empty-desc">Try modifying your query terms...</span>
    `;
    return box;
  }
}

// ─────────────────────────────────────────────────────
// MAIN COMMAND PALETTE COORDINATOR OVERLAY
// ─────────────────────────────────────────────────────

export default class CommandPalette {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
    this.active  = false;

    this.query = "";
    this.selectedIndex = -1;

    // Full catalog list of operational commands
    this.catalog = [
      // Navigation Group
      { icon: "📊", text: "Go to Dashboard",       category: "Navigation",    shortcut: "G + D" },
      { icon: "👕", text: "Go to Products list",    category: "Navigation",    shortcut: "G + P" },
      { icon: "📦", text: "Go to Inventory",        category: "Navigation",    shortcut: "G + I" },
      { icon: "👥", text: "Go to Customers directory", category: "Navigation", shortcut: "G + C" },
      { icon: "🚚", text: "Go to Suppliers registry", category: "Navigation",  shortcut: "G + S" },
      { icon: "💰", text: "Go to Sales register",   category: "Navigation",    shortcut: "G + R" },
      { icon: "🛒", text: "Go to Purchase Orders",  category: "Navigation",    shortcut: "G + O" },
      { icon: "📋", text: "Go to Analytics Reports", category: "Navigation",    shortcut: "G + A" },
      { icon: "⚙️",  text: "Go to System Settings", category: "Navigation",    shortcut: "G + E" },

      // Quick Actions Group
      { icon: "➕", text: "Add New Product Card",   category: "Quick Actions", shortcut: "N + P" },
      { icon: "👤", text: "Register New Customer",  category: "Quick Actions", shortcut: "N + C" },
      { icon: "💳", text: "Create POS Sale receipt", category: "Quick Actions", shortcut: "N + S" },
      { icon: "📦", text: "Create Purchase Order", category: "Quick Actions", shortcut: "N + O" },
      { icon: "💾", text: "Backup SQLite Database", category: "Quick Actions", shortcut: "B + D" },

      // System Group
      { icon: "🌙", text: "Toggle Light/Dark Theme", category: "System",        shortcut: "T + M" },
      { icon: "👤", text: "View User Profile settings", category: "System",     shortcut: "U + P" },
      { icon: "❓", text: "Open Help & Support",    category: "System",        shortcut: "H + L" },
      { icon: "ℹ️",  text: "About Retail ERP",       category: "System",        shortcut: "A + B" },
      { icon: "🚪", text: "Secure Operator Logout", category: "System",        shortcut: "Q + T" }
    ];
  }

  toggle(forceState) {
    this.active = forceState !== undefined ? forceState : !this.active;
    if (this.element) {
      this.element.classList.toggle("active", this.active);
      if (this.active) {
        const input = this.element.querySelector(".command-input-field");
        if (input) input.focus();
      }
    }
  }

  _getFilteredCommands() {
    if (!this.query.trim()) return this.catalog;
    const q = this.query.toLowerCase();
    return this.catalog.filter(cmd =>
      cmd.text.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  }

  _updateContent() {
    const body = this.element.querySelector(".command-palette-body");
    if (!body) return;

    body.innerHTML = "";

    const filtered = this._getFilteredCommands();

    if (filtered.length === 0) {
      body.appendChild(new EmptyCommandState().render());
      return;
    }

    // Sort into categories
    const groups = {};
    filtered.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });

    let globalIdxCount = 0;
    Object.entries(groups).forEach(([groupName, items]) => {
      const grp = new CommandGroup({
        label:         groupName,
        items:         items,
        startIndex:    globalIdxCount,
        selectedIndex: this.selectedIndex
      });
      body.appendChild(grp.render());
      globalIdxCount += items.length;
    });
  }

  render() {
    const backdrop = document.createElement("div");
    backdrop.className = "command-palette-backdrop";
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("role", "dialog");

    // Dismiss on clicking backdrop shadow
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) this.toggle(false);
    });

    const modal = document.createElement("div");
    modal.className = "command-palette-modal";

    // 1. Search text input
    const input = new CommandInput({
      onInput: (val) => {
        this.query = val;
        this.selectedIndex = -1;
        this._updateContent();
      }
    });
    modal.appendChild(input.render());

    // 2. Scrollable Body
    const body = document.createElement("div");
    body.className = "command-palette-body";
    modal.appendChild(body);

    // 3. Hints footer
    modal.appendChild(new KeyboardHints().render());

    backdrop.appendChild(modal);
    this.element = backdrop;

    this._updateContent();

    // Bind Keyboard event shortcuts (Ctrl+Shift+P or Cmd+Shift+P)
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        this.toggle();
      }

      if (this.active) {
        const filtered = this._getFilteredCommands();

        if (e.key === "Escape") {
          e.preventDefault();
          this.toggle(false);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex + 1) % filtered.length;
          this._updateContent();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex - 1 + filtered.length) % filtered.length;
          this._updateContent();
        } else if (e.key === "Enter") {
          if (this.selectedIndex >= 0 && this.selectedIndex < filtered.length) {
            e.preventDefault();
            const selectedItem = filtered[this.selectedIndex];
            console.log(`[CommandPalette Keyboard Enter] Executing selected action: ${selectedItem.text}`);
            this.toggle(false);
          }
        }
      }
    });

    return backdrop;
  }
}
