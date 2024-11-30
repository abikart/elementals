import RawPlugin from "esbuild-plugin-raw";
import { defineConfig } from "tsup";

export default defineConfig((options) => {
	return {
		entry: {
			button: "src/elements/button/index.ts",
			primitives: "src/tokens/primitives.ts",
		},
		outDir: "dist",
		format: ["esm"],
		clean: true,
		minify: true,
		dts: true,
		esbuildPlugins: [RawPlugin()],
		outExtension({ format }) {
			return {
				js: `${format === "esm" ? "" : `.${format}`}.js`,
			};
		},
	};
});
