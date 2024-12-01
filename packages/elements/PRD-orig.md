# PRD for "@elementals/elements"
A collection of HTML custom elements that enhances standard HTML elements with interactivity and theming capabilities.

## Core principles
- Individual `@elementals/elements` (referred to as element/ elements in the rest of the document) are HTML custom elements
- Element are named with `el-` prefix. eg: `el-form`, `el-accordion`
- Element are not full web components, as in, they do not use shadow DOM, because shadow DOM is heavy, support for SSR is still evolving, features like encapsulation of styles feels overdone and generally not popular with most frontend developers
- By using elements, with proper custome element name / identifier for the elements in the final HTML document, aim for readable, semantic DOM output, with support for lazy loading components, and easy to understand and debug HTML structure
- Elements are no-op without JavaScript, and are progressively enhanced with JavaScript
- Elements do not mutate the DOM, they only add interactivity and theming capabilities
- Elements add support for CSS custom properties from a theming perspective, whose values get applied to the children of the custom element
- CSS properties are only declared by the elements, and their values are default, inherited / no-op values and only activated by values from the theme. Until a theme is applied, the elements do not apply any styles to the children
- The element by itself has `display: contents` so its children are not affected by the element's styles
- Elements are designed to be used with a theme, which is a collection of CSS custom properties that are applied to the elements
- Interactivity is added with a state machine, like Zag.js, which is a lightweight state machine library
- Adding accessible features is part of the interactivity, and is added with AOM (Accessibility Object Model) API


## Usage:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="theme.css">
  <script type="module" src="elements.js"></script>
  <style data-theme="example-theme">
    el-accordion {
      --el-accordion-summary-bg: #f0f0f0;
      --el-accordion-summary-bg-hover: #e0e0e0;
      --el-accordion-summary-color: #333;
      --el-accordion-summary-border: 1px solid #ccc;
    }
  </style>
</head>
<body>
  <el-accordion>
    <details>
        <summary>System configuration</summary>
        <ul>
            <li>200GB RAM</li>
            <li>4PB storage</li>
        </ul>
    </details>

    <details>
        <summary>Recommended settings</summary>
        <ul>
            <li>Extreme mode: on</li>
            <li>Raytracing: enabled</li>
        </ul>
    </details>
  </el-accordion>
</body>
</html>
```