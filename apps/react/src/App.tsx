import { primitives } from "elementals/color/primitives";
import React from "react";

type ColorShades = Record<string, string>;
type ColorPalette = Record<string, ColorShades>;

const styles = {
	container: {
		padding: "16px",
	},
	title: {
		fontSize: "24px",
		fontWeight: "bold",
		marginBottom: "16px",
	},
	grid: {
		display: "grid",
		gridTemplateColumns: "auto repeat(11, 1fr)",
		gap: "4px",
	},
	headerCell: {
		fontWeight: "bold",
		textAlign: "center",
	},
	colorName: {
		fontWeight: "bold",
	},
	colorCell: {
		width: "100%",
		height: "44px",
		borderRadius: "4px",
	},
};

const ColorPaletteGrid: React.FC = () => {
	const colorNames: string[] = Object.keys(primitives);
	const shades: string[] = Object.keys(primitives[colorNames[0]]);

	return (
		<div style={styles.container}>
			<h1 style={styles.title}>Color Palette Grid</h1>
			<div style={styles.grid}>
				<div style={styles.headerCell as React.CSSProperties}>Color</div>
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
								}}
								title={`${colorName}-${shade}: ${primitives[colorName][shade]}`}
							/>
						))}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default ColorPaletteGrid;
