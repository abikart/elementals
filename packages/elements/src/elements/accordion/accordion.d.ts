export interface ElAccordionEventDetail {
	open: boolean;
}

export interface ElAccordionElement extends HTMLElement {
	addEventListener(
		type: "el-show" | "el-after-show" | "el-hide" | "el-after-hide",
		listener: (event: CustomEvent<ElAccordionEventDetail>) => void,
		options?: boolean | AddEventListenerOptions,
	): void;
	removeEventListener(
		type: "el-show" | "el-after-show" | "el-hide" | "el-after-hide",
		listener: (event: CustomEvent<ElAccordionEventDetail>) => void,
		options?: boolean | EventListenerOptions,
	): void;
}

declare global {
	interface HTMLElementTagNameMap {
		"el-accordion": ElAccordionElement;
	}
}
