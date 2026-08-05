# Input Components

This folder contains the styling guidelines and structures for Text Inputs, Password Inputs, and Search Inputs.

## Classes

- `.form-input`: Default text field styling.
- `.form-input.has-error`: Red border indicator for invalid inputs.

## States

- `:focus`: Focus ring glow outline (`--shadow-focus`) and border highlight.
- `:disabled`: Gray background indicator.

## Examples

### Text Input
```html
<input type="text" class="form-input interact-input" placeholder="Enter text..." />
```

### Password Input
```html
<input type="password" class="form-input interact-input" placeholder="Password" />
```

### Search Input
```html
<div style="position: relative;">
  <input type="search" class="form-input interact-input pl-10" placeholder="Search..." />
</div>
```
