import Color from "colorjs.io";

const baseShades = {
	// 0: { lightness: "100%", chroma: "0" },
	50: { lightness: "96.94%", chroma: "0.015" },
	100: { lightness: "94.14%", chroma: "0.03" },
	200: { lightness: "89.24", chroma: "0.06" },
	300: { lightness: "81%", chroma: "0.1061" },
	400: { lightness: "72%", chroma: "0.17" },
	500: { lightness: "64%", chroma: "0.22" },
	600: { lightness: "58.5%", chroma: "0.22" },
	700: { lightness: "51.4%", chroma: "0.2" },
	800: { lightness: "45.4%", chroma: "0.17" },
	900: { lightness: "41%", chroma: "0.15" },
	950: { lightness: "27%", chroma: "0.10" },
	// 1000: { lightness: "0%", chroma: "0" },
};

const hue = {
	rose: "16",
	pink: "354",
	fuchsia: "322",
	purple: "303",
	violet: "293",
	indigo: "277",
	blue: "262",
	sky: "245",
	cyan: "221",
	teal: "184",
	emerald: "163",
	green: "149",
	lime: "131",
	yellow: "86",
	amber: "70",
	orange: "47",
	red: "25",

	stone: "58",
	neutral: "118",
	zinc: "286",
	gray: "264",
	slate: "257",
};

const grayChroma = {
	stone: "0.0116",
	neutral: "0",
	zinc: "0.0138",
	gray: "0.0234",
	slate: "0.0407",
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
		shades[shade] = color.toString({ format: "oklch" });
		// shades[shade] = color.to('sRGB').toString({format: 'hex'});
	}

	return shades;
}

// Function to create a complete color palette
function createColorPalette(): Record<string, Record<string, string>> {
	const palette: Record<string, Record<string, string>> = {};

	for (const [colorName, hueValue] of Object.entries(hue)) {
		palette[colorName] = generateShades(
			hueValue,
			grayChroma[colorName as keyof typeof grayChroma],
		);
	}

	return palette;
}

export const primitives = createColorPalette();

// Function to generate shades for a custom color
export function generateCustomColorShades(
	baseColor: string,
): Record<string, string> {
	return generateShades(baseColor);
}

// New function to generate CSS variables from primitives
export function generateCssVariables(
	palette: Record<string, Record<string, string>>,
): string {
	let cssVariables = ":root {\n";

	for (const [colorName, shades] of Object.entries(palette)) {
		for (const [shade, hexValue] of Object.entries(shades)) {
			cssVariables += `  --el-color-${colorName}-${shade}: ${hexValue};\n`;
		}
	}

	cssVariables += "}";
	return cssVariables;
}
