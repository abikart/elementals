import { primitives } from "./primitives";

// Sentiments define the emotional or functional context of colors
const sentiments = {
	neutral: "gray",
	accent: "blue",
	success: "green",
	danger: "red",
	warning: "amber",
	info: "blue",
} as const;

type Sentiment = keyof typeof sentiments;

// Usage defines how the color is applied
const usage = {
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
	normal: "normal",
	strong: "strong",
} as const;

type Prominence = keyof typeof prominence;

// Interaction defines the state of the element
const interaction = {
	idle: "idle",
	hovered: "hovered",
	pressed: "pressed",
	focused: "focused",
	disabled: "disabled",
	selected: "selected",
} as const;

type Interaction = keyof typeof interaction;

// Shade mapping organized by token
const shadeMapping = {
	// Background shades
	"bg-weak-idle": { light: "50", dark: "950" },
	"bg-weak-hovered": { light: "100", dark: "900" },
	"bg-weak-pressed": { light: "200", dark: "800" },
	"bg-normal-idle": { light: "100", dark: "900" },
	"bg-normal-hovered": { light: "200", dark: "800" },
	"bg-normal-pressed": { light: "300", dark: "700" },
	"bg-strong-idle": { light: "200", dark: "800" },
	"bg-strong-hovered": { light: "300", dark: "700" },
	"bg-strong-pressed": { light: "400", dark: "600" },

	// Foreground shades
	"fg-weak-idle": { light: "500", dark: "400" },
	"fg-weak-hovered": { light: "600", dark: "300" },
	"fg-weak-pressed": { light: "700", dark: "200" },
	"fg-normal-idle": { light: "700", dark: "200" },
	"fg-normal-hovered": { light: "800", dark: "100" },
	"fg-normal-pressed": { light: "900", dark: "50" },
	"fg-strong-idle": { light: "900", dark: "100" },
	"fg-strong-hovered": { light: "950", dark: "50" },
	"fg-strong-pressed": { light: "950", dark: "50" },

	// Border shades
	"border-weak-idle": { light: "200", dark: "800" },
	"border-weak-hovered": { light: "300", dark: "700" },
	"border-weak-pressed": { light: "400", dark: "600" },
	"border-normal-idle": { light: "300", dark: "700" },
	"border-normal-hovered": { light: "400", dark: "600" },
	"border-normal-pressed": { light: "500", dark: "500" },
	"border-strong-idle": { light: "400", dark: "600" },
	"border-strong-hovered": { light: "500", dark: "500" },
	"border-strong-pressed": { light: "600", dark: "400" },

	// States
	"bg-disabled": { light: "100", dark: "900" },
	"fg-disabled": { light: "300", dark: "700" },
	"border-disabled": { light: "200", dark: "800" },
	"bg-selected": { light: "100", dark: "800" },
	"fg-selected": { light: "700", dark: "200" },
	"border-selected": { light: "400", dark: "600" },
} as const;

type ShadeKey = keyof typeof shadeMapping;
type ColorMode = keyof (typeof shadeMapping)[ShadeKey];

// Validate token combinations
function isValidToken(usage: Usage, prominence: Prominence, interaction: Interaction): boolean {
	const key = `${usage}-${prominence}-${interaction}` as ShadeKey;
	return key in shadeMapping || isStateToken(usage, interaction);
}

// Check if it's a state token (disabled/selected)
function isStateToken(usage: Usage, interaction: Interaction): boolean {
	const key = `${usage}-${interaction}` as ShadeKey;
	return key in shadeMapping;
}

// Get the appropriate shade key for a combination
function getShadeKey(usage: Usage, prominence: Prominence, interaction: Interaction): ShadeKey {
	if (isStateToken(usage, interaction)) {
		return `${usage}-${interaction}` as ShadeKey;
	}
	return `${usage}-${prominence}-${interaction}` as ShadeKey;
}

// Function to generate semantic color tokens
function generateSemanticTokens(mode: ColorMode = "light") {
	const tokens: Record<string, string> = {};

	for (const [sentimentKey, sentimentValue] of Object.entries(sentiments)) {
		for (const [shadeKey, shadeValues] of Object.entries(shadeMapping)) {
			const shade = shadeValues[mode];
			const primitive = primitives[sentimentValue as keyof typeof primitives];
			if (!primitive) continue;

			const token = `--el-color-${sentimentKey}-${shadeKey}`;
			tokens[token] = primitive[shade];
		}
	}

	return tokens;
}

// Function to generate CSS variables
function generateColorVariables(): string {
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

// Helper function to get a semantic color token
function getSemanticColor(
	sentiment: Sentiment,
	usage: Usage,
	prominence: Prominence = "normal",
	interaction: Interaction = "idle",
): string {
	if (!isValidToken(usage, prominence, interaction)) {
		console.warn(`Invalid token combination: ${usage}-${prominence}-${interaction}. Falling back to normal-idle.`);
		return `var(--el-color-${sentiment}-${usage}-normal-idle)`;
	}

	const shadeKey = getShadeKey(usage, prominence, interaction);
	const token = `--el-color-${sentiment}-${shadeKey}`;
	return `var(${token})`;
}

// Exported types and functions
export {
	sentiments,
	usage,
	prominence,
	interaction,
	generateSemanticTokens,
	generateColorVariables,
	getSemanticColor,
	isValidToken,
	type Sentiment,
	type Usage,
	type Prominence,
	type Interaction,
	type ColorMode,
};
