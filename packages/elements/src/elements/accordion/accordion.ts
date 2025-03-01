import { animate, getComputedDuration, stopAnimations } from "../../utilities/animation";

interface ExtendedHTMLDetailsElement extends HTMLDetailsElement {
	__el?: unknown;
}

export class ElAccordion extends HTMLElement {
	private items: HTMLCollectionOf<ExtendedHTMLDetailsElement> | null = null;
	private observer: MutationObserver | null = null;

	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
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

	connectedCallback() {
		// Live HTMLcollection of details elements
		this.items = this.getElementsByTagName("details");
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
		for (const item of this.items || []) {
			item.removeEventListener("click", this.handleClick);
		}
	}

	private setupItems() {
		for (const item of this.items || []) {
			if (item.__el) return;
			item.__el = {};
			item.dataset.part = "item";
			item.addEventListener("click", this.handleClick, { capture: true });

			const summary = item.querySelector("summary");
			if (summary) {
				summary.dataset.part = "header";

				// Check for custom indicators
				const customIndicator = summary.querySelector('[data-slot="indicator"]') as HTMLElement;
				const customOpenIndicator = summary.querySelector('[data-slot="indicator-open"]') as HTMLElement;
				const customClosedIndicator = summary.querySelector('[data-slot="indicator-closed"]') as HTMLElement;

				if (customOpenIndicator) customOpenIndicator.dataset.part = "indicator";
				if (customClosedIndicator) customClosedIndicator.dataset.part = "indicator";
				if (customIndicator) customIndicator.dataset.part = "indicator";
			}

			// Get the content (everything after summary)
			const content = Array.from(item.children).filter((child) => child.tagName !== "SUMMARY");
			for (const el of content) {
				(el as HTMLElement).dataset.part = "content";
			}
		}
	}

	private handleClick(event: MouseEvent) {
		console.log("handleClick");
		event.preventDefault();
		if ((event.target as HTMLElement).tagName !== "SUMMARY") {
			return;
		}
		const details = (event.target as HTMLElement).closest("details");
		if (!details || details.getAttribute("aria-disabled") === "true") return;

		if (this.controlled) {
			this.handleControlledToggle(details, details.hasAttribute("open"));
		} else {
			this.handleToggle(details);
		}
	}

	private handleControlledToggle(details: HTMLDetailsElement, isOpenPreviously: boolean) {
		if (isOpenPreviously) {
			const hideEvent = new CustomEvent("ElHide", {
				bubbles: true,
				cancelable: true,
				detail: { open: false, target: details },
			});
			this.dispatchEvent(hideEvent);
		} else {
			const showEvent = new CustomEvent("ElShow", {
				bubbles: true,
				cancelable: true,
				detail: { open: true, target: details },
			});
			this.dispatchEvent(showEvent);
		}
		return;
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

		// await stopAnimations(content as HTMLElement);
		// if (indicator) {
		// 	await stopAnimations(indicator as HTMLElement);
		// }
		if (isOpenPreviously) {
			// Hide
			const hideEvent = new CustomEvent("ElHide", {
				bubbles: true,
				cancelable: true,
				composed: true,
				detail: { open: false, target: details },
			});
			if (self.dispatchEvent(hideEvent)) {
				function afterHide() {
					self.dispatchEvent(
						new CustomEvent("ElAfterHide", {
							bubbles: true,
							detail: { open: false, target: details },
						}),
					);
					details?.removeAttribute("open");
				}
				if (effect) {
					// returns before animation is complete
					this.transitionHide(content).then(() => {
						afterHide();
					});
				} else {
					// returns after animation is complete
					await this.transitionHide(content);
					afterHide();
				}
			}
		} else {
			details.setAttribute("open", "");
			// Show
			const showEvent = new CustomEvent("ElShow", {
				bubbles: true,
				cancelable: true,
				detail: { open: true, target: details },
			});

			if (self.dispatchEvent(showEvent)) {
				if (openPeer) {
					this.handleToggle(openPeer, true);
				}

				await this.transitionShow(content);
				this.dispatchEvent(
					new CustomEvent("ElAfterShow", {
						bubbles: true,
						detail: { open: true, target: details },
					}),
				);
			}
		}
		if (name && openPeer) openPeer.setAttribute("name", name);
	}

	private async transitionShow(content: Element) {
		return new Promise((resolve) => {
			if (!content) resolve("invalidContent");
			const contentEl = content as HTMLElement;
			const scrollHeight = contentEl.scrollHeight;
			contentEl.style.blockSize = "0px";
			contentEl.style.opacity = "0";
			contentEl.style.paddingBlockStart = "0px";
			contentEl.style.paddingBlockEnd = "0px";
			contentEl.setAttribute("data-animatedShow", "");
			requestAnimationFrame(() => {
				contentEl.style.blockSize = `${scrollHeight}px`;
				contentEl.style.opacity = "1";
			});

			const cleanup = () => {
				contentEl.style.blockSize = "";
				contentEl.style.opacity = "";
				contentEl.style.paddingBlockStart = "";
				contentEl.style.paddingBlockEnd = "";
				contentEl.removeAttribute("data-animatedShow");
			};
			contentEl.addEventListener(
				"transitionend",
				() => {
					cleanup();
					resolve("transitionend");
				},
				{ once: true },
			);
			contentEl.addEventListener(
				"transitioncancel",
				() => {
					cleanup();
					resolve("transitioncancel");
				},
				{ once: true },
			);
		});
	}

	private async transitionHide(content: Element) {
		return new Promise((resolve) => {
			if (!content) resolve("invalidContent");
			const contentEl = content as HTMLElement;
			contentEl.style.blockSize = `${contentEl.scrollHeight}px`;
			contentEl.style.paddingBlockStart = "0px";
			contentEl.style.paddingBlockEnd = "0px";
			contentEl.style.opacity = "1";
			contentEl.setAttribute("data-animatedShow", "");
			requestAnimationFrame(() => {
				contentEl.style.blockSize = "0px";
				contentEl.style.opacity = "0";
			});

			const cleanup = () => {
				contentEl.style.blockSize = "";
				contentEl.style.paddingBlockStart = "";
				contentEl.style.paddingBlockEnd = "";
				contentEl.style.opacity = "";
				contentEl.removeAttribute("data-animatedShow");
			};
			contentEl.addEventListener(
				"transitionend",
				() => {
					cleanup();
					resolve("transitionend");
				},
				{ once: true },
			);
			contentEl.addEventListener(
				"transitioncancel",
				() => {
					cleanup();
					resolve("transitioncancel");
				},
				{ once: true },
			);
		});
	}

	private async animateShow(content: Element | null, indicator: Element | null) {
		if (!content) return;
		const duration = getComputedDuration(this, "--el-accordion-duration", 250);
		const easing = getComputedStyle(this).getPropertyValue("--el-accordion-easing").trim() || "ease-in-out";

		const contentEl = content as HTMLElement;
		const indicatorEl = indicator as HTMLElement;

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
		if (indicatorEl) {
			const indicatorKeyframes = [{ transform: "rotate(45deg)" }, { transform: "rotate(-135deg)" }];
			animate(indicatorEl, indicatorKeyframes, {
				duration,
				easing,
			});
		}
		await animate(contentEl, contentKeyframes, {
			duration,
			easing,
		});
	}

	private async animateHide(details: ExtendedHTMLDetailsElement, content: Element | null, indicator: Element | null) {
		if (!content) return;
		const duration = getComputedDuration(this, "--el-accordion-duration", 250);
		const easing = getComputedStyle(this).getPropertyValue("--el-accordion-easing").trim() || "ease-in-out";
		const contentEl = content as HTMLElement;
		const indicatorEl = indicator as HTMLElement;

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

		if (indicatorEl) {
			const indicatorKeyframes = [{ transform: "rotate(-135deg)" }, { transform: "rotate(45deg)" }];
			animate(indicatorEl, indicatorKeyframes, {
				duration,
				easing,
			});
		}

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
