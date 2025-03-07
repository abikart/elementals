# Accordion Component

An accordion is a vertically stacked set of interactive headings that each reveal a section of content. It allows users to show and hide related content, reducing visual clutter while making information easy to find and navigate.

## Features

- Enhances native `<details>` and `<summary>` elements with additional features
- Uses `open` attribute of `<details>` elements for expanded state
- Enhances grouped sections (single-expand behavior) with the native `name` attribute of `<details>` elements - [88.9%](https://caniuse.com/mdn-html_elements_details_name)
- Uses `aria-disabled` attribute of `<details>` elements for disabled state
- Uses custom `controlled` property of `<el-accordion>` element for controlled state
- Animates the content with dynamic height and padding of `<details>` elements
- Animates the expand/collapse indicators with rotation
- Animation is tricky when using `controlled` mode, since when `open` is false, the content is not visible and there is no way right now to animate
  - Workaround: Works only in chrome, achievable via pure CSS
  - `::details-content` pseudo-element is styled to animate with css transitions - [67.07%](https://caniuse.com/mdn-css_selectors_details-content)
  - `interpolate-size: allow-keywords` is used to animate the dynamic height of the content - [66.69%](https://caniuse.com/
  mdn-css_properties_interpolate-size)
  - `transition-behavior: allow-discrete;` is used to animate the expand/collapse indicators with rotation - [88.99%](https://caniuse.com/?search=transition-behavior)
  - [CodePen Example](https://codepen.io/abikart/pen/GgRKMxO)
  - When the browser users percentage improves to > 90%, animations will be migrated to be fully CSS based
- Indicator: 


## Native Features

The component builds on these standard HTML features:
- `<details>` element for expand/collapse functionality
- `<summary>` element for header content
- `name` attribute for grouping sections (single-expand behavior)
- `toggle` event for state changes

## Component Structure

### Data Parts (Internal)
These attributes are added automatically by the component:
| Part | Description |
|------|-------------|
| `data-part="item"` | Applied to each `<details>` element |
| `data-part="header"` | Applied to each `<summary>` element |
| `data-part="content"` | Applied to content elements after `<summary>` |
| `data-part="indicator"` | Applied to expand/collapse indicators |

### Data Slots (User Customization)
These attributes can be added by users to customize the component:
| Slot | Description |
|------|-------------|
| `data-slot="indicator-closed"` | Replace the default collapse indicator |
| `data-slot="indicator-open"` | Replace the default expand indicator |

## Usage

### Basic Usage with Content Wrapper (Recommended)
```html
<el-accordion>
  <details>
    <summary>Section 1</summary>
    <div>
      <p>Content for section 1</p>
    </div>
  </details>
</el-accordion>

<style>
  .content {
    padding: var(--el-accordion-padding);
    background: var(--el-accordion-content-bg);
  }
</style>
```

### Custom Indicators
```html
<!-- Separate open/closed indicators -->
<el-accordion>
  <details>
    <summary>
      Custom Indicators
      <svg data-slot="indicator-closed" width="16" height="16">
        <path d="M2 5l6 6 6-6" />
      </svg>
      <svg data-slot="indicator-open" width="16" height="16">
        <path d="M14 11l-6-6-6 6" />
      </svg>
    </summary>
    <p>Content</p>
  </details>
</el-accordion>

<!-- Disable rotation animation -->
<style>
  .no-rotate {
    --el-accordion-rotate: 0;
  }
</style>

<el-accordion class="no-rotate">
  <details>
    <summary>
      No Rotation
      <svg data-slot="indicator-closed" width="16" height="16">
        <path d="M2 5l6 6 6-6" />
      </svg>
      <svg data-slot="indicator-open" width="16" height="16">
        <path d="M14 11l-6-6-6 6" />
      </svg>
    </summary>
    <p>Content</p>
  </details>
</el-accordion>
```

### Single Expand Mode
```html
<el-accordion>
  <details name="group1">
    <summary>Section 1</summary>
    <p>Content for section 1</p>
  </details>
  <details name="group1">
    <summary>Section 2</summary>
    <p>Content for section 2</p>
  </details>
</el-accordion>
```

## Enhanced Features

The component adds the following enhancements to the native elements:

### Disabled State
While `<details>` doesn't support disabled state natively, this component adds support through `aria-disabled`:

```html
<el-accordion>
  <details aria-disabled="true">
    <summary>Disabled Section</summary>
    <p>This section cannot be toggled</p>
  </details>
</el-accordion>
```

When a section is disabled:
- It cannot be toggled open or closed
- The header has a reduced opacity
- The cursor changes to "not-allowed"
- Content cannot be selected
- Screen readers announce the disabled state

## Attributes

### Native Attributes
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | - | Groups sections for single-expand behavior |
| `open` | boolean | `false` | Sets the expanded state |

### Enhanced Attributes
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `aria-disabled` | boolean | `false` | Prevents the section from being toggled |
| `controlled` | boolean | `false` | Indicates that the state of the accordion is managed externally. In controlled mode, the component dispatches custom events (e.g., `el-show`, `el-hide`) without automatically toggling the `open` attribute or triggering animations; the consuming application is responsible for managing the state. |

## Events

The component uses the native `toggle` event from the `<details>` element:

```typescript
details.addEventListener('toggle', (event) => {
  if (event.target.open) {
    console.log('Section was opened');
  } else {
    console.log('Section was closed');
  }
});
```

## CSS Custom Properties

The accordion component uses CSS custom properties for theming. These properties can be overridden to customize the appearance of the accordion.

### Global Theme Overrides
| Property | Default | Description |
|----------|---------|-------------|
| `--el-accordion-bg` | `var(--el-surface-1, #fff)` | Background color of the accordion |
| `--el-accordion-color` | `var(--el-text-1, inherit)` | Text color of the accordion |
| `--el-accordion-border-color` | `var(--el-border-color, #ddd)` | Border color |
| `--el-accordion-border-width` | `var(--el-border-width-1, 2px)` | Border width |
| `--el-accordion-radius` | `var(--el-radius-2, 4px)` | Border radius |

### Layout
| Property | Default | Description |
|----------|---------|-------------|
| `--el-accordion-spacing` | `var(--el-spacing-2, 0.5rem)` | Space between accordion items |
| `--el-accordion-padding` | `var(--el-spacing-3, 1rem)` | Internal padding |
| `--el-accordion-gap` | `var(--el-spacing-2, 0.5rem)` | Gap between header elements |

### Header
| Property | Default | Description |
|----------|---------|-------------|
| `--el-accordion-header-bg` | `var(--el-surface-2, #fafafa)` | Header background color |
| `--el-accordion-header-color` | `var(--el-text-1, inherit)` | Header text color |

### Indicator
| Property | Default | Description |
|----------|---------|-------------|
| `--el-accordion-indicator-size` | `var(--el-icon-size-1, 0.75rem)` | Size of the expand/collapse indicator |

### States
| Property | Default | Description |
|----------|---------|-------------|
| `--el-accordion-disabled-opacity` | `var(--el-opacity-disabled, 0.6)` | Opacity for disabled state |

### Animation
| Property | Default | Description |
|----------|---------|-------------|
| `--el-accordion-duration` | `var(--el-duration-2, 200ms)` | Animation duration |
| `--el-accordion-easing` | `var(--el-easing-standard, ease)` | Animation easing function |
| `--el-accordion-rotate` | `1` | Enable/disable rotation animation |

### Example Usage

```css
/* Global theme customization */
:root {
  --el-surface-1: #ffffff;
  --el-surface-2: #f8f9fa;
  --el-text-1: #212529;
  --el-border-color: #dee2e6;
}

/* Component-specific customization */
el-accordion {
  --el-accordion-header-bg: #e9ecef;
  --el-accordion-padding: 1.5rem;
  --el-accordion-radius: 8px;
}
```

## Accessibility

### Native Features
- Uses semantic `<details>` and `<summary>` elements
- Keyboard navigation with Enter and Space
- Automatic ARIA expansion state

### Enhanced Features
- Disabled state communicated via `aria-disabled`
- Visual indicators for disabled state
- Maintained keyboard navigation patterns

## Examples

### Basic Usage

```html
<el-accordion>
  <details>
    <summary>Section 1</summary>
    <p>Content for section 1</p>
  </details>
</el-accordion>
```

### Single Expand Mode

```html
<el-accordion>
  <details name="group1">
    <summary>Section 1</summary>
    <p>Content for section 1</p>
  </details>
  <details name="group1">
    <summary>Section 2</summary>
    <p>Content for section 2</p>
  </details>
</el-accordion>
```

### With Custom Styling

```html
<style>
  .custom-accordion {
    --el-accordion-header-bg: #e9ecef;
    --el-accordion-header-color: #212529;
    --el-accordion-content-bg: #f8f9fa;
    --el-accordion-radius: 8px;
  }
</style>

<el-accordion class="custom-accordion">
  <details>
    <summary>Custom Styled Section</summary>
    <p>Content with custom styling</p>
  </details>
</el-accordion>
```

### Framework Usage

#### React
```tsx
function AccordionExample() {
  const handleToggle = (event: CustomEvent<ElAccordionEventDetail>) => {
    console.log('Section toggled:', event.detail.open);
  };

  return (
    <el-accordion single-expand onElToggle={handleToggle}>
      <details>
        <summary>React Section</summary>
        <p>Content in React</p>
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
      <summary>Vue Section</summary>
      <p>Content in Vue</p>
    </details>
  </el-accordion>
</template>

<script>
export default {
  methods: {
    handleToggle(event) {
      console.log('Section toggled:', event.detail.open);
    }
  }
}
</script>
```

## Progressive Enhancement

The component uses native `<details>` elements, ensuring content remains accessible even without JavaScript. When JavaScript is available, additional features like single-expand mode and custom styling are enhanced.

## Browser Support

Works in all modern browsers that support Custom Elements v1 and `<details>` elements. 

## Content Structure

The accordion expects a specific structure for optimal animation behavior:
- Each `<details>` element should contain:
  1. A `<summary>` element for the header
  2. A single `<div>` element for the content

```html
<el-accordion>
  <details>
    <summary>Section Title</summary>
    <div>  <!-- Single content container -->
      <!-- Any content goes here -->
      <p>Paragraph one</p>
      <p>Paragraph two</p>
      <table>...</table>
    </div>
  </details>
</el-accordion>
```

### Styling Content
Apply padding and other styles using CSS custom properties:

```css
el-accordion [data-part="content"] {
  padding: var(--el-accordion-padding);
  background: var(--el-accordion-content-bg);
}
```

### ❌ Avoid
```html
<!-- Don't use multiple direct children after summary -->
<details>
  <summary>Title</summary>
  <p>First paragraph</p>  <!-- Direct child -->
  <p>Second paragraph</p> <!-- Direct child -->
</details>

<!-- Don't use wrapper classes -->
<details>
  <summary>Title</summary>
  <div>...</div>  <!-- No need for classes -->
</details>
```

### ✅ Recommended
```html
<details>
  <summary>Title</summary>
  <div>  <!-- Single content wrapper -->
    <p>First paragraph</p>
    <p>Second paragraph</p>
  </div>
</details>
```