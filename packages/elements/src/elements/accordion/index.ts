import { ElAccordion } from "./accordion";
import styles from "./accordion.css?inline";

// Register the custom element
if (typeof window !== "undefined" && !customElements.get("el-accordion")) {
	customElements.define("el-accordion", ElAccordion);

	// Create our shared stylesheet:
	const sheet = new CSSStyleSheet();
	sheet.replaceSync(styles);
	document.adoptedStyleSheets.push(sheet);
}

export * from "./accordion";
