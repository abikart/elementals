import "./style.css";
import { setupCounter } from "./counter.ts";
import "@elementals/elements/button";
import type { ElButton } from "@elementals/elements/button";
import "@elementals/elements/accordion";
import type { ElAccordion } from "@elementals/elements/accordion";

const root = document.querySelector<HTMLDivElement>("#app");
const button = document.querySelector<ElButton>("#counter");
const accordion = document.querySelector<ElAccordion>("#accordion");
if (accordion) accordion.experimental = true;
accordion?.addEventListener("ElShow", (e) => {
	console.log(e);
});

if (!root) {
	throw new Error("No root element found");
}
root.innerHTML = `
  <div>
    <el-button>
      <button id="counter" type="button">Test</button>
    </el-button>
    <br />
    <el-accordion experimental>
      <details name="accordion">
        <summary>Accordion</summary>
        <p>This is an accordion.</p>
      </details>
    </el-accordion>
  </div>
`;

if (button) setupCounter(button);
