import styles from "./button.css?inline";

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);
document.adoptedStyleSheets.push(sheet);

export * from "./button";
