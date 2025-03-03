import { animate, getComputedDuration, stopAnimations } from "../../utilities/animation";
import { createEventController } from "../../utilities/events";

interface ExtendedHTMLDetailsElement extends HTMLDetailsElement {
	__el?: unknown;
}

// Define event types
interface AccordionEventMap {
	ElShow: CustomEvent<{ open: boolean; target: HTMLDetailsElement }>;
	ElHide: CustomEvent<{ open: boolean; target: HTMLDetailsElement }>;
	ElAfterShow: CustomEvent<{ open: boolean; target: HTMLDetailsElement }>;
	ElAfterHide: CustomEvent<{ open: boolean; target: HTMLDetailsElement }>;
}

export class ElAccordion extends HTMLElement {
	private detailsList: HTMLCollectionOf<ExtendedHTMLDetailsElement> | null = null;
	private observer: MutationObserver | null = null;
	private events = createEventController(this);

	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	static get observedAttributes() {
		return ["controlled", "experimental"];
	}

	/**
	 * @property {boolean} controlled - Whether the accordion's state is controlled from outside
	 * @default false
	 * @details
	 * If true, the accordion's state will not be managed internally
	 * and only the ElShow and ElHide events will be dispatched.
	 * The ElAfterShow and ElAfterHide events will not be dispatched.
	 * The user manages the open/close state of the accordion in response to the ElShow and ElHide events.
	 */
	private _controlled = false;
	get controlled() {
		return this._controlled;
	}
	set controlled(value: boolean) {
		this._controlled = value;
		if (value) {
			this.setAttribute("controlled", "");
		} else {
			this.removeAttribute("controlled");
		}
	}

	/**
	 * @property {boolean} experimental - Enable experimental features.
	 * @default false
	 * @details
	 * Uses modern CSS transition features like calc-size(), transition-behavior: allow-discrete, auto block-size etc. instead of Web Animations API.
	 */
	private _experimental = false;
	get experimental() {
		return this._experimental;
	}
	set experimental(value: boolean) {
		this._experimental = value;
		if (value) {
			this.setAttribute("experimental", "");
		} else {
			this.removeAttribute("experimental");
		}
	}

	attributeChangedCallback(name: string, _: string, newValue: string) {
		if (name === "experimental") {
			this._experimental = newValue === "";
		}
		if (name === "controlled") {
			this._controlled = newValue === "";
		}
	}

	connectedCallback() {
		// Live HTMLcollection of details elements
		this.detailsList = this.getElementsByTagName("details");
		this.setupItems();

		this.observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === "childList") {
					this.setupItems();
				}
			}
		});

		this.observer.observe(this, { childList: true });
	}

	disconnectedCallback() {
		this.observer?.disconnect();
		this.events.abort(); // Cancel all event listeners at once
	}

	private setupItems() {
		for (const details of this.detailsList || []) {
			if (details.__el) return;
			details.__el = {};
			this.events.addEventListener(details, "click", this.handleClick, { capture: true });
			const content = Array.from(details.children).filter((child) => child.tagName !== "SUMMARY");
			for (const el of content) {
				(el as HTMLElement).dataset.part = "content";
			}
		}
	}

	private handleClick(event: MouseEvent) {
		event.preventDefault();
		if ((event.target as HTMLElement).tagName !== "SUMMARY") {
			return;
		}
		const details = (event.target as HTMLElement).closest("details");
		if (!details || details.getAttribute("aria-disabled") === "true") return;

		if (this._controlled) {
			this.handleControlledToggle(details, details.hasAttribute("open"));
		} else if (this._experimental) {
			this.handleExperimentalToggle(details, details.hasAttribute("open"));
		} else {
			this.handleToggle(details);
		}
	}

	private handleControlledToggle(details: HTMLDetailsElement, isOpenPreviously: boolean) {
		if (isOpenPreviously) {
			this.events.dispatch("ElHide", { open: false, target: details });
		} else {
			this.events.dispatch("ElShow", { open: true, target: details });
		}
	}

	private handleExperimentalToggle(details: HTMLDetailsElement, isOpenPreviously: boolean) {
		if (isOpenPreviously) {
			if (this.events.dispatch("ElHide", { open: false, target: details })) {
				details.removeAttribute("open");
				details.addEventListener("transitionend", (e) => {
					if (e.target === details && e.propertyName === "block-size") {
						this.events.dispatch("ElAfterHide", { open: false, target: details });
					}
				});
			}
		} else {
			if (this.events.dispatch("ElShow", { open: true, target: details })) {
				details.setAttribute("open", "");
				details.addEventListener("transitionend", (e) => {
					if (e.target === details && e.propertyName === "block-size") {
						this.events.dispatch("ElAfterShow", { open: true, target: details });
					}
				});
			}
		}
	}

	private async handleToggle(details: HTMLDetailsElement, effect = false) {
		// Prevent toggle if disabled
		if (details.getAttribute("aria-disabled") === "true") {
			return;
		}
		const self = this as ElAccordion;
		/**
		 * use name native attribute for single open state
		 * animation works only when open
		 * when target detail is opened, keep the other accordion items to be closed as open, animate and then close
		 * when target detail is closed, animate first and then open
		 */
		const isOpenPreviously = details.hasAttribute("open");
		const content = details.querySelector('[data-part="content"]');
		if (!content) return;
		const indicator = details.querySelector('[data-part="indicator"]');
		const name = details.getAttribute("name");
		let openPeer: HTMLDetailsElement | undefined;
		if (name && !effect) {
			openPeer = details.closest("el-accordion")?.querySelector(`[name="${name}"][open]`) as HTMLDetailsElement;
			openPeer?.removeAttribute("name");
		}

		await stopAnimations(content as HTMLElement);
		if (isOpenPreviously) {
			// Hide
			if (this.events.dispatch("ElHide", { open: false, target: details })) {
				details.setAttribute("data-hiding", "");
				function afterHide() {
					self.events.dispatch("ElAfterHide", { open: false, target: details });
					details?.removeAttribute("open");
					details?.removeAttribute("data-hiding");
				}
				if (effect) {
					// returns before animation is complete
					this.animateHide(content).then(() => {
						afterHide();
					});
				} else {
					// returns after animation is complete
					await this.animateHide(content);
					afterHide();
				}
			}
		} else {
			details.setAttribute("open", "");
			// Show
			if (this.events.dispatch("ElShow", { open: true, target: details })) {
				if (openPeer) {
					this.handleToggle(openPeer, true);
				}

				await this.animateShow(content);
				this.events.dispatch("ElAfterShow", { open: true, target: details });
			}
		}
		if (name && openPeer) openPeer.setAttribute("name", name);
	}

	private async animateShow(content: Element | null) {
		if (!content) return;
		const duration = getComputedDuration(this, "--el-accordion-duration", 250);
		const easing = getComputedStyle(this).getPropertyValue("--el-accordion-easing").trim() || "ease-in-out";

		const contentEl = content as HTMLElement;
		const height = contentEl.scrollHeight;
		const paddingBlockStart = getComputedStyle(contentEl).getPropertyValue("padding-block-start");
		const paddingBlockEnd = getComputedStyle(contentEl).getPropertyValue("padding-block-end");
		const contentKeyframes = [
			{ height: "0", opacity: "0", paddingBlockStart: "0", paddingBlockEnd: "0" },
			{
				height: `${height}px`,
				opacity: "1",
				paddingBlockStart: paddingBlockStart,
				paddingBlockEnd: paddingBlockEnd,
			},
		];
		await animate(contentEl, contentKeyframes, {
			duration,
			easing,
		});
	}

	private async animateHide(content: Element | null) {
		if (!content) return;
		const duration = getComputedDuration(this, "--el-accordion-duration", 250);
		const easing = getComputedStyle(this).getPropertyValue("--el-accordion-easing").trim() || "ease-in-out";
		const contentEl = content as HTMLElement;
		// Start with content visible
		const height = contentEl.scrollHeight;
		const paddingBlockStart = getComputedStyle(contentEl).getPropertyValue("padding-block-start");
		const paddingBlockEnd = getComputedStyle(contentEl).getPropertyValue("padding-block-end");
		// Hide content with animation
		const contentKeyframes = [
			{
				height: `${height}px`,
				opacity: "1",
				paddingBlockStart: paddingBlockStart,
				paddingBlockEnd: paddingBlockEnd,
			},
			{
				height: "0",
				opacity: "0",
				paddingBlockStart: "0",
				paddingBlockEnd: "0",
			},
		];
		await animate(contentEl, contentKeyframes, {
			duration,
			easing,
		});
	}
}

// Register the custom element
if (!customElements.get("el-accordion")) {
	customElements.define("el-accordion", ElAccordion);
}
