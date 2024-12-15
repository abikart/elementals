import type { Plugin } from "esbuild";

declare function rawPlugin(): Plugin;

export { rawPlugin as default };
