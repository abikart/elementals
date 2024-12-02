export class ElAccordion extends HTMLElement {
	private items: HTMLDetailsElement[] = [];

	constructor() {
		super();
		this.handleToggle = this.handleToggle.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	connectedCallback() {
		// Initialize with existing details elements
		this.items = Array.from(this.querySelectorAll("details"));
		this.setupItems();

		// Set up mutation observer to handle dynamically added details
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === "childList") {
					this.items = Array.from(this.querySelectorAll("details"));
					this.setupItems();
				}
			}
		});

		observer.observe(this, { childList: true, subtree: true });
	}

	disconnectedCallback() {
		for (const item of this.items) {
			item.removeEventListener("toggle", this.handleToggle);
			item.removeEventListener("click", this.handleClick);
		}
	}

	private setupItems() {
		for (const item of this.items) {
			item.setAttribute("data-part", "item");
			item.addEventListener("toggle", this.handleToggle);
			item.addEventListener("click", this.handleClick, { capture: true });

			const summary = item.querySelector("summary");
			if (summary) {
				summary.setAttribute("data-part", "header");

				// Check for custom indicators
				const hasCustomOpenIndicator = summary.querySelector(
					'[data-slot="indicator-open"]',
				);
				const hasCustomClosedIndicator = summary.querySelector(
					'[data-slot="indicator-closed"]',
				);

				if (!hasCustomOpenIndicator && !hasCustomClosedIndicator) {
					// Create default indicator container only if no custom ones exist
					const defaultIndicator = document.createElement("span");
					defaultIndicator.setAttribute("data-part", "indicator");
					defaultIndicator.setAttribute("data-indicator", "default");
					summary.appendChild(defaultIndicator);
				} else {
					// Add data-part to custom indicators for consistent styling
					if (hasCustomOpenIndicator) {
						hasCustomOpenIndicator.setAttribute("data-part", "indicator-open");
					}
					if (hasCustomClosedIndicator) {
						hasCustomClosedIndicator.setAttribute(
							"data-part",
							"indicator-closed",
						);
					}
				}
			}

			// Get the content (everything after summary)
			const content = Array.from(item.children).filter(
				(child) => child.tagName.toLowerCase() !== "summary",
			);
			for (const el of content) {
				el.setAttribute("data-part", "content");
			}
		}
	}

	private handleToggle(event: Event) {
		// Let native event bubble
	}

	private handleClick(event: MouseEvent) {
		const details = (event.target as Element).closest("details");
		if (!details) return;

		// Prevent toggle if disabled
		if (details.getAttribute("aria-disabled") === "true") {
			event.preventDefault();
			event.stopPropagation();
		}
	}
}

// Register the custom element
if (!customElements.get("el-accordion")) {
	customElements.define("el-accordion", ElAccordion);
}
