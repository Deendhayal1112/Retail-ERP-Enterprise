/**
 * UserMenu.js
 * Retail ERP Enterprise — Logged in User Profile Dropdown Component
 */

export default class UserMenu {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "usermenu-placeholder";
    
    div.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--primary-600 || #2563eb); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; font-size: 0.825rem;">A</div>
        <span style="font-size: 0.825rem; font-weight: 600; color: var(--text-primary || #cbd5e1);">System Administrator</span>
      </div>
    `;
    
    this.element = div;
    return div;
  }
}
