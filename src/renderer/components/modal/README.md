# Modal Dialogue Component

Exposes accessible, focus-trapped modal dialog windows.

## Classes

- `.modal-overlay`: Backdrop layout masking.
- `.modal-container`: Elevated dialogue container.

## Usage

```html
<!-- Modal Template -->
<div id="exampleModal" class="modal-overlay" aria-hidden="true" role="dialog">
  <div class="modal-container elevation-l3">
    <h2 class="text-section-title">Modal Title</h2>
    <p class="text-body">Body description here...</p>
    <button class="btn btn-secondary" onclick="Modal.close('exampleModal')">Close</button>
  </div>
</div>
```

```javascript
import { Modal } from './modal.js';

// Open Modal
Modal.open('exampleModal');

// Close Modal
Modal.close('exampleModal');
```
