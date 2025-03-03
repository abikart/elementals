import { resolve } from "node:path";
import { glob } from "glob";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// Get all element entry points
const entries = glob.sync("src/elements/*/index.ts").reduce((acc, path) => {
	const parts = path.split("/");
	acc[`${parts[1]}/${parts[2]}`] = resolve(__dirname, path);
	return acc;
}, {});

export default defineConfig({
	build: {
		lib: {
			entry: entries,
			formats: ["es"],
			fileName: (format, entryName) => `${entryName}/index.js`,
		},
		sourcemap: true,
		target: "es2018",
		rollupOptions: {
			external: [], // Add external dependencies here if needed
		},
	},
	plugins: [dts()],
});
