/**
 * UserMenu.js
 * Retail ERP Enterprise — Logged in User Profile Dropdown Component
 *
 * Implements profile metadata slots, avatar displays, settings redirect hooks,
 * and session logout triggers.
 */

export default class UserMenu {
  constructor(options = {}) {
    this.options = {
      username: "admin",
      fullName: "System Administrator",
      roleName: "Administrator",
      ...options
    };
    this.element = null;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "header-usermenu-panel-wrapper";

    const initials = this.options.fullName.split(" ").map(n => n[0]).join("").substring(0, 2);

    wrapper.innerHTML = `
      <div class="usermenu-profile-anchor">
        <div class="usermenu-avatar">${initials}</div>
        <div class="usermenu-meta">
          <span class="usermenu-name">${this.options.fullName}</span>
          <span class="usermenu-role">${this.options.roleName}</span>
        </div>
      </div>
      <div class="usermenu-dropdown-drawer-card">
        <a href="#" class="usermenu-dropdown-link link-profile" data-action="profile">
          <span>👤</span> <span>My Profile</span>
        </a>
        <a href="#" class="usermenu-dropdown-link link-settings" data-action="settings">
          <span>⚙️</span> <span>Settings</span>
        </a>
        <a href="#" class="usermenu-dropdown-link link-license" data-action="license">
          <span>🔑</span> <span>License Info</span>
        </a>
        <div class="usermenu-dropdown-divider"></div>
        <a href="#" class="usermenu-dropdown-link link-logout" data-action="logout">
          <span>🚪</span> <span>Sign Out</span>
        </a>
      </div>
    `;

    const anchor = wrapper.querySelector(".usermenu-profile-anchor");
    const drawer = wrapper.querySelector(".usermenu-dropdown-drawer-card");

    // Display/hide profile menu
    anchor.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = drawer.classList.toggle("active");
      if (isActive) {
        // Close notifications panel if open
        const notify = document.querySelector(".notification-dropdown-drawer-card");
        if (notify) notify.classList.remove("active");
      }
    });

    // Close menu on outside click
    document.addEventListener("click", () => {
      drawer.classList.remove("active");
    });

    drawer.addEventListener("click", (e) => {
      e.stopPropagation(); // Avoid early dismiss on clicking menu links
    });

    // Bind event hooks to options callbacks
    const links = drawer.querySelectorAll(".usermenu-dropdown-link");
    links.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const action = link.getAttribute("data-action");
        console.log(`[User Menu Action] Executing command: ${action}`);

        if (action === "logout") {
          // Re-trigger standard logout sequence on the active page
          const logoutItem = document.querySelector(".item-logout a");
          if (logoutItem) {
            logoutItem.click();
          } else {
            window.api.auth.logout().then(() => {
              window.location.href = "../login/login.html";
            });
          }
        }
      });
    });

    this.element = wrapper;
    return wrapper;
  }
}
