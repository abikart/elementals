import type { ElButton } from "@elementals/elements/button";
export function setupCounter(element: ElButton) {
	let counter = 0;
	const setCounter = (count: number) => {
		counter = count;
		element.innerHTML = `count is ${counter}`;
	};
	element.addEventListener("click", () => setCounter(counter + 1));
	setCounter(0);
}
