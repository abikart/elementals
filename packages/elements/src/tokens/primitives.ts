import Color from "colorjs.io";

/**
 * Define custom control points in OKLCH for each color.
 * Each array of stops will be interpolated to produce the 11 Shades (50..950).
 * Adjust as needed to approximate Tailwind's curated look.
 */
const colorCurves: Record<string, Array<[number, number, number]>> = {
	// "colorName": [ [l, c, h], [l, c, h], ... ]
	// l in 0..1, c in ~0..0.22, h in degrees
	slate: [
		[0.984, 0.003, 247.858], // near white (50)
		[0.704, 0.04, 256.788], // mid-lights (400)
		[0.446, 0.043, 257.281], // mid-darks (600)
		[0.129, 0.042, 264.695], // near black (950)
	],
	gray: [
		[0.985, 0.002, 247.839],
		[0.704, 0.022, 261.325],
		[0.446, 0.03, 256.802],
		[0.13, 0.028, 261.692],
	],
	zinc: [
		[0.985, 0.0, 0],
		[0.705, 0.015, 286.067],
		[0.442, 0.017, 285.786],
		[0.141, 0.005, 285.823],
	],
	neutral: [
		[0.985, 0.0, 0],
		[0.708, 0.0, 0],
		[0.439, 0.0, 0],
		[0.145, 0.0, 0],
	],
	stone: [
		[0.985, 0.001, 106.423],
		[0.709, 0.01, 56.259],
		[0.444, 0.011, 73.639],
		[0.147, 0.004, 49.25],
	],
	red: [
		[0.971, 0.013, 17.38],
		[0.704, 0.191, 22.216],
		[0.577, 0.245, 27.325],
		[0.258, 0.092, 26.042],
	],
	orange: [
		[0.98, 0.016, 73.684],
		[0.75, 0.183, 55.934],
		[0.646, 0.222, 41.116],
		[0.266, 0.079, 36.259],
	],
	amber: [
		[0.987, 0.022, 95.277],
		[0.828, 0.189, 84.429],
		[0.666, 0.179, 58.318],
		[0.279, 0.077, 45.635],
	],
	yellow: [
		[0.987, 0.026, 102.212],
		[0.852, 0.199, 91.936],
		[0.681, 0.162, 75.834],
		[0.286, 0.066, 53.813],
	],
	lime: [
		[0.986, 0.031, 120.757],
		[0.841, 0.238, 128.85],
		[0.648, 0.2, 131.684],
		[0.274, 0.072, 132.109],
	],
	green: [
		[0.982, 0.018, 155.826],
		[0.792, 0.209, 151.711],
		[0.627, 0.194, 149.214],
		[0.266, 0.065, 152.934],
	],
	emerald: [
		[0.979, 0.021, 166.113],
		[0.765, 0.177, 163.223],
		[0.596, 0.145, 163.225],
		[0.262, 0.051, 172.552],
	],
	teal: [
		[0.984, 0.014, 180.72],
		[0.777, 0.152, 181.912],
		[0.6, 0.118, 184.704],
		[0.277, 0.046, 192.524],
	],
	cyan: [
		[0.984, 0.019, 200.873],
		[0.789, 0.154, 211.53],
		[0.609, 0.126, 221.723],
		[0.302, 0.056, 229.695],
	],
	sky: [
		[0.977, 0.013, 236.62],
		[0.746, 0.16, 232.661],
		[0.588, 0.158, 241.966],
		[0.293, 0.066, 243.157],
	],
	blue: [
		[0.97, 0.014, 254.604],
		[0.706, 0.165, 254.624],
		[0.546, 0.245, 262.881],
		[0.282, 0.091, 267.935],
	],
	indigo: [
		[0.962, 0.018, 272.314],
		[0.673, 0.182, 276.935],
		[0.511, 0.262, 276.966],
		[0.257, 0.09, 281.288],
	],
	violet: [
		[0.969, 0.016, 293.756],
		[0.702, 0.183, 293.541],
		[0.541, 0.281, 293.009],
		[0.283, 0.141, 291.089],
	],
	purple: [
		[0.977, 0.014, 308.299],
		[0.714, 0.203, 305.504],
		[0.558, 0.288, 302.321],
		[0.291, 0.149, 302.717],
	],
	fuchsia: [
		[0.977, 0.017, 320.058],
		[0.74, 0.238, 322.16],
		[0.591, 0.293, 322.896],
		[0.293, 0.136, 325.661],
	],
	pink: [
		[0.971, 0.014, 343.198],
		[0.718, 0.202, 349.761],
		[0.592, 0.249, 0.584], // noted 360 wrap
		[0.284, 0.109, 3.907],
	],
	rose: [
		[0.969, 0.015, 12.422],
		[0.712, 0.194, 13.428],
		[0.586, 0.253, 17.585],
		[0.271, 0.105, 12.094],
	],
};

// Utility to interpolate an array of colorjs.io Ranges between multiple stops
function interpolateColorStops(stops: Array<[number, number, number]>, totalShades = 11): string[] {
	// Convert each [l,c,h] into a Color instance
	const colorInstances = stops.map(([l, c, h]) => new Color("oklch", [l, c, h]));
	// We'll gather all partial ranges
	let segments: Color[] = [];
	for (let i = 0; i < colorInstances.length - 1; i++) {
		const range = colorInstances[i].range(colorInstances[i + 1], { space: "oklch" });
		// sample ~1/(stopsCount-1) for each subrange
		const segmentSamples = 5; // adjust to get enough intermediate points
		for (let j = 0; j < segmentSamples; j++) {
			const t = j / (segmentSamples - 1);
			segments.push(range(t));
		}
	}
	// Remove duplicates at the boundaries of each subrange
	segments = segments.filter((_, idx) => idx === 0 || idx % (5 - 1) !== 0 || idx === segments.length - 1);

	// Now reduce/expand to totalShades
	const result: string[] = [];
	for (let i = 0; i < totalShades; i++) {
		const t = i / (totalShades - 1);
		// pick the color at t in the combined array
		const index = t * (segments.length - 1);
		const left = Math.floor(index);
		const right = Math.ceil(index);
		const frac = index - left;
		const cLeft = segments[left];
		const cRight = segments[right] || segments[left];
		// approximate linear interpolation between cLeft & cRight in OKLCH
		const color = cLeft.range(cRight, { space: "oklch" })(frac);
		result.push(color.toString({ format: "oklch" }));
	}

	return result;
}

/**
 * Generate a set of 11 shades for a given colorName by interpolating its control stops.
 * Output includes an OKLCH string and an sRGB fallback.
 */
function generateInterpolatedShades(colorName: string): Record<string, string> {
	const stops = colorCurves[colorName];
	if (!stops) {
		// Fallback or handle custom color
		return {};
	}

	const shades: Record<string, string> = {};
	const interpolated = interpolateColorStops(stops, 11);
	// Map the 11 results to Tailwind-like steps: 50..950
	const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

	interpolated.forEach((oklchColor, idx) => {
		const colorObj = new Color(oklchColor);
		const hex = colorObj.to("srgb").toString({ format: "hex" });
		const step = steps[idx];
		shades[`${step}`] = oklchColor;
		shades[`${step}-srgb`] = hex;
	});
	return shades;
}

/**
 * Build a palette by generating each color’s 11 interpolated steps.
 */
function createColorPalette(): Record<string, Record<string, string>> {
	const palette: Record<string, Record<string, string>> = {};

	for (const colorName of Object.keys(colorCurves)) {
		palette[colorName] = generateInterpolatedShades(colorName);
	}
	// If you need to handle custom or additional hues, do it here
	// e.g., fallback or specialized generation for neutrals
	return palette;
}

// Re-export same references as before for public usage
export const primitives = createColorPalette();

// Function to generate shades for a custom color
export function generateCustomColorShades(baseColor: string): Record<string, string> {
	return generateInterpolatedShades(baseColor);
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
