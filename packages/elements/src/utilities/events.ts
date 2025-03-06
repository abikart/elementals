/**
 * Event management utilities for custom elements
 */

interface EventControllerOptions<T> {
	events: Array<keyof T>;
}

/**
 * Creates an event controller for managing custom events with type safety
 * @template T - Event map interface defining custom events
 * @param target - The EventTarget that will dispatch events
 * @param options - Configuration options including list of valid events
 * @returns Event controller with type-safe methods
 */
export function createEventController(target: EventTarget) {
	const controller = new AbortController();

	return {
		/**
		 * Dispatches a custom event with type checking
		 * @param eventName - Name of the event to dispatch
		 * @param detail - Event detail object
		 * @returns boolean indicating if the event was cancelled
		 */
		dispatch(eventName: string, detail: unknown): boolean {
			return target.dispatchEvent(
				new CustomEvent(eventName as string, {
					detail,
					bubbles: true,
					cancelable: true,
				}),
			);
		},

		/**
		 * Adds an event listener with proper typing
		 */
		addEventListener<E extends Event>(
			element: EventTarget,
			type: string,
			listener: (event: E) => void,
			options?: AddEventListenerOptions,
		): void {
			element.addEventListener(type, listener as EventListener, {
				...options,
				signal: controller.signal,
			});
		},

		/**
		 * Aborts all registered event listeners
		 */
		abort(): void {
			controller.abort();
		},
	};
}
