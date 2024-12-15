import { animate, getComputedDuration, stopAnimations } from "../../utilities/animation";
import accordion_default from "./accordion.css?raw";

const sheet = new CSSStyleSheet();
sheet.replaceSync(accordion_default);
document.adoptedStyleSheets.push(sheet);

export class ElAccordion extends HTMLElement {
	private items: HTMLDetailsElement[] = [];

	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	connectedCallback() {
		this.items = Array.from(this.querySelectorAll("details"));
		this.setupItems();

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
			item.removeEventListener("click", this.handleClick);
		}
	}

	private setupItems() {
		for (const item of this.items) {
			item.setAttribute("data-part", "item");
			item.addEventListener("click", this.handleClick, { capture: true });

			const summary = item.querySelector("summary");
			if (summary) {
				summary.setAttribute("data-part", "header");

				// Check for custom indicators
				const hasCustomOpenIndicator = summary.querySelector('[data-slot="indicator-open"]');
				const hasCustomClosedIndicator = summary.querySelector('[data-slot="indicator-closed"]');

				if (!hasCustomOpenIndicator && !hasCustomClosedIndicator) {
					const defaultIndicator = document.createElement("span");
					defaultIndicator.setAttribute("data-part", "indicator");
					defaultIndicator.setAttribute("data-indicator", "default");
					summary.appendChild(defaultIndicator);
				} else {
					if (hasCustomOpenIndicator) {
						hasCustomOpenIndicator.setAttribute("data-part", "indicator-open");
					}
					if (hasCustomClosedIndicator) {
						hasCustomClosedIndicator.setAttribute("data-part", "indicator-closed");
					}
				}
			}

			// Get the content (everything after summary)
			const content = Array.from(item.children).filter((child) => child.tagName.toLowerCase() !== "summary");
			for (const el of content) {
				el.setAttribute("data-part", "content");
			}
		}
	}

	private async handleClick(event: MouseEvent) {
		const details = (event.target as Element).closest("details");
		if (!details) return;

		// Always prevent default toggle behavior
		event.preventDefault();

		// Prevent toggle if disabled
		if (details.getAttribute("aria-disabled") === "true") {
			return;
		}

		const isOpen = details.hasAttribute("open");
		const content = details.querySelector('[data-part="content"]');
		if (!content) return;

		// Stop any running animations
		await stopAnimations(content as HTMLElement);

		if (!isOpen) {
			// Show
			details.setAttribute("open", "");

			// Emit show event
			const showEvent = new CustomEvent("el-show", {
				bubbles: true,
				cancelable: true,
				detail: { open: true },
			});

			if (details.dispatchEvent(showEvent)) {
				await this.animateShow(content);
				details.dispatchEvent(
					new CustomEvent("el-after-show", {
						bubbles: true,
						detail: { open: true },
					}),
				);
			}
		} else {
			// Hide
			const hideEvent = new CustomEvent("el-hide", {
				bubbles: true,
				cancelable: true,
				detail: { open: false },
			});

			if (details.dispatchEvent(hideEvent)) {
				await this.animateHide(content);
				details.removeAttribute("open");
				details.dispatchEvent(
					new CustomEvent("el-after-hide", {
						bubbles: true,
						detail: { open: false },
					}),
				);
			}
		}
	}

	private async animateShow(content: Element) {
		const duration = getComputedDuration(this, "--el-accordion-duration", 250);
		const easing = getComputedStyle(this).getPropertyValue("--el-accordion-easing").trim() || "ease";

		const contentEl = content as HTMLElement;

		// Start with content hidden
		contentEl.style.height = "0";
		contentEl.style.opacity = "0";

		// Force a reflow
		contentEl.offsetHeight;

		// Get expanded height
		const height = contentEl.scrollHeight;

		// Show content with animation
		const keyframes = [
			{ height: "0", opacity: "0" },
			{ height: `${height}px`, opacity: "1" },
		];

		await animate(contentEl, keyframes, {
			duration,
			easing,
		});

		// Clean up inline styles
		contentEl.style.height = "";
		contentEl.style.opacity = "";
	}

	private async animateHide(content: Element) {
		const duration = getComputedDuration(this, "--el-accordion-duration", 250);
		const easing = getComputedStyle(this).getPropertyValue("--el-accordion-easing").trim() || "ease";

		const contentEl = content as HTMLElement;

		// Start with content visible
		const height = contentEl.scrollHeight;

		// Hide content with animation
		const keyframes = [
			{
				height: `${height}px`,
				opacity: "1",
			},
			{
				height: "0",
				opacity: "0",
			},
		];

		await animate(contentEl, keyframes, {
			duration,
			easing,
		});

		// Clean up inline styles
		contentEl.style.height = "";
		contentEl.style.opacity = "";
	}
}

// Register the custom element
if (!customElements.get("el-accordion")) {
	customElements.define("el-accordion", ElAccordion);
}
