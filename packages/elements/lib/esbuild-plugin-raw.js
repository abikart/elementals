// Copy of esbuild-plugin-raw@v0.1.8
// Fixes the warning where the plugin is looking for older versions of esbuild as a peer dependency
// src/index.ts
import { readFile } from "node:fs/promises";
import path from "node:path";
function rawPlugin() {
	return {
		name: "raw",
		setup(build) {
			build.onResolve({ filter: /\?raw$/ }, (args) => {
				return {
					path: args.path,
					pluginData: {
						isAbsolute: path.isAbsolute(args.path),
						resolveDir: args.resolveDir,
					},
					namespace: "raw-loader",
				};
			});
			build.onLoad({ filter: /\?raw$/, namespace: "raw-loader" }, async (args) => {
				const fullPath = args.pluginData.isAbsolute ? args.path : path.join(args.pluginData.resolveDir, args.path);
				return {
					contents: await readFile(fullPath.replace(/\?raw$/, "")),
					loader: "text",
				};
			});
		},
	};
}
export { rawPlugin as default };
