import {
	type ContrastResult,
	checkContrast,
	generateAccessibilityMatrix,
	primitives,
} from "@elementals/elements/color/primitives";
import React, { useState, useEffect } from "react";

const lightStyles = {
	container: {
		padding: "16px",
		fontFamily: "monospace",
		background: "white",
		color: "black",
	},
	popup: {
		backgroundColor: "white",
		color: "black",
		boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
	},
	th: {
		borderBottom: "1px solid #ddd",
	},
	td: {
		borderBottom: "1px solid #ddd",
	},
	closeButton: {
		color: "black",
	},
} as const;

const darkStyles = {
	container: {
		padding: "16px",
		fontFamily: "monospace",
		background: "black",
		color: "white",
	},
	popup: {
		backgroundColor: "#1a1a1a",
		color: "white",
		boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
	},
	th: {
		borderBottom: "1px solid #333",
	},
	td: {
		borderBottom: "1px solid #333",
	},
	closeButton: {
		color: "white",
	},
} as const;

const baseStyles = {
	container: {
		padding: "16px",
		fontFamily: "monospace",
	},
	title: {
		fontSize: "24px",
		fontWeight: "bold",
		marginBottom: "16px",
	},
	grid: {
		display: "grid",
		gridTemplateColumns: "auto repeat(13, 1fr)",
		gap: "2px",
		maxWidth: "768px",
	},
	headerCell: {
		fontWeight: "bold",
		textAlign: "center",
	},
	colorName: {
		justifyContent: "end",
		fontWeight: "bold",
		display: "flex",
		alignItems: "center",
	},
	colorCell: {
		width: "100%",
		maxWidth: "64px",
		height: "44px",
		borderRadius: "2px",
	},
	popup: {
		position: "fixed",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		padding: "24px",
		borderRadius: "8px",
		maxWidth: "800px",
		width: "90%",
		maxHeight: "90vh",
		overflow: "auto",
		zIndex: 1000,
	} as React.CSSProperties,
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.5)",
		zIndex: 999,
	} as React.CSSProperties,
	table: {
		width: "100%",
		borderCollapse: "collapse",
		marginTop: "16px",
	},
	th: {
		textAlign: "left",
		padding: "8px",
	},
	td: {
		padding: "8px",
	},
	closeButton: {
		position: "absolute",
		top: "12px",
		right: "12px",
		background: "none",
		border: "none",
		fontSize: "20px",
		cursor: "pointer",
	} as React.CSSProperties,
	colorSwatch: {
		width: "24px",
		height: "24px",
		borderRadius: "4px",
		display: "inline-block",
		marginRight: "8px",
		verticalAlign: "middle",
	},
	stars: {
		color: "#ffd700",
		fontSize: "24px",
	},
	emptyStars: {
		color: "#ccc",
		opacity: 0.5,
		fontSize: "24px",
	},
	themeToggle: {
		position: "fixed",
		top: "16px",
		right: "16px",
		padding: "8px 16px",
		borderRadius: "4px",
		cursor: "pointer",
		border: "1px solid currentColor",
		background: "transparent",
		color: "inherit",
		fontSize: "14px",
	},
} as const;

// Helper function to merge styles
const mergeStyles = (base: typeof baseStyles, theme: typeof lightStyles | typeof darkStyles) => {
	const merged = { ...base };
	for (const key in theme) {
		// @ts-expect-error
		merged[key] = { ...base[key], ...theme[key] };
	}
	return merged;
};

interface AccessibilityPopupProps {
	colorName: string;
	shade: string;
	matrix: Record<string, ContrastResult>;
	onClose: () => void;
	isDark: boolean;
	allColorNames: string[];
	onColorSetChange: (colorName: string) => void;
	compareWithColorName: string;
}

const AccessibilityPopup: React.FC<AccessibilityPopupProps> = ({
	colorName,
	shade,
	matrix,
	onClose,
	isDark,
	allColorNames,
	onColorSetChange,
	compareWithColorName,
}) => {
	const styles = mergeStyles(baseStyles, isDark ? darkStyles : lightStyles);

	return (
		<>
			<div style={styles.overlay} onClick={onClose} onKeyDown={onClose} />
			<div style={styles.popup}>
				<button type="button" style={styles.closeButton} onClick={onClose}>
					×
				</button>
				<h2>Accessibility Analysis</h2>
				<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
					<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						Analyzing contrast ratios for{" "}
						<span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
							<div
								style={{
									...styles.colorSwatch,
									marginRight: 0,
									width: "32px",
									height: "32px",
									backgroundColor: primitives[colorName][shade],
								}}
								title={primitives[colorName][shade]}
								aria-label={`Color swatch for ${colorName}-${shade}`}
							/>
							{colorName}-{shade}
						</span>
					</div>

					<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						<label htmlFor="colorSet">Compare with color set:</label>
						<select
							id="colorSet"
							value={compareWithColorName}
							onChange={(e) => onColorSetChange(e.target.value)}
							style={{
								padding: "4px 8px",
								borderRadius: "4px",
								background: isDark ? "#333" : "#fff",
								color: isDark ? "#fff" : "#000",
								border: `1px solid ${isDark ? "#666" : "#ccc"}`,
							}}
						>
							{allColorNames.map((name) => (
								<option key={name} value={name}>
									{name}
								</option>
							))}
						</select>
					</div>
				</div>

				<table style={styles.table}>
					<thead>
						<tr>
							<th style={styles.th}>Contrast With</th>
							<th style={styles.th}>Ratio</th>
							<th style={styles.th}>Normal Text</th>
							<th style={styles.th}>Large Text</th>
							<th style={styles.th}>Score</th>
						</tr>
					</thead>
					<tbody>
						{Object.entries(matrix).map(([contrastShade, result]) => (
							<tr key={contrastShade}>
								<td style={styles.td}>
									<div
										style={{
											...styles.colorSwatch,
											backgroundColor: primitives[compareWithColorName][contrastShade],
										}}
									/>
									{compareWithColorName}-{contrastShade}
								</td>
								<td style={styles.td}>{result.ratio}:1</td>
								<td style={styles.td}>
									{result.normalAA ? "✅ AA" : "❌"} {result.normalAAA ? "✅ AAA" : ""}
								</td>
								<td style={styles.td}>
									{result.largeAA ? "✅ AA" : "❌"} {result.largeAAA ? "✅ AAA" : ""}
								</td>
								<td style={styles.td}>
									<span style={styles.stars}>{"★".repeat(result.score)}</span>
									<span style={styles.emptyStars}>{"☆".repeat(5 - result.score)}</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

const ColorPaletteGrid: React.FC = () => {
	const [selectedColor, setSelectedColor] = useState<{
		colorName: string;
		shade: string;
		matrix: Record<string, ContrastResult>;
		compareWithColorName: string;
	} | null>(null);

	const [isDark, setIsDark] = useState(true);

	// Initialize theme based on system preference
	useEffect(() => {
		const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		setIsDark(darkModeMediaQuery.matches);

		const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
		darkModeMediaQuery.addEventListener("change", handler);
		return () => darkModeMediaQuery.removeEventListener("change", handler);
	}, []);

	const styles = mergeStyles(baseStyles, isDark ? darkStyles : lightStyles);

	const colorNames: string[] = Object.keys(primitives);
	const shades: string[] = Object.keys(primitives[colorNames[0]]).filter((shade) => !shade.endsWith("-srgb"));

	const handleColorClick = (colorName: string, shade: string) => {
		const matrix = generateAccessibilityMatrix(primitives[colorName]);
		setSelectedColor({
			colorName,
			shade,
			matrix: matrix[shade] || {},
			compareWithColorName: colorName,
		});
	};

	const handleColorSetChange = (compareWithColorName: string) => {
		if (!selectedColor) return;

		// Generate contrast matrix between selected color and all shades of the new color set
		const targetColor = primitives[selectedColor.colorName][selectedColor.shade];
		const matrix: Record<string, ContrastResult> = {};

		const shades = Object.entries(primitives[compareWithColorName])
			.filter(([shade]) => !shade.endsWith("-srgb"))
			.map(([shade, color]) => ({ shade, color }));
		for (const { shade, color } of shades) {
			matrix[shade] = checkContrast(targetColor, color);
		}

		setSelectedColor({
			...selectedColor,
			matrix,
			compareWithColorName,
		});
	};

	return (
		<div style={styles.container}>
			<button
				type="button"
				style={styles.themeToggle}
				onClick={() => setIsDark(!isDark)}
				aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
			>
				{isDark ? "🌞 Light Mode" : "🌙 Dark Mode"}
			</button>

			<h1 style={styles.title}>Color Palette Grid</h1>
			<div style={styles.grid}>
				<div style={styles.headerCell as React.CSSProperties} />
				{shades.map((shade: string) => (
					<div key={shade} style={styles.headerCell as React.CSSProperties}>
						{shade}
					</div>
				))}
				{colorNames.map((colorName: string) => (
					<React.Fragment key={colorName}>
						<div style={styles.colorName}>{colorName}</div>
						{shades.map((shade: string) => (
							<div
								key={`${colorName}-${shade}`}
								style={{
									...styles.colorCell,
									backgroundColor: primitives[colorName][shade],
									cursor: "pointer",
								}}
								onClick={() => handleColorClick(colorName, shade)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleColorClick(colorName, shade);
									}
								}}
								title={`${colorName}-${shade}: ${primitives[colorName][shade]}`}
							/>
						))}
					</React.Fragment>
				))}
			</div>

			{selectedColor && (
				<AccessibilityPopup
					colorName={selectedColor.colorName}
					shade={selectedColor.shade}
					matrix={selectedColor.matrix}
					onClose={() => setSelectedColor(null)}
					isDark={isDark}
					allColorNames={colorNames}
					onColorSetChange={handleColorSetChange}
					compareWithColorName={selectedColor.compareWithColorName}
				/>
			)}
		</div>
	);
};

export default ColorPaletteGrid;
