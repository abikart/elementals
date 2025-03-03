/**
 * Event management utilities for custom elements
 */

/**
 * Creates a controller for managing custom events with consistent naming and behavior
 * @param element The element that will dispatch events
 * @returns An object with methods for dispatching and managing events
 */
export function createEventController(element: HTMLElement) {
	const abortController = new AbortController();

	return {
		/**
		 * Dispatch a custom event with standardized naming
		 * @param type Base event name (will be prefixed and capitalized)
		 * @param detail Event detail data
		 * @returns Boolean indicating if the event was canceled
		 */
		dispatch: <T>(type: string, detail: T): boolean => {
			const event = new CustomEvent(type, {
				bubbles: true,
				cancelable: true,
				composed: true, // For shadow DOM boundary crossing
				detail,
			});

			return element.dispatchEvent(event);
		},

		/**
		 * Get the abort signal for use with event listeners
		 */
		get signal() {
			return abortController.signal;
		},

		/**
		 * Cancel all event listeners using this controller's signal
		 */
		abort: () => {
			abortController.abort();
		},

		/**
		 * Add an event listener with the controller's abort signal
		 */
		addEventListener: <K extends keyof HTMLElementEventMap>(
			target: HTMLElement,
			type: K,
			listener: (ev: HTMLElementEventMap[K]) => void,
			options?: Omit<AddEventListenerOptions, "signal">,
		) => {
			target.addEventListener(type, listener, {
				...options,
				signal: abortController.signal,
			});
		},
	};
}
