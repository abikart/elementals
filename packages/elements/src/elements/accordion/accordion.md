# Accordion Component

An accordion is a vertically stacked set of interactive headings that each reveal a section of content. It allows users to show and hide related content, reducing visual clutter while making information easy to find and navigate.

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

### Basic Usage
```html
<el-accordion>
  <details>
    <summary>Section 1</summary>
    <p>Content for section 1</p>
  </details>
</el-accordion>
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

| Property | Default | Description |
|----------|---------|-------------|
| `--el-accordion-border` | `var(--el-border-width, 1px) solid var(--el-border-color, #ddd)` | Border style for accordion items |
| `--el-accordion-header-bg` | `var(--el-surface-2, #fafafa)` | Background color for headers |
| `--el-accordion-header-color` | `var(--el-text-1, inherit)` | Text color for headers |
| `--el-accordion-content-bg` | `var(--el-surface-1, #fff)` | Background color for content |
| `--el-accordion-content-color` | `var(--el-text-1, inherit)` | Text color for content |
| `--el-accordion-padding` | `var(--el-spacing-3, 1rem)` | Padding for headers and content |
| `--el-accordion-radius` | `var(--el-radius-2, 4px)` | Border radius for accordion items |
| `--el-accordion-disabled-opacity` | `0.6` | Opacity for disabled sections |
| `--el-accordion-rotate` | `1` | Set to 0 to disable rotation animation |

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