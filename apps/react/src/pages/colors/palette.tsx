import {
	type Accent,
	type Prominence,
	type Usage,
	accentPaletteDefinitions,
	accents,
	neutralPaletteDefinitions,
} from "@elementals/elements/color";
import { useState } from "react";
import "./palette.css";
import "@elementals/elements/color.css";

const paletteDefinitions = {
	...neutralPaletteDefinitions,
	...accentPaletteDefinitions,
};

const palette: React.FC = () => {
	const accentKeys = Object.keys(accents) as Accent[];
	type ColorKey = "neutral" | Accent;
	const [selectedAccent, setSelectedAccent] = useState<ColorKey>("neutral");
	const usages = Object.keys(paletteDefinitions) as Usage[];

	const ExampleSection: React.FC<{ accent: ColorKey }> = ({ accent }) => {
		return (
			<div className="examples-section">
				<h3>Examples</h3>
				<div className="example-row">
					<div className="example-group">
						<h4>Buttons</h4>
						<div className="example-items">
							{/* Primary Button */}
							<button
								type="button"
								className="example-button"
								style={{
									backgroundColor: `var(--el-color-${accent})`,
									color: `var(--el-color-${accent}-fg)`,
									border: `1px solid var(--el-color-${accent}-border)`,
								}}
							>
								Normal
							</button>

							{/* Weak Button */}
							<button
								type="button"
								className="example-button"
								style={{
									backgroundColor: `var(--el-color-${accent}-bg-weak)`,
									color: `var(--el-color-${accent}-fg-weak)`,
									border: `1px solid var(--el-color-${accent}-border-weak)`,
								}}
							>
								Weak
							</button>

							{/* Strong Button */}
							<button
								type="button"
								className="example-button"
								style={{
									backgroundColor: `var(--el-color-${accent}-bg-strong)`,
									color: `var(--el-color-${accent}-fg-strong)`,
									border: `1px solid var(--el-color-${accent}-border-strong)`,
								}}
							>
								Strong
							</button>
						</div>
					</div>

					<div className="example-group">
						<h4>Cards</h4>
						<div className="example-items">
							{/* Normal Card */}
							<div
								className="example-card"
								style={{
									backgroundColor: `var(--el-color-${accent})`,
									color: `var(--el-color-${accent}-fg)`,
									borderColor: `var(--el-color-${accent}-border)`,
								}}
							>
								<div className="card-header">Normal Card</div>
								<div className="card-content">
									<span
										className="example-tag"
										style={{
											backgroundColor: `var(--el-color-${accent}-bg-weak)`,
											color: `var(--el-color-${accent}-fg)`,
											borderColor: `var(--el-color-${accent}-border-weak)`,
										}}
									>
										Tag
									</span>
								</div>
							</div>

							{/* Weak Card */}
							<div
								className="example-card"
								style={{
									backgroundColor: `var(--el-color-${accent}-bg-weak)`,
									color: `var(--el-color-${accent}-fg)`,
									borderColor: `var(--el-color-${accent}-border-weak)`,
								}}
							>
								<div className="card-header">Weak Card</div>
								<div className="card-content">
									<button
										type="button"
										className="example-button"
										style={{
											backgroundColor: `var(--el-color-${accent})`,
											color: `var(--el-color-${accent}-fg)`,
											borderColor: `var(--el-color-${accent}-border)`,
										}}
									>
										Button
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="accent-palette">
			{/* Tabs for selecting accents */}
			<div className="tabs">
				{["neutral" as const, ...accentKeys].map((accent) => (
					<button
						type="button"
						key={accent}
						className={`tab ${accent === selectedAccent ? "active" : ""}`}
						onClick={() => setSelectedAccent(accent)}
						style={{
							backgroundColor: `var(--el-color-${accent})`,
							color: `var(--el-color-${accent}-fg)`,
							borderColor: `var(--el-color-${accent}-border)`,
						}}
					>
						{accent}
					</button>
				))}
			</div>

			{/* Display palette for the selected accent */}
			<div className="palette">
				{usages.map((usage) => {
					const usageTokens = paletteDefinitions[usage];
					if (!usageTokens) return null;

					return (
						<div key={usage} className="usage-group">
							<h3
								style={{
									color: "var(--el-color-neutral-fg)",
								}}
							>
								{usage.toUpperCase()}
							</h3>
							<div className="prominence-row">
								{Object.keys(usageTokens).map((prominence) => {
									const prominenceTokens = usageTokens[prominence as Prominence];
									if (!prominenceTokens) return null;

									return (
										<div key={prominence} className="prominence-block">
											<div className="prominence-label">{prominence}</div>
											<div className="interaction-column">
												{Object.keys(prominenceTokens).map((interaction) => {
													const parts = [
														`--el-color-${selectedAccent}`,
														usage !== "base" ? usage : null,
														prominence !== "normal" ? prominence : null,
														interaction !== "idle" ? interaction : null,
													].filter(Boolean);
													const token = parts.join("-");

													return (
														<div
															key={interaction}
															className="color-swatch"
															style={
																{
																	"--bg": `var(${token})`,
																	backgroundColor: `var(${token})`,
																	color: "lch(from var(--bg) calc((49.44 - l) * infinity) 0 0)",
																} as React.CSSProperties
															}
														>
															<span className="color-label">{interaction}</span>
														</div>
													);
												})}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
			<ExampleSection accent={selectedAccent} />
		</div>
	);
};

export default palette;
