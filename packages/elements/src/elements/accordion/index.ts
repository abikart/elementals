import styles from "./accordion.css?raw";

// Create our shared stylesheet:
const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);
document.adoptedStyleSheets.push(sheet);

export * from "./accordion";
