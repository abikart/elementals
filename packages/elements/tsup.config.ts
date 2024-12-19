import fs from "node:fs";
import { defineConfig } from "tsup";
import RawPlugin from "./lib/esbuild-plugin-raw";
import { generateColorTokens } from "./src/tokens/color";

export default defineConfig({
	entry: [
		"src/elements/*/index.ts",
		"src/tokens/primitives.ts",
		"src/tokens/color.ts",
		// Add an entry for the tokens if needed
	],
	format: ["esm"],
	target: "es2018",
	dts: true,
	clean: true,
	sourcemap: true,
	esbuildPlugins: [RawPlugin()],
	onSuccess: async () => {
		// Generate the color CSS variables and write to a file
		const cssContent = generateColorTokens();
		fs.writeFileSync("dist/color.css", cssContent, "utf-8");

		// Optionally, copy the CSS file to a specific location
		// fs.copyFileSync('dist/color.css', 'path/to/output/color.css');
	},
});
