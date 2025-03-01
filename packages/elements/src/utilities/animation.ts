/** Tells if the user has enabled the "reduced motion" setting in their browser or OS. */
export function prefersReducedMotion() {
	const query = window.matchMedia("(prefers-reduced-motion: reduce)");
	return query.matches;
}

/** Parses a CSS duration and returns the number of milliseconds. */
export function parseDuration(input: number | string) {
	const value = input.toString().toLowerCase();
	if (value.indexOf("ms") > -1) {
		return Number.parseFloat(value);
	}
	if (value.indexOf("s") > -1) {
		return Number.parseFloat(value) * 1000;
	}
	return Number.parseFloat(value);
}

/**
 * Animates an element using keyframes. Returns a promise that resolves after the animation completes or gets canceled.
 */
export function animate(el: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions = {}) {
	return new Promise<void>((resolve) => {
		if (options.duration === Number.POSITIVE_INFINITY) {
			throw new Error("Promise-based animations must be finite.");
		}

		const animation = el.animate(keyframes, {
			...options,
			duration: prefersReducedMotion() ? 0 : options.duration,
		});

		animation.addEventListener("cancel", () => resolve(), { once: true });
		animation.addEventListener("finish", () => resolve(), { once: true });
	});
}

/**
 * Stops all active animations on the target element.
 * Returns a promise that resolves after all animations are canceled.
 */
export function stopAnimations(el: HTMLElement) {
	return Promise.all(
		el.getAnimations().map((animation) => {
			return new Promise<void>((resolve) => {
				console.log("stopAnimations", el);
				animation.cancel();
				requestAnimationFrame(() => resolve());
			});
		}),
	);
}

/**
 * We can't animate `height: auto`, but we can calculate the height and replace
 * it with the element's scrollHeight before the animation.
 */
export function autoHeightKeyframes(keyframes: Keyframe[], calculatedHeight: number) {
	return keyframes.map((keyframe) => ({
		...keyframe,
		height: keyframe.height === "auto" ? `${calculatedHeight}px` : keyframe.height,
	}));
}

/**
 * Get computed duration from CSS custom property or fallback
 */
export function getComputedDuration(el: HTMLElement, propertyName: string, fallback = 250) {
	const durationStr = getComputedStyle(el).getPropertyValue(propertyName);
	return durationStr ? parseDuration(durationStr) : fallback;
}
