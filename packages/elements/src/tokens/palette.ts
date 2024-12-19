import type { Interaction, Prominence, Usage } from "./color";

type InteractionMap = Partial<Record<Interaction, Mode>>;
type ProminenceMap = Partial<Record<Prominence, InteractionMap>>;
type PaletteDefinitions = Partial<Record<Usage, ProminenceMap>>;
type Mode = { light: string; dark: string };

// Neutral palette for lighter backgrounds and clear text contrast
export const neutralPaletteDefinitions: PaletteDefinitions = {
	base: {
		normal: {
			idle: { light: "0", dark: "1000" },
			hovered: { light: "50", dark: "950" },
			pressed: { light: "100", dark: "900" },
			disabled: { light: "0", dark: "1000" },
			selected: { light: "50", dark: "950" },
		},
	},
	bg: {
		weak: {
			idle: { light: "0", dark: "1000" },
			hovered: { light: "50", dark: "950" },
			pressed: { light: "100", dark: "900" },
			disabled: { light: "0", dark: "1000" },
			selected: { light: "50", dark: "950" },
		},
		normal: {
			idle: { light: "50", dark: "950" },
			hovered: { light: "100", dark: "900" },
			pressed: { light: "200", dark: "800" },
			disabled: { light: "0", dark: "1000" },
			selected: { light: "100", dark: "900" },
		},
		strong: {
			idle: { light: "100", dark: "900" },
			hovered: { light: "200", dark: "800" },
			pressed: { light: "300", dark: "700" },
			disabled: { light: "50", dark: "950" },
			selected: { light: "200", dark: "800" },
		},
	},
	fg: {
		weak: {
			idle: { light: "500", dark: "400" },
			hovered: { light: "600", dark: "300" },
			pressed: { light: "700", dark: "200" },
			disabled: { light: "300", dark: "700" },
			selected: { light: "700", dark: "200" },
		},
		normal: {
			idle: { light: "900", dark: "50" },
			hovered: { light: "950", dark: "0" },
			pressed: { light: "1000", dark: "0" },
			disabled: { light: "300", dark: "700" },
			selected: { light: "900", dark: "50" },
		},
		strong: {
			idle: { light: "1000", dark: "0" },
			hovered: { light: "1000", dark: "0" },
			pressed: { light: "1000", dark: "0" },
			disabled: { light: "300", dark: "700" },
			selected: { light: "900", dark: "50" },
		},
	},
	border: {
		weak: {
			idle: { light: "200", dark: "800" },
			hovered: { light: "300", dark: "700" },
			pressed: { light: "400", dark: "600" },
			disabled: { light: "200", dark: "800" },
			selected: { light: "400", dark: "600" },
		},
		normal: {
			idle: { light: "300", dark: "700" },
			hovered: { light: "400", dark: "600" },
			pressed: { light: "500", dark: "500" },
			disabled: { light: "200", dark: "800" },
			selected: { light: "400", dark: "600" },
		},
		strong: {
			idle: { light: "400", dark: "600" },
			hovered: { light: "500", dark: "500" },
			pressed: { light: "600", dark: "400" },
			disabled: { light: "200", dark: "800" },
			selected: { light: "400", dark: "600" },
		},
	},
	// ... other usages like 'shadow', 'outline' if needed ...
} as const;

// Accent palette with higher contrast for emphasis
export const accentPaletteDefinitions: PaletteDefinitions = {
	base: {
		normal: {
			idle: { light: "100", dark: "900" },
			hovered: { light: "200", dark: "800" },
			pressed: { light: "300", dark: "700" },
			disabled: { light: "100", dark: "900" },
			selected: { light: "200", dark: "800" },
		},
	},
	bg: {
		weak: {
			idle: { light: "50", dark: "950" },
			hovered: { light: "100", dark: "900" },
			pressed: { light: "200", dark: "800" },
			disabled: { light: "50", dark: "950" },
			selected: { light: "100", dark: "900" },
		},
		normal: {
			idle: { light: "100", dark: "900" },
			hovered: { light: "200", dark: "800" },
			pressed: { light: "300", dark: "700" },
			disabled: { light: "100", dark: "900" },
			selected: { light: "200", dark: "800" },
		},
		strong: {
			idle: { light: "300", dark: "700" },
			hovered: { light: "400", dark: "600" },
			pressed: { light: "500", dark: "500" },
			disabled: { light: "200", dark: "800" },
			selected: { light: "400", dark: "600" },
		},
	},
	fg: {
		weak: {
			idle: { light: "500", dark: "400" },
			hovered: { light: "600", dark: "300" },
			pressed: { light: "700", dark: "200" },
			disabled: { light: "300", dark: "700" },
			selected: { light: "700", dark: "200" },
		},
		normal: {
			idle: { light: "700", dark: "200" },
			hovered: { light: "800", dark: "100" },
			pressed: { light: "900", dark: "50" },
			disabled: { light: "300", dark: "700" },
			selected: { light: "700", dark: "200" },
		},
		strong: {
			idle: { light: "900", dark: "100" },
			hovered: { light: "950", dark: "50" },
			pressed: { light: "950", dark: "50" },
			disabled: { light: "300", dark: "700" },
			selected: { light: "700", dark: "200" },
		},
	},
	border: {
		weak: {
			idle: { light: "200", dark: "800" },
			hovered: { light: "300", dark: "700" },
			pressed: { light: "400", dark: "600" },
			disabled: { light: "200", dark: "800" },
			selected: { light: "400", dark: "600" },
		},
		normal: {
			idle: { light: "300", dark: "700" },
			hovered: { light: "400", dark: "600" },
			pressed: { light: "500", dark: "500" },
			disabled: { light: "200", dark: "800" },
			selected: { light: "400", dark: "600" },
		},
		strong: {
			idle: { light: "400", dark: "600" },
			hovered: { light: "500", dark: "500" },
			pressed: { light: "600", dark: "400" },
			disabled: { light: "200", dark: "800" },
			selected: { light: "400", dark: "600" },
		},
	},
	// ... other usages like 'shadow', 'outline' if needed ...
} as const;

export type { InteractionMap, ProminenceMap, PaletteDefinitions, Mode };
