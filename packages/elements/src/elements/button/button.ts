// TODO: optimize raw loader to remove spaces in css
import styles from "./button.css?raw";

const sheet = new CSSStyleSheet();
sheet
	.replace(styles)
	.then(() => {
		document.adoptedStyleSheets.push(sheet);
	})
	.catch((err) => {
		console.error("Failed to replace styles:", err);
	});

class Button extends HTMLElement {
	connectedCallback() {
		queueMicrotask(() => {
			this.mount();
		});
	}

	mount() {}
}

export default Button;
