import "./style.css";
import { setupCounter } from "./counter.ts";
import "elementals/button";

const root = document.querySelector<HTMLDivElement>("#app");
const button = document.querySelector<HTMLButtonElement>("#counter");

if (!root) {
	throw new Error("No root element found");
}
root.innerHTML = `
  <div>
    <el-button>
      <button id="counter" type="button"></button>
    </el-button>
  </div>
`;

if (button) setupCounter(button);
