import { type Mode, accentPaletteDefinitions, neutralPaletteDefinitions } from "./palette";
import { primitives } from "./primitives";

// neutral is the default color palette
const neutral = "gray";

// Accents define the context of colors
const accents = {
	primary: "blue",
	success: "green",
	danger: "red",
	warning: "amber",
	info: "blue",
} as const;

type Accent = keyof typeof accents;

// Usage defines how the color is applied
const usage = {
	base: "base", // default
	bg: "background",
	fg: "foreground",
	border: "border",
	shadow: "shadow",
	outline: "outline",
} as const;

type Usage = keyof typeof usage;

// Prominence defines the visual weight
const prominence = {
	weak: "weak",
	normal: "normal", // default
	strong: "strong",
} as const;

type Prominence = keyof typeof prominence;

// Interaction defines the state of the element
const interaction = {
	idle: "idle", // default
	hovered: "hovered",
	pressed: "pressed",
	focused: "focused",
	disabled: "disabled",
	selected: "selected",
} as const;

type Interaction = keyof typeof interaction;

// Validate token combinations
function isValidToken(usage: Usage, prominence: Prominence, interaction: Interaction): boolean {
	const usageObj = neutralPaletteDefinitions[usage];
	if (!usageObj) return false;

	const prominenceObj = usageObj[prominence];
	if (!prominenceObj) return false;

	return interaction in prominenceObj;
}

// Get the appropriate shade for a combination
function getShade(usage: Usage, prominence: Prominence, interaction: Interaction): Mode | undefined {
	const usageObj = neutralPaletteDefinitions[usage];
	const prominenceObj = usageObj?.[prominence];
	const interactionObj = prominenceObj?.[interaction];
	return interactionObj;
}
type ColorMode = "light" | "dark";
// Function to generate semantic color tokens
function generateSemanticTokens(mode: ColorMode = "light") {
	const tokens: Record<string, string> = {};

	// Generate neutral tokens
	const neutralPrimitive = primitives[neutral];
	if (neutralPrimitive) {
		for (const [usageKey, usageObj] of Object.entries(neutralPaletteDefinitions)) {
			if (!usageObj) continue;

			for (const [prominenceKey, prominenceValue] of Object.entries(usageObj)) {
				if (!prominenceValue) continue;

				for (const [interactionKey, modes] of Object.entries(prominenceValue) as [string, Mode][]) {
					const _mode = modes[mode];

					// Build neutral token name
					const parts = [
						"--el-color-neutral",
						usageKey !== "base" && usageKey,
						prominenceKey !== "normal" && prominenceKey,
						interactionKey !== "idle" && interactionKey,
					].filter(Boolean);

					const token = parts.join("-");
					tokens[token] = neutralPrimitive[_mode];
				}
			}
		}
	}

	// Generate accent tokens
	for (const [accentKey, accentValue] of Object.entries(accents)) {
		const primitive = primitives[accentValue];
		if (!primitive) continue;

		for (const [usageKey, usageObj] of Object.entries(accentPaletteDefinitions)) {
			if (!usageObj) continue;

			for (const [prominenceKey, prominenceValue] of Object.entries(usageObj)) {
				if (!prominenceValue) continue;

				for (const [interactionKey, modes] of Object.entries(prominenceValue) as [string, Mode][]) {
					const _mode = modes[mode];

					// Build accent token name
					const parts = [
						`--el-color-${accentKey}`,
						usageKey !== "base" && usageKey,
						prominenceKey !== "normal" && prominenceKey,
						interactionKey !== "idle" && interactionKey,
					].filter(Boolean);

					const token = parts.join("-");
					tokens[token] = primitive[_mode];
				}
			}
		}
	}

	return tokens;
}

// Helper function to get a semantic color token
function getSemanticColor(
	accent: Accent,
	usage: Usage = "base",
	prominence: Prominence = "normal",
	interaction: Interaction = "idle",
): string {
	const shade = getShade(usage, prominence, interaction);

	if (!shade) {
		console.warn(`Invalid token combination: ${usage}-${prominence}-${interaction}. Falling back to default.`);
		return `var(--el-color-${accent})`;
	}

	// Build token name, skipping defaults
	const parts = [
		`--el-color-${accent}`,
		usage !== "base" ? usage : null,
		prominence !== "normal" ? prominence : null,
		interaction !== "idle" ? interaction : null,
	].filter(Boolean);

	return `var(${parts.join("-")})`;
}

// Function to generate CSS variables
function generateColorTokens(): string {
	const lightTokens = generateSemanticTokens("light");
	const darkTokens = generateSemanticTokens("dark");

	let css = ":root {\n";
	// Add light mode tokens
	for (const [token, value] of Object.entries(lightTokens)) {
		css += `  ${token}: ${value};\n`;
	}
	css += "}\n\n";

	// Add dark mode tokens
	css += "@media (prefers-color-scheme: dark) {\n  :root {\n";
	for (const [token, value] of Object.entries(darkTokens)) {
		css += `    ${token}: ${value};\n`;
	}
	css += "  }\n}\n";

	return css;
}

// Exported types and functions
export {
	accents,
	usage,
	prominence,
	interaction,
	neutralPaletteDefinitions,
	accentPaletteDefinitions,
	generateSemanticTokens,
	generateColorTokens,
	getSemanticColor,
	isValidToken,
	type Accent,
	type Usage,
	type Prominence,
	type Interaction,
	type ColorMode,
};
