# Component Generation Requirements for @elementals/elements

## Core Principles
1. **Platform First**: Before adding custom functionality, thoroughly research and leverage existing platform features:
   - Native HTML elements and attributes
   - Built-in browser events
   - Standard DOM APIs
   - Native accessibility features
2. **Progressive Enhancement**: Only add custom behavior when:
   - The platform lacks the needed functionality
   - There are significant cross-browser inconsistencies
   - The user experience can be meaningfully improved
3. **Documentation First**: Document platform features being used and why custom enhancements are needed
4. **Enhancement Patterns**: When adding features not supported by the platform:
   - Prefer ARIA attributes for state/behavior when semantically appropriate
   - When introducing new component properties that affect behavior or state management, choose simple, intuitive names (for example, `controlled` for externally managed state) rather than using data-* prefixes.
   - Use data-* attributes for truly custom features
   - Document clearly which features are enhancements vs native
   - Explain the rationale for added features
   - Consider progressive enhancement implications

Create a new component <component-name> inside the `packages/elements/src/elements` directory following these requirements:

## File Structure
1. Create the following files:
   - src/elements/<component-name>/<component-name>.ts
   - src/elements/<component-name>/<component-name>.css
   - src/elements/<component-name>/<component-name>.d.ts
   - src/elements/<component-name>/index.ts
   - src/elements/<component-name>/<component-name>.md

## Implementation Requirements

### TypeScript Component (component-name.ts)
1. Extend HTMLElement
2. Use private fields for internal state
3. Implement standard lifecycle methods:
   - constructor()
   - connectedCallback()
   - disconnectedCallback()
   - attributeChangedCallback() (if using observed attributes)
4. Bind event handlers in constructor
5. **(Optional) Support Externally Controlled State:**
   - If the component should support a controlled/uncontrolled pattern, implement a boolean property/attribute (e.g., `controlled`) that, when present, disables the component's internal state management.
   - In controlled mode, the component will only dispatch custom events (e.g., `el-show`, `el-hide`, etc.) to notify the consumer of state changes. It will not update the DOM (such as toggling the `open` attribute) automatically.
   - Ensure that documentation clearly explains that in controlled mode, the consuming application is responsible for updating the state.
6. Use data-part attributes for styling hooks
7. Follow non-DOM mutating principles
8. Use native events when available, only create custom events if necessary
9. Register component with 'el-' prefix

### Styles (component-name.css)
1. Use CSS custom properties with fallbacks
2. Use CSS logical properties for RTL support
3. Target elements using [data-part] selectors
4. Define component-specific custom properties following the naming convention:
   - Use `--el-<component>-<property>` format
   - Group properties by category:
     - Global theme overrides
     - Component-specific layout
     - States
     - Animation
   - Each property should fall back to a global theme token
5. Use global design tokens as fallbacks
6. Avoid Shadow DOM
7. Use BEM-like naming for data-part attributes
8. Document all CSS custom properties in the component's markdown file
9. Define explicit content structure requirements

### Types (component-name.d.ts)
1. Export component interface extending HTMLElement
2. Define event detail interfaces only for custom events
3. Define public API types
4. Add component to HTMLElementTagNameMap
5. Document all public methods and properties

### Entry Point (index.ts)
1. Import CSS as raw
2. Create and adopt shared stylesheet
3. Export component class

### Build Integration
1. Add component entry to tsup.config.ts
2. Add component to package.json exports

## Component Guidelines
1. Follow progressive enhancement
2. Research platform features first
3. Ensure keyboard accessibility
4. Support internationalization
5. Implement proper ARIA attributes
6. Handle dynamic content changes
7. Clean up event listeners and observers
8. Support framework integration
9. Follow semantic HTML principles
10. Use data-part for internal structure
11. Use data-slot for user customization
12. Keep customization API simple and intuitive

## Testing Requirements
1. Create unit tests for component logic
2. Test accessibility features
3. Test RTL support
4. Test framework integration
5. Test progressive enhancement

## Documentation Requirements
1. Document public API
2. Document platform features being used
3. Justify any custom functionality
4. Provide usage examples
5. Document CSS custom properties
6. Document required content structure:
   - Required wrapper elements
   - Content organization
   - Examples of correct and incorrect usage
7. Document events
8. Document accessibility features
9. Include concise functional description
10. Document all data-parts (internal structure)
11. Document all data-slots (customization points)
12. Provide examples for each customization point
13. Group CSS custom properties by category in documentation
14. Include examples of global and component-specific theming

---

Note: Replace <component-name> with the actual component name in kebab-case format.