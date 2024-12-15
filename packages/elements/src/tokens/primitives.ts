import Color from "colorjs.io";

const baseShades = {
	// 0: { lightness: "100%", chroma: "0" },
	50: { lightness: "97%", chroma: "0.013" },
	100: { lightness: "94%", chroma: "0.032" },
	200: { lightness: "88%", chroma: "0.062" },
	300: { lightness: "80%", chroma: "0.114" },
	400: { lightness: "70%", chroma: "0.191" },
	500: { lightness: "64%", chroma: "0.237" },
	600: { lightness: "58%", chroma: "0.245" },
	700: { lightness: "50%", chroma: "0.213" },
	800: { lightness: "44%", chroma: "0.177" },
	900: { lightness: "40%", chroma: "0.141" },
	950: { lightness: "26%", chroma: "0.092" },
	// 1000: { lightness: "0%", chroma: "0" },
};

const hue = {
	slate: "257",
	gray: "264",
	zinc: "286",
	neutral: "118",
	stone: "58",

	red: "25",
	orange: "47",
	amber: "70",
	yellow: "86",
	lime: "131",
	green: "149",
	emerald: "163",
	teal: "182",
	cyan: "215",
	sky: "237",
	blue: "259",
	indigo: "277",
	violet: "293",
	purple: "303",
	fuchsia: "322",
	pink: "354",
	rose: "16",
};

const grayChroma = {
	stone: "0.012",
	neutral: "0",
	zinc: "0.014",
	gray: "0.024",
	slate: "0.028",
};

// Function to generate shades based on OKLCH values
function generateShades(hue: string, chroma?: string): Record<string, string> {
	const shades: Record<string, string> = {};
	for (const [shade, values] of Object.entries(baseShades)) {
		const color = new Color("oklch", [
			Number.parseFloat(values.lightness) / 100,
			Number.parseFloat(chroma ?? values.chroma),
			Number.parseFloat(hue),
		]);

		// Convert to P3 and provide fallback to sRGB
		const p3Color = color.to("p3");
		const srgbColor = color.to("srgb");

		shades[shade] = p3Color.toString({ format: "p3" });
		shades[`${shade}-srgb`] = srgbColor.toString({ format: "hex" });
	}

	return shades;
}

// Function to create a complete color palette
function createColorPalette(): Record<string, Record<string, string>> {
	const palette: Record<string, Record<string, string>> = {};

	for (const [colorName, hueValue] of Object.entries(hue)) {
		palette[colorName] = generateShades(hueValue, grayChroma[colorName as keyof typeof grayChroma]);
	}

	return palette;
}

export const primitives = createColorPalette();

// Function to generate shades for a custom color
export function generateCustomColorShades(baseColor: string): Record<string, string> {
	return generateShades(baseColor);
}

// Updated function to generate CSS variables from primitives
// Example:
// --el-color-red-500: #ff0000;
export function generateCssVariables(palette: Record<string, Record<string, string>>): string {
	let cssVariables = ":root {\n";

	for (const [colorName, shades] of Object.entries(palette)) {
		for (const [shade, colorValue] of Object.entries(shades)) {
			if (shade.endsWith("-srgb")) {
				cssVariables += `  --el-color-${colorName}-${shade}: ${colorValue};\n`;
			} else {
				cssVariables += `  --el-color-${colorName}-${shade}: ${colorValue};\n`;
				cssVariables += `  --el-color-${colorName}-${shade}-fallback: var(--el-color-${colorName}-${shade}-srgb);\n`;
			}
		}
	}

	cssVariables += "}";
	return cssVariables;
}
