import fs from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { generateColorTokens } from "./lib/color";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	build: {
		lib: {
			entry: {
				"color/index": resolve(__dirname, "lib/color/index.ts"),
				"color/primitives": resolve(__dirname, "lib/color/primitives.ts"),
			},
			formats: ["es"],
		},
	},
	plugins: [
		dts({
			entryRoot: resolve(__dirname, "lib"),
		}),
		{
			name: "generate-color-tokens",
			closeBundle: async () => {
				const cssContent = generateColorTokens();
				fs.writeFileSync("dist/color.css", cssContent, "utf-8");
			},
		},
	],
});
