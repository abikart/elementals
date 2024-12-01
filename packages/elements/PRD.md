# PRD for "@elementals/elements"

A collection of HTML custom elements that enhance standard HTML elements with interactivity, theming capabilities, accessibility features, and support for multiple frontend frameworks.

## Core Principles (in order of priority)

- **AI Native**: Components are designed to be built by AI agents and used in AI applications, use cases, adaptive, generative UI experiences. The component API should be understandable by AI.

- **HTML Custom Elements**: Each component is an HTML custom element prefixed with `el-` (e.g., `el-form`, `el-accordion`).

- **Theming with CSS Custom Properties**: Components utilize CSS custom properties for theming, allowing for flexible and customizable styling that can be overridden or extended.

- **Interactivity via State Machines**: Components handle interactivity using lightweight state machines (e.g., using libraries like Zag.js) for predictable and maintainable state management.

- **Framework Agnostic**: Components are usable across different frontend frameworks (React, Angular, Vue, etc.) without dependencies, allowing independent teams to integrate them seamlessly.

- **No Shadow DOM**: Components do not use Shadow DOM to avoid performance overhead, improve server-side rendering (SSR) compatibility, and maintain a semantic and readable DOM structure.

- **Progressive Enhancement**: Components function without JavaScript (no-op behavior) and are progressively enhanced when JavaScript is available.

- **Non-DOM Mutating**: Components do not alter the DOM structure; they enhance existing elements with interactivity and theming.

- **Accessibility First**: Accessibility is integral, with components leveraging the Accessibility Object Model (AOM) APIs and adhering to WCAG guidelines to ensure inclusive user experiences.

- **Performance Optimization**: Components are optimized for minimal impact on load times and runtime performance, supporting lazy loading and efficient rendering.

- **RTL Support**: Right-to-left (RTL) text direction is fully supported, enabling components to be used in internationalized applications.

- **Type Safety**: TypeScript declarations are provided to ensure type safety across different frameworks, improving developer experience and reducing runtime errors.

## Component Design Guidelines

### Naming Convention

- **Prefix**: All components use the `el-` prefix.
- **Naming**: Names are descriptive and reflect the component's functionality (e.g., `el-accordion`, `el-modal`).

### Structure and Styling

- **Display Property**: Use `display: contents` to avoid affecting layout.
- **Semantic HTML**: Encourage the use of semantic HTML within components.
- **Style Encapsulation**: Use `[data-part]` attribute selectors to encapsulate styles within components. That way theming can be applied to the component as a whole, or to specific parts of the component.

### Theming and Styling

- **CSS Custom Properties**: Define variables for all customizable styles.
- **Default Theme**: Provide a minimal default theme that can be extended or overridden.
- **Theme Application**: Themes can be applied globally or scoped to specific components.

### Interactivity

- **State Machines**: Implement interactivity using state machines for consistency.
- **Event Handling**: Emit standard DOM events for interactions.
- **Non-Intrusive**: Enhance elements without altering their fundamental behaviors.

### Accessibility

- **AOM and ARIA**: Use Accessibility Object Model APIs and ARIA attributes to communicate with assistive technologies.
- **Keyboard Navigation**: Ensure components are fully operable via keyboard.
- **Focus Management**: Manage focus appropriately during interactions.

### Performance

- **Lazy Loading**: Support code splitting and lazy loading of components.
- **Minimal Footprint**: Keep scripts and styles lightweight.
- **Efficient Rendering**: Avoid unnecessary reflows and repaints.

### RTL Support

- **CSS Logical Properties**: Utilize logical properties for automatic adaptation to text direction.
- **Dynamic Direction Handling**: React to changes in `dir` attribute in the DOM.

### Type Safety and Framework Integration

- **TypeScript Definitions**: Provide `.d.ts` files for each component.
- **Framework Usage Guides**: Offer documentation and examples for integrating components with React, Angular, Vue, etc.
- **Consistency Across Frameworks**: Ensure consistent behavior and APIs regardless of the framework.

## Usage Example

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@elementals/elements Example</title>
  <link rel="stylesheet" href="theme.css">
  <script type="module" src="elements.js"></script>
  <style data-theme="custom-theme">
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

---

# Implementation Details

Detailed implementation guidelines for `@elementals/elements`, covering key requirements and usage examples.

## 1. HTML Custom Elements

### Definition and Registration

- **Extending HTMLElement**: Each component extends the native `HTMLElement` class.
- **Custom Elements Registry**: Use `customElements.define()` to register components.

#### Example

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

## 2. Properties, methods and events

### Properties

### Methods
Methods are sparsely used, only when we need to control the component from the outside, or doing some side effects. For example, setting focus.

### Events
- Custom events are emitted when the component state changes.
- Events are always named in the form `ElEventName`.

## 3. Framework Integration and Type Safety

### TypeScript Definitions

- **Declaration Files**: Provide `.d.ts` files for all components.
- **Framework Specific Types**: Provide framework specific type definitions for each component. `.react.d.ts`, `.angular.d.ts`, `.vue.d.ts` etc.
- **Global Declarations**: Include component interfaces in a global declaration to aid tooling.

#### Example

```typescript
// el-accordion.ts
export class ElAccordion extends HTMLElement {}
export type ElAccordionProps = {
  open?: boolean;
  OpenChange?: (open: boolean) => void;
} 
```

```typescript
// React type generation, components.react.ts
import { ElAccordionProps } from './el-accordion.ts';
// Modify the props to include the rest of the react specific props, convert events to react events, etc. 
// The following is not accurate, needs to figure out the exact transformations
const ElAccordionReactProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & ElAccordionProps;
export const ElAccordion = 'el-accordion' as unknown as FC<ElAccordionReactProps>; 

// React app
import { ElAccordion } from './components.react';
<ElAccordion open={true} onOpenChange={(open) => console.log(open)}>
```

```typescript
// Angular type generation, components.angular.ts
import { ElAccordionProps } from './el-accordion.ts';
// Modify the props to include the rest of the angular specific props, convert events to angular events, etc. 
// The following is not accurate, needs to figure out the exact transformations
const ElAccordionAngularProps = ElAccordionProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export const ElAccordion = 'el-accordion' as unknown as Component<ElAccordionAngularProps>;
```

```typescript
// Vue type generation, components.vue.ts
import { ElAccordionProps } from './el-accordion.ts';
// Modify the props to include the rest of the vue specific props, convert events to vue events, etc. 
// The following is not accurate, needs to figure out the exact transformations
const ElAccordionVueProps = ElAccordionProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export const ElAccordion = 'el-accordion' as unknown as Component<ElAccordionVueProps>;
```

### React Integration

- **Using Custom Elements**: React supports custom elements; ensure props are correctly handled.

#### Usage Example

```jsx
// App.jsx
function App() {
  return (
    <el-accordion>
      <details>
        <summary>Item One</summary>
        <p>Details for item one.</p>
      </details>
    </el-accordion>
  );
}

export default App;
```

### Angular Integration

- **CUSTOM_ELEMENTS_SCHEMA**: Add to module schemas to allow custom elements.

#### Module Configuration

```typescript
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

#### Usage in Templates

```html
<!-- app.component.html -->
<el-accordion>
  <details>
    <summary>Item One</summary>
    <p>Details for item one.</p>
  </details>
</el-accordion>
```

## 3. Theming with CSS Custom Properties

### Defining Custom Properties

- **Component Styles**: Use CSS variables for all style properties.

#### Example

```css
/* el-accordion.css */
:host {
  --el-accordion-header-bg: transparent;
  --el-accordion-header-color: inherit;
  /* Additional variables... */
}

/* accordion.tsx: Apply variables */
el-accordion [data-part="header"] {
  background-color: var(--el-accordion-header-bg);
  color: var(--el-accordion-header-color);
}

/* theme.css: Apply variables */
el-accordion {
  --el-accordion-header-bg: #f8f9fa;
  --el-accordion-header-color: #343a40;
  /* Additional overrides... */
}

/* app.css: import theme.css, then apply styles not defined in theme.css */
@import 'theme.css';
el-accordion {
  --el-accordion-header-bg: #f8f9fa;
  --el-accordion-header-color: #343a40;
}
el-accordion [data-part="header"] {
  margin: 0;
}
```

### Theme Application

- **Global Theme**: Defined in a global stylesheet or within a `<style>` tag.

#### Example

```css
/* theme.css */
el-accordion {
  --el-accordion-header-bg: #f8f9fa;
  --el-accordion-header-color: #343a40;
  /* Additional overrides... */
}
```

## 4. Interactivity via State Machines

### State Machine Implementation

- **Library Usage**: Use Zag.js or a similar lightweight state machine library.
- **State Definitions**: Clearly define states and transitions.

#### Example

```javascript
import { createMachine } from 'zag-js';

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

## 5. Accessibility Features

### AOM and ARIA Support

- **Roles and Properties**: Apply appropriate `role`, `aria-`, and `tabindex` attributes.
- **State Reflection**: Update attributes based on interaction state.

#### Example

```javascript
// In connectedCallback
this.setAttribute('role', 'button');
this.setAttribute('aria-expanded', 'false');
this.setAttribute('tabindex', '0');

// Update on state change
if (state.matches('expanded')) {
  this.setAttribute('aria-expanded', 'true');
} else {
  this.setAttribute('aria-expanded', 'false');
}
```

### Keyboard Navigation

- **Event Listeners**: Handle keydown events for accessibility.

#### Example

```javascript
this.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    this.toggle(); // Method to toggle state
  } else if (event.key === 'ArrowDown') {
    // Move focus to next item
  }
});
```

## 6. Performance Optimization

### Lazy Loading Components

- **Dynamic Imports**: Load components only when needed.

#### Example

```html
<!-- In the HTML -->
<script type="module">
  if ('IntersectionObserver' in window) {
    const elAccordion = document.querySelector('el-accordion');
    if (elAccordion) {
      import('./components/el-accordion.js');
    }
  } else {
    // Fallback for older browsers
    import('./components/el-accordion.legacy.js');
  }
</script>
```

### Efficient Rendering

- **Minimize Reflows**: Batch DOM reads and writes.
- **Virtualization**: For components dealing with large data sets, employ virtualization techniques.

## 7. RTL Support

### CSS Logical Properties

- **Use Instead of Physical Properties**: Replace `margin-left` with `margin-inline-start`, etc.

#### Example

```css
.accordion-header {
  padding-inline-start: 1rem; /* Replaces padding-left */
  padding-inline-end: 1rem;   /* Replaces padding-right */
}
```

### Direction Detection

- **Observe `dir` Changes**: Adjust component styling and behavior if `dir` attribute changes.

#### Example

```javascript
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.attributeName === 'dir') {
      // Update styles or attributes as needed
    }
  }
});

observer.observe(document.documentElement, { attributes: true });
```

## 8. Non-DOM Mutating Behavior

### Enhancements Without Alteration

- **Adding Event Listeners**: Enhance existing elements by adding listeners and attributes.

#### Example

```javascript
connectedCallback() {
  const items = this.querySelectorAll('details');
  items.forEach((item) => {
    item.addEventListener('toggle', this.onToggle.bind(this));
  });
}
```

## 9. Event Handling

### Standard Event Emission

- **Custom Events**: Emit events that bubble and are composed.

#### Example

```javascript
this.dispatchEvent(new CustomEvent('el-toggle', {
  detail: { expanded: true },
  bubbles: true,
  composed: true,
}));
```

## 10. Testing and Quality Assurance

### Unit Testing

- **Frameworks**: Use Jest or Mocha for testing logic.
- **Coverage**: Ensure all components are thoroughly tested.

#### Example

```javascript
// el-accordion.test.js
test('toggles on click', () => {
  const el = document.createElement('el-accordion');
  document.body.appendChild(el);
  // Simulate click and assert state changes
});
```

### Accessibility Testing

- **Tools**: Utilize tools like Axe or Lighthouse.
- **Automated Tests**: Integrate accessibility checks into CI/CD pipelines.

## 11. Internationalization and Localization

### Language Support

- **`lang` Attribute Respect**: Adjust component behavior based on the document's language.

#### Example

```javascript
const lang = document.documentElement.lang || 'en';
// Use `lang` variable as needed
```

### Date and Number Formatting

- **Intl API**: Use the Internationalization API for locale-specific formatting if applicable.

#### Example

```javascript
const formatter = new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' });
const formattedNumber = formatter.format(1000);
// Use formattedNumber in the component
```

---

With these specifications and examples, the development team can proceed with implementing the `@elementals/elements` library, ensuring it meets the organization's standards for performance, accessibility, and cross-framework compatibility.
