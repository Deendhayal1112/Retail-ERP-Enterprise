# Toast Notification Component

Exposes dynamic toast alerts using JavaScript.

## Classes

- `.toast-container`: Root container positioned at the bottom right.
- `.toast`: Toast card container.

## Usage

```javascript
import { Toast } from './toast.js';

// Trigger notification
Toast.show('Data saved successfully!', 'success');
Toast.show('Failed to connect to database.', 'danger');
```
