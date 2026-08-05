/*
 * modal.js
 * Retail ERP Enterprise — Reusable Modal Component Manager
 *
 * Implements accessible, keyboard-compliant Modal interactions for renderer screens.
 *
 * Phase 2 — Step 7: Enterprise Reusable UI Components
 */

export class Modal {
  static activeModal = null;
  static lastFocusedElement = null;

  /**
   * Opens the targeted modal element and traps focus for accessibility.
   * @param {string} modalId - Element ID of the modal overlay.
   */
  static open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Save previous active element to restore later
    this.lastFocusedElement = document.activeElement;

    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    this.activeModal = modal;

    // Focus the first focusable child
    const focusable = this.getFocusableElements(modal);
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    // Bind backdrop click to close
    modal.addEventListener("click", this.handleBackdropClick);
  }

  /**
   * Closes the targeted modal and restores user focus state.
   * @param {string} modalId - Element ID of the modal overlay.
   */
  static close(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    modal.removeEventListener("click", this.handleBackdropClick);

    if (this.activeModal === modal) {
      this.activeModal = null;
    }

    // Restore previous focus
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }

  /**
   * Helper to retrieve all tab-navigable nodes.
   * @param {HTMLElement} element
   * @returns {HTMLElement[]}
   */
  static getFocusableElements(element) {
    return Array.from(
      element.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]',
      ),
    );
  }

  /**
   * Handles clicks on the modal backdrop overlay layer.
   */
  static handleBackdropClick = (e) => {
    if (e.target === this.activeModal) {
      this.close(this.activeModal.id);
    }
  };
}

// Global key controls (Escape key and Tab focus trapping)
document.addEventListener("keydown", (e) => {
  if (!Modal.activeModal) return;

  // Escape key to dismiss
  if (e.key === "Escape") {
    Modal.close(Modal.activeModal.id);
    return;
  }

  // Tab key focus trapping
  if (e.key === "Tab") {
    const focusable = Modal.getFocusableElements(Modal.activeModal);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift + Tab -> Wrap to end
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      // Tab -> Wrap to start
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }
});

window.Modal = Modal;
