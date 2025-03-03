export class ElButton extends HTMLElement {
	connectedCallback() {
		queueMicrotask(() => {
			this.mount();
		});
	}

	mount() {}
}

if (!customElements.get("el-button")) {
	customElements.define("el-button", ElButton);
}
