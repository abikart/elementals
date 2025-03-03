# Color Token Context

## Overview
A semantic color system that builds on primitive colors to create meaningful, contextual tokens for UI components. The system supports theming and dark mode.

## Architecture

### 1. Primitive Layer
- Base colors defined in OKLCH color space
- Each color has 11 shades (50-950)
- Includes sRGB fallbacks for compatibility
- Influenced by Tailwind's color palette
- Example: `--el-color-blue-500`, `--el-color-red-700`

### 2. Semantic Layer
The semantic layer is divided into two main categories:

#### A. Neutral Palette
A dedicated palette for non-chromatic colors used extensively throughout the UI:
- Base UI elements
- Text colors
- Backgrounds
- Borders
- Shadows
- Overlays

#### B. Accent Palettes
Color palettes for UI elements that need emphasis or convey meaning:
- accent: Primary actions and highlights (blue)
- success: Positive actions/states (green)
- danger: Destructive actions/warnings (red)
- warning: Cautionary states (amber)
- info: Informational elements (blue)

Each palette (neutral and accents) defines colors across three dimensions:

#### Usage
How the color is applied:
- bg: Background colors
- fg: Foreground/text colors
- border: Border colors
- shadow: Shadow colors
- outline: Focus outline colors

#### Prominence
Visual weight of the element:
- weak: Subtle or secondary elements
- normal: Default state
- strong: Emphasized elements

#### Interaction
Element's interactive state:
- idle: Default state
- hovered: Mouse hover state
- pressed: Active/pressed state
- focused: Keyboard focus state
- disabled: Disabled state
- selected: Selected state

### 3. Token Structure
Tokens follow two patterns:
- Neutral: `--el-color-neutral-{usage}-{prominence}-{interaction}`
- Accents: `--el-color-{accent}-{usage}-{prominence}-{interaction}`

Examples: 
- `--el-color-neutral-bg-normal-idle`
- `--el-color-accent-bg-normal-idle`

## Shade Mapping

### Design Decisions
1. Organized mappings by token rather than mode for better cognitive mapping:
```typescript
const shadeMapping = {
  "bg-weak-idle": { light: "50", dark: "950" },
  "bg-normal-idle": { light: "100", dark: "900" },
  // ...
}
```

2. State tokens (disabled/selected) bypass prominence:
- Example: `bg-disabled` instead of `bg-normal-disabled`

### Dark Mode
- Each token maps to different shades in light/dark modes
- Maintains consistent contrast ratios across modes
- Automatically switches via media query

## Implementation Features

### 1. Validation
- Runtime validation of token combinations
- Fallback to safe defaults for invalid combinations
- Warning system for development

### 2. Simplified Token Generation
- Removed fallback token generation.
- The color tokens now use modern color spaces exclusively.

## Usage Guidelines

### 1. Component Implementation
```css
.component {
  /* Use static sentiments */
  background: var(--el-color-accent-bg-normal-idle);
}
```

### 2. Best Practices
- Use semantic tokens instead of primitive colors
- Follow usage patterns for consistent UI
- Test color contrast in both light and dark modes

## Type Safety
- Full TypeScript support
- Const assertions for enums
- Type checking for token combinations
- Exported types for external use

## Future Considerations
1. Additional color spaces support
2. Custom sentiment definitions
3. Theme generation tools
4. Component-specific token presets
5. Animation support for sentiment transitions

## References
- OKLCH Color Space
- Tailwind Colors
- Asana's Design Tokens

## Updated Color Generation Approach

We now define "colorCurves" in primitives.ts, mapping each named color (slate, gray, etc.) to a set of four OKLCH control points. An interpolation function generates an 11-step scale (50..950) for each color. This more closely matches Tailwind's hand-tuned palette while remaining systematically extensible.