import { generateCustomColorShades, primitives } from "./primitives";

// Sentiments are a set of primitives that can be used to create a theme.
const sentiments = {
	neutral: "gray",
	accent: "blue",
	success: "green",
	danger: "red",
	warning: "amber",
	info: "blue",
};

// Semantic palette consists of usage, prominence, and interaction.
const usage = ["bg", "fg", "border", "shadow", "outline"];
const prominence = ["normal", "weak", "strong"];
const interaction = [
	"idle",
	"hovered",
	"pressed",
	"focused",
	"disabled",
	"selected",
];

// Token generation
const tokens: Record<string, string> = {};

for (const u of usage) {
	for (const p of prominence) {
		for (const i of interaction) {
			const key = `${u}-${p}-${i}`;
			// This is a placeholder mapping. You'll need to define proper rules for each combination.
			tokens[key] = "500"; // Default to middle shade
		}
	}
}

// Function to generate CSS variables
function generateCssVariables(theme = "light"): string {
	let css = ":root {\n";
	for (const [key, value] of Object.entries(tokens)) {
		const [usage, prominence, interaction] = key.split("-");
		const sentiment = sentiments[usage as keyof typeof sentiments] || "neutral";
		const shade = primitives[sentiment][value];
		css += `  --el-color-${key}: ${shade};\n`;
	}
	css += "}\n";
	return css;
}

// Example of how to use the custom color generator
const customColor = "lch(54% 50 45)"; // A custom orange-like color
const customShades = generateCustomColorShades(customColor);

export { primitives, sentiments, generateCssVariables, customShades };
