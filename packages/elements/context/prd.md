# Product Requirements Document for `@elementals/elements`

A comprehensive library of HTML Custom Elements designed to enhance standard HTML elements with interactivity, theming capabilities, accessibility features, and support across multiple frontend frameworks. The components are optimized for AI-native applications, ensuring seamless integration and usability in AI-driven interfaces.

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Quick Start Guide](#quick-start-guide)
3. [Component Design Guidelines](#component-design-guidelines)
4. [Implementation Details](#implementation-details)
5. [Framework Integration and Type Safety](#framework-integration-and-type-safety)
6. [Theming System](#theming-system)
7. [Accessibility](#accessibility)
8. [Performance Optimization](#performance-optimization)
9. [Internationalization and RTL Support](#internationalization-and-rtl-support)
10. [Testing and Quality Assurance](#testing-and-quality-assurance)
11. [Troubleshooting](#troubleshooting)
12. [Usage Examples](#usage-examples)

---

## Core Principles

Here are the core principles in the order of priority:

- **First Principles**: Components separate static (built-in) from dynamic (configurable) features
- **AI Native**: Components are designed to be easily understood and utilized by AI agents, facilitating AI applications with adaptive and generative UI experiences
- **HTML Element Extensions**: Each component is an HTML Custom Element with an `el-` prefix (e.g., `<el-form>`, `<el-accordion>`), extending native HTML elements, enhancing familiarity and ease of use
- **No dependencies**: Components rely only on platform APIs
- **Theming with CSS Custom Properties**: Utilize CSS Custom Properties for theming, allowing flexible and customizable styling that can be overridden or extended by users
- **Accessibility First**: Accessibility is integral. Components adhere to WCAG guidelines, leveraging the Accessibility Object Model (AOM) APIs to ensure inclusive user experiences
- **Interactivity via State Machines**: Handle interactivity using lightweight state machines for predictable and maintainable state management
- **Framework Agnostic**: Components are usable across different frontend frameworks (React, Angular, Vue, etc.) without dependencies, enabling seamless integration
- **No Shadow DOM**: Avoid using Shadow DOM to enhance performance, improve server-side rendering (SSR) compatibility, and maintain a semantic, readable DOM structure
- **Progressive Enhancement**: Components function without JavaScript (no-op behavior) and are progressively enhanced when JavaScript is available
- **Non-DOM Mutating**: Enhance existing elements with interactivity and theming without altering the DOM structure
- **Performance Optimization**: Optimize components for minimal impact on load times and runtime performance, supporting lazy loading and efficient rendering
- **RTL Support**: Fully support right-to-left (RTL) text direction, enabling use in internationalized applications
- **Type Safety**: Provide TypeScript declarations to ensure type safety across different frameworks, improving developer experience and reducing runtime errors

---

## Quick Start Guide

### Installation

```bash
npm install @elementals/elements
```

### Basic Usage

```html
<!-- Import the components you need -->
<script type="module">
  import '@elementals/elements/accordion';
</script>

<!-- Use the component in your HTML -->
<el-accordion>
  <details>
    <summary>Expandable Section</summary>
    <p>Content goes here</p>
  </details>
</el-accordion>
```

### Framework Integration

#### React

```jsx
import '@elementals/elements/accordion';

function MyComponent() {
  return (
    <el-accordion onElToggle={(e) => console.log(e.detail)}>
      <details>
        <summary>Expandable Section</summary>
        <p>Content goes here</p>
      </details>
    </el-accordion>
  );
}
```

#### Vue

```vue
<template>
  <el-accordion @el-toggle="handleToggle">
    <details>
      <summary>Expandable Section</summary>
      <p>Content goes here</p>
    </details>
  </el-accordion>
</template>

<script>
import '@elementals/elements/accordion';

export default {
  methods: {
    handleToggle(event) {
      console.log(event.detail);
    }
  }
}
</script>
```

---

## Component Design Guidelines

### Naming Convention

- **Prefix**: All components use the `el-` prefix.
- **Naming**: Names are descriptive and reflect the component's functionality (e.g., `<el-accordion>`, `<el-modal>`).

### Static vs. Dynamic Features

- **Static**: Basic styling, HTML structure, accessibility attributes
- **Dynamic**: Concise declarative API exposed via properties, CSS custom properties, and events

### Structure

- **Semantic HTML**: Encourage the use of semantic HTML within components.
- **Display Property**: Use `display: contents` to avoid affecting layout.
- **Style Encapsulation**: Use `[data-part]` attribute selectors to encapsulate styles within components, allowing theming of specific parts.
- **Content Structure**: Define and document explicit content structure requirements for components.

### Event Handling

- **Custom Events**: Emit events when the component state changes.
- **Naming Convention**: Events are named using the `ElEventName` format (e.g., `ElToggle`). We follow this convention so it works well with the `onElEventName` listener used in templates and frameworks like React (version 19+).
- **Standard Event Emission**: Emit events that are composed and bubble up the DOM.

```javascript
this.dispatchEvent(new CustomEvent('ElToggle', {
  detail: { open: !expanded },
  bubbles: true,
  composed: true,
}));
```

---

## Implementation Details

### HTML Custom Elements

#### Definition and Registration

- **Extending HTMLElement**: Each component extends the native `HTMLElement` class.
- **Custom Elements Registry**: Use `customElements.define()` to register components.

##### Example

```javascript
// el-accordion.js
class ElAccordion extends HTMLElement {
  constructor() {
    super();
    // Initialization logic
  }

  connectedCallback() {
    // Invoked when the element is added to the document
    queueMicrotask(() => {
      this.initialize();
    });
  }

  initialize() {
    // Set up event listeners, default attributes, etc.
  }
}

customElements.define('el-accordion', ElAccordion);
```

### Properties and Methods

- **Properties**: Use standard DOM properties for component configurations.
- **Property Reflection**: Reflect attributes to properties and vice versa only where appropriate. Prefer properties over attributes for configuration.
- **Methods**: Expose methods sparingly, primarily for imperative actions like `focus()` which are not easily achievable with declarative APIs.

### Non-DOM Mutating Behavior

- **Enhancements Without Alteration**: Enhance existing elements by adding event listeners and attributes without modifying the DOM hierarchy.

```javascript
connectedCallback() {
  const items = this.querySelectorAll('details');
  items.forEach((item) => {
    item.setAttribute('data-part', 'item');
    item.addEventListener('toggle', this.onToggle);
  });
}

onToggle = (event) => {
  // Handle toggle event
};
```

---

## Framework Integration and Type Safety

### TypeScript Definitions

- **Declaration Files**: Provide `.d.ts` files for all components.
- **Framework-Specific Types**: Offer type definitions tailored for React, Angular, Vue, etc. Eg: `el-accordion.react.d.ts`
- **Global Declarations**: Include component interfaces in a global declaration to aid tooling.

#### Example

```typescript
// el-accordion.d.ts
export class ElAccordion extends HTMLElement {}
```

### React Integration

- **Type Definitions**: Create React-specific type definitions.

#### Example

```typescript
// el-accordion.react.d.ts
import * as React from 'react';

interface ElAccordionProps extends React.HTMLAttributes<HTMLElement> {
  open?: boolean;
  onElToggle?: (event: CustomEvent) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'el-accordion': ElAccordionProps;
    }
  }
}
```

---

## Theming System

### CSS Custom Properties

- **Component-Specific Variables**: Define CSS variables for all customizable styles.
- **Property Naming Convention**:
  - Use `--el-<component>-<property>` format for component-specific properties
  - Properties should fall back to global theme tokens (e.g., `var(--el-surface-1, #fff)`)
  - Group properties by category (theme, layout, states, animation)
  - Document all properties with their purpose and default values

#### Example

```css
/* el-accordion.css */
:host {
  --el-accordion-header-bg: transparent;
  --el-accordion-header-color: inherit;
  /* Additional variables... */
}

[data-part="header"] {
  background-color: var(--el-accordion-header-bg);
  color: var(--el-accordion-header-color);
}
```

### Theme Application

- **Global Theme Overrides**: Users can override default variables in their stylesheets.
- **Default Theme**: Provide a minimal default theme that can be extended or overridden by users.
- **Theme Application**: Allow themes to be applied globally or scoped to specific components.

#### Example

```css
/* theme.css */
el-accordion {
  --el-accordion-header-bg: #f8f9fa;
  --el-accordion-header-color: #343a40;
  /* Additional overrides... */
}
```

### Content Wrappers

- **Semantic Structure**: Prefer semantic structure over utility classes
- **Required Elements**: Document required wrapper elements for optimal component behavior

---

## Accessibility

### AOM and ARIA Support

- **Roles and Properties**: Apply appropriate `role`, `aria-*`, and `tabindex` attributes.
- **State Reflection**: Update ARIA attributes based on component state.

#### Example

```javascript
connectedCallback() {
  this.setAttribute('role', 'button');
  this.setAttribute('aria-expanded', 'false');
  this.setAttribute('tabindex', '0');

  // Event listeners
  this.addEventListener('click', this.handleClick);
}

handleClick = () => {
  const expanded = this.getAttribute('aria-expanded') === 'true';
  this.setAttribute('aria-expanded', String(!expanded));
  this.dispatchEvent(new CustomEvent('el-toggle', { detail: { open: !expanded } }));
};
```

### Keyboard Navigation

- **Keyboard Interactions**: Implement key event handlers for standard navigation.

#### Example

```javascript
this.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    this.handleClick();
  }
});
```

### Focus Management

- **Focus Handling**: Appropriately manage focus during interactions to provide a seamless user experience.
- **Focus Trapping**: Implement focus trapping for modal components to ensure keyboard users can't tab outside of active modals.

---

## Performance Optimization

### Lazy Loading Components

- **Dynamic Imports**: Load component scripts only when they are needed.

#### Example

```html
<!-- In the HTML -->
<script type="module">
  if ('customElements' in window) {
    import('./components/el-accordion.js');
  }
</script>
```

### Efficient Rendering

- **Batch Updates**: Use requestAnimationFrame or microtasks to batch DOM updates.
- **Avoid Layout Thrashing**: Minimize synchronous layout reads and writes.

---

## Internationalization and RTL Support

### RTL Layout

- **CSS Logical Properties**: Use logical properties (`margin-inline-start`, `padding-block-end`, etc.) for automatic RTL adaptation.

#### Example

```css
[data-part="header"] {
  padding-inline-start: 1rem; /* Replaces padding-left */
  padding-inline-end: 1rem;   /* Replaces padding-right */
}
```

### Direction Detection

- **Dynamic Adjustments**: Observe `dir` attribute changes to adjust styles and behaviors.

#### Example

```javascript
const updateDirection = () => {
  const dir = getComputedStyle(this).direction;
  this.setAttribute('dir', dir);
};

const observer = new MutationObserver(updateDirection);
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

updateDirection();
```

### Language Support

- **`lang` Attribute Respect**: Adjust component behavior based on the document's `lang` attribute if necessary.

#### Example

```javascript
const lang = document.documentElement.lang || navigator.language || 'en';
// Use `lang` variable as needed
```

### Date and Number Formatting

- **Intl API**: Utilize the Internationalization API for locale-specific formatting.

#### Example

```javascript
const formatter = new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' });
const formattedNumber = formatter.format(1000);
// Use formattedNumber in the component
```

---

## Testing and Quality Assurance

### Unit Testing

- **Testing Frameworks**: Use Jest for JavaScript unit tests.
- **Coverage**: Ensure all logic branches and states are tested.

#### Example

```javascript
// el-accordion.test.js
test('toggles aria-expanded attribute on click', () => {
  const el = document.createElement('el-accordion');
  document.body.appendChild(el);

  el.handleClick();

  expect(el.getAttribute('aria-expanded')).toBe('true');
});
```

### Accessibility Testing

- **Automation Tools**: Integrate Axe or Lighthouse for automated accessibility checks.
- **Manual Testing**: Perform manual tests with screen readers and keyboard navigation.

### Visual Regression Testing

- **Snapshot Testing**: Use snapshot testing to ensure the DOM structure and styles are consistent.

---

## Troubleshooting

### Common Issues

#### Components not rendering
- Ensure you've imported the component correctly
- Check browser console for any JavaScript errors
- Verify that your bundler is configured to handle ES modules

#### Styling issues
- Check that your CSS custom properties are correctly defined
- Inspect the component with browser dev tools to verify CSS inheritance
- Ensure no CSS reset is conflicting with component styles

#### Framework integration problems
- For React: Make sure you're using the correct event naming (`onElToggle` not `oneltoggle`)
- For Angular: Ensure you've added `CUSTOM_ELEMENTS_SCHEMA` to your module
- For Vue: Check that you're using kebab-case for event listeners (`@el-toggle`)

### Getting Help
- File issues on our GitHub repository
- Join our Discord community for real-time help
- Check the documentation for detailed guides

---

## Usage Examples

### HTML Example

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@elementals/elements Example</title>
  <link rel="stylesheet" href="theme.css">
  <script type="module" src="elements.js"></script>
  <style>
    /* Custom Theme Overrides */
    el-accordion {
      --el-accordion-header-bg: #fafafa;
      --el-accordion-header-color: #222;
      --el-accordion-content-bg: #fff;
      --el-accordion-border: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <el-accordion>
    <details>
      <summary>System Configuration</summary>
      <ul>
        <li>32GB RAM</li>
        <li>1TB SSD</li>
      </ul>
    </details>
    <details>
      <summary>Recommended Settings</summary>
      <ul>
        <li>Performance Mode: Enabled</li>
        <li>Auto Updates: On</li>
      </ul>
    </details>
  </el-accordion>
</body>
</html>
```

### Form Component Example

```html
<el-form validate-on="change">
  <form>
    <div>
      <label for="name">Name</label>
      <input id="name" name="name" required minlength="2" />
    </div>
    <div>
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />
    </div>
    <button type="submit">Submit</button>
  </form>
</el-form>
```

### Modal Component Example

```html
<button id="open-modal">Open Modal</button>

<el-modal id="my-modal" aria-labelledby="modal-title">
  <div role="dialog">
    <header>
      <h2 id="modal-title">Modal Title</h2>
      <button data-close>×</button>
    </header>
    <div>
      <p>Modal content goes here.</p>
    </div>
    <footer>
      <button data-close>Close</button>
      <button>Save Changes</button>
    </footer>
  </div>
</el-modal>

<script>
  const openButton = document.getElementById('open-modal');
  const modal = document.getElementById('my-modal');
  
  openButton.addEventListener('click', () => {
    modal.open = true;
  });
  
  modal.addEventListener('ElClose', () => {
    console.log('Modal closed');
  });
</script>
```

---
