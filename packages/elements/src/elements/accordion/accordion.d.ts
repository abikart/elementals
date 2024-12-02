export interface ElAccordionElement extends HTMLElement {
	// No custom properties or events needed - using native functionality
}

declare global {
	interface HTMLElementTagNameMap {
		"el-accordion": ElAccordionElement;
	}
}
