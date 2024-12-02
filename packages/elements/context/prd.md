# Product Requirements Document for `@elementals/elements`

A comprehensive library of HTML Custom Elements designed to enhance standard HTML elements with interactivity, theming capabilities, accessibility features, and support across multiple frontend frameworks. The components are optimized for AI-native applications, ensuring seamless integration and usability in AI-driven interfaces.

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Component Design Guidelines](#component-design-guidelines)
3. [Implementation Details](#implementation-details)
4. [Framework Integration and Type Safety](#framework-integration-and-type-safety)
5. [Theming with CSS Custom Properties](#theming-with-css-custom-properties)
6. [Interactivity via State Machines](#interactivity-via-state-machines)
7. [Accessibility Features](#accessibility-features)
8. [Performance Optimization](#performance-optimization)
9. [RTL Support](#rtl-support)
10. [Non-DOM Mutating Behavior](#non-dom-mutating-behavior)
11. [Event Handling](#event-handling)
12. [Testing and Quality Assurance](#testing-and-quality-assurance)
13. [Internationalization and Localization](#internationalization-and-localization)
14. [Usage Example](#usage-example)

---

## Core Principles

### Priority Order

1. **AI Native**: Components are designed to be easily understood and utilized by AI agents, facilitating AI applications with adaptive and generative UI experiences.

2. **HTML Custom Elements**: Each component is an HTML Custom Element with an `el-` prefix (e.g., `<el-form>`, `<el-accordion>`), enhancing familiarity and ease of use.

3. **Theming with CSS Custom Properties**: Utilize CSS Custom Properties for theming, allowing flexible and customizable styling that can be overridden or extended by users.

4. **Accessibility First**: Accessibility is integral. Components adhere to WCAG guidelines, leveraging the Accessibility Object Model (AOM) APIs to ensure inclusive user experiences.

5. **Interactivity via State Machines**: Handle interactivity using lightweight state machines (e.g., Zag.js) for predictable and maintainable state management.

6. **Framework Agnostic**: Components are usable across different frontend frameworks (React, Angular, Vue, etc.) without dependencies, enabling seamless integration.

7. **No Shadow DOM**: Avoid using Shadow DOM to enhance performance, improve server-side rendering (SSR) compatibility, and maintain a semantic, readable DOM structure.

8. **Progressive Enhancement**: Components function without JavaScript (no-op behavior) and are progressively enhanced when JavaScript is available.

9. **Non-DOM Mutating**: Enhance existing elements with interactivity and theming without altering the DOM structure.

10. **Performance Optimization**: Optimize components for minimal impact on load times and runtime performance, supporting lazy loading and efficient rendering.

11. **RTL Support**: Fully support right-to-left (RTL) text direction, enabling use in internationalized applications.

12. **Type Safety**: Provide TypeScript declarations to ensure type safety across different frameworks, improving developer experience and reducing runtime errors.

---

## Component Design Guidelines

### Naming Convention

- **Prefix**: All components use the `el-` prefix.
- **Naming**: Names are descriptive and reflect the component's functionality (e.g., `<el-accordion>`, `<el-modal>`).

### Structure and Styling

- **Semantic HTML**: Encourage the use of semantic HTML within components.
- **Display Property**: Use `display: contents` to avoid affecting layout.
- **Style Encapsulation**: Use `[data-part]` attribute selectors to encapsulate styles within components, allowing theming of specific parts.

### Theming and Styling

- **CSS Custom Properties**: Define CSS variables for all customizable styles.
- **Default Theme**: Provide a minimal default theme that can be extended or overridden by users.
- **Theme Application**: Allow themes to be applied globally or scoped to specific components.

### Interactivity

- **State Machines**: Implement interactivity using state machines for consistency and predictability.
- **Event Handling**: Emit standard DOM events for interactions, following consistent naming conventions.
- **Non-Intrusive**: Enhance elements without altering their fundamental behaviors or DOM structure.

### Accessibility

- **AOM and ARIA**: Use Accessibility Object Model APIs and ARIA attributes to communicate with assistive technologies.
- **Keyboard Navigation**: Ensure components are fully operable via keyboard inputs.
- **Focus Management**: Appropriately manage focus during interactions to provide a seamless user experience.

---

## Implementation Details

Detailed implementation guidelines for `@elementals/elements`, covering key requirements and usage examples.

### 1. HTML Custom Elements

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
    this.initialize();
  }

  initialize() {
    // Set up event listeners, default attributes, etc.
  }
}

customElements.define('el-accordion', ElAccordion);
```

---

### 2. Properties, Methods, and Events

#### Properties

- Use standard DOM properties for component configurations.
- Reflect attributes to properties and vice versa where appropriate.

#### Methods

- Expose methods sparingly, primarily for imperative actions like `focus()` which are not easily achievable with declarative APIs.

#### Events

- **Custom Events**: Emit events when the component state changes.
- **Naming Convention**: Events are named using the `ElEventName` format (e.g., `ElToggle`). We follow this convention so it works well with the `onElEventName` listener used in templates and frameworks like React (version 19+). (TODO: research alternatives)

---

### 3. Framework Integration and Type Safety

#### TypeScript Definitions

- **Declaration Files**: Provide `.d.ts` files for all components.
- **Framework-Specific Types**: Offer type definitions tailored for React, Angular, Vue, etc.
- **Global Declarations**: Include component interfaces in a global declaration to aid tooling.

##### Example

```typescript
// el-accordion.d.ts
export class ElAccordion extends HTMLElement {}
```

#### React Integration

- **Type Definitions**: Create React-specific type definitions.

##### Example

```tsx
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

#### Usage in React App

```tsx
// App.jsx
function App() {
  const handleToggle = (event) => {
    console.log('Accordion toggled:', event.detail.open);
  };

  return (
    <el-accordion onElToggle={handleToggle}>
      <details>
        <summary>Item One</summary>
        <p>Details for item one.</p>
      </details>
    </el-accordion>
  );
}

export default App;
```

---

### 4. Theming with CSS Custom Properties

#### Defining Custom Properties

- **Component Styles**: Use CSS variables for all style properties within components.

##### Example

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

#### Theme Application

- **Global Theme Overrides**: Users can override default variables in their stylesheets.

##### Example

```css
/* theme.css */
el-accordion {
  --el-accordion-header-bg: #f8f9fa;
  --el-accordion-header-color: #343a40;
  /* Additional overrides... */
}
```

---

### 5. Interactivity via State Machines

#### State Machine Implementation

- **Library Usage**: Use lightweight libraries like Zag.js for defining state machines.
- **Predictable States**: Clearly define states and transitions for consistent behavior.

##### Example

```javascript
import { createMachine, interpret } from '@zag-js/core';

const accordionMachine = createMachine({
  id: 'accordion',
  initial: 'collapsed',
  states: {
    collapsed: {
      on: { TOGGLE: 'expanded' },
    },
    expanded: {
      on: { TOGGLE: 'collapsed' },
    },
  },
});

// In the component
this.machine = interpret(accordionMachine).onTransition((state) => {
  // Update UI based on state
});
this.machine.start();
```

---

### 6. Accessibility Features

#### AOM and ARIA Support

- **Roles and Properties**: Apply appropriate `role`, `aria-*`, and `tabindex` attributes.
- **State Reflection**: Update ARIA attributes based on component state.

##### Example

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

#### Keyboard Navigation

- **Keyboard Interactions**: Implement key event handlers for standard navigation.

##### Example

```javascript
this.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    this.handleClick();
  }
});
```

---

### 7. Performance Optimization

#### Lazy Loading Components

- **Dynamic Imports**: Load component scripts only when they are needed.

##### Example

```html
<!-- In the HTML -->
<script type="module">
  if ('customElements' in window) {
    import('./components/el-accordion.js');
  }
</script>
```

#### Efficient Rendering

- **Batch Updates**: Use requestAnimationFrame or microtasks to batch DOM updates.
- **Avoid Layout Thrashing**: Minimize synchronous layout reads and writes.

---

### 8. RTL Support

#### CSS Logical Properties

- **Universal Layout**: Use logical properties (`margin-inline-start`, `padding-block-end`, etc.) for automatic RTL adaptation.

##### Example

```css
[data-part="header"] {
  padding-inline-start: 1rem; /* Replaces padding-left */
  padding-inline-end: 1rem;   /* Replaces padding-right */
}
```

#### Direction Detection

- **Dynamic Adjustments**: Observe `dir` attribute changes to adjust styles and behaviors.

##### Example

```javascript
const updateDirection = () => {
  const dir = getComputedStyle(this).direction;
  this.setAttribute('dir', dir);
};

const observer = new MutationObserver(updateDirection);
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

updateDirection();
```

---

### 9. Non-DOM Mutating Behavior

#### Enhancements Without Alteration

- **Event Listeners**: Enhance existing elements by adding event listeners and attributes without modifying the DOM hierarchy.

##### Example

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

### 10. Event Handling

#### Standard Event Emission

- **Custom Events**: Emit events that are composed and bubble up the DOM.

##### Example

```javascript
this.dispatchEvent(new CustomEvent('ElToggle', {
  detail: { open: !expanded },
  bubbles: true,
  composed: true,
}));
```

---

### 11. Testing and Quality Assurance

#### Unit Testing

- **Testing Frameworks**: Use Jest for JavaScript unit tests.
- **Coverage**: Ensure all logic branches and states are tested.

##### Example

```javascript
// el-accordion.test.js
test('toggles aria-expanded attribute on click', () => {
  const el = document.createElement('el-accordion');
  document.body.appendChild(el);

  el.handleClick();

  expect(el.getAttribute('aria-expanded')).toBe('true');
});
```

#### Accessibility Testing

- **Automation Tools**: Integrate Axe or Lighthouse for automated accessibility checks.
- **Manual Testing**: Perform manual tests with screen readers and keyboard navigation.

---

### 12. Internationalization and Localization

#### Language Support

- **`lang` Attribute Respect**: Adjust component behavior based on the document's `lang` attribute if necessary.

##### Example

```javascript
const lang = document.documentElement.lang || navigator.language || 'en';
// Use `lang` variable as needed
```

#### Date and Number Formatting

- **Intl API**: Utilize the Internationalization API for locale-specific formatting.

##### Example

```javascript
const formatter = new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' });
const formattedNumber = formatter.format(1000);
// Use formattedNumber in the component
```

---

## Usage Example

An example demonstrating how to use the `@elementals/elements` library in different frontend frameworks.

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

### React Example

```tsx
// App.jsx
function App() {
  const handleToggle = (event) => {
    console.log('Accordion toggled:', event.detail.open);
  };

  return (
    <el-accordion onElToggle={handleToggle}>
      <details>
        <summary>Item One</summary>
        <p>Details for item one.</p>
      </details>
    </el-accordion>
  );
}
```

### Angular Example

```ts
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<el-accordion (elToggle)="handleToggle($event)"></el-accordion>`,
})
export class AppComponent {
  handleToggle(event: CustomEvent) {
    console.log('Accordion toggled:', event.detail.open);
  }
}

// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule { }

// index.html
<app-root></app-root>
```

### Vue Example

```vue
// App.vue
<template>
  <el-accordion @el-toggle="handleToggle" />
</template>

<script>
export default {
  methods: { handleToggle(event) { console.log('Accordion toggled:', event.detail.open); } }
}
</script>
```

---
