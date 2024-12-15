import { useState } from "react";
import {
	sentiments,
	getSemanticColor,
	type Usage,
	type Prominence,
	type Interaction,
	type Sentiment,
	isValidToken,
} from "@elementals/elements/color";
import "./sentimentPalette.css";
import "@elementals/elements/color.css";

const SentimentPalette: React.FC = () => {
	const sentimentKeys = Object.keys(sentiments) as Sentiment[];
	const [selectedSentiment, setSelectedSentiment] = useState<Sentiment>(sentimentKeys[0]);

	const usages: Usage[] = ["bg", "fg", "border", "shadow", "outline"];
	const prominences: Prominence[] = ["weak", "normal", "strong"];
	const interactions: Interaction[] = ["idle", "hovered", "pressed", "focused", "disabled", "selected"];

	return (
		<div className="sentiment-palette">
			{/* Tabs for selecting sentiments */}
			<div className="tabs">
				{sentimentKeys.map((sentiment) => (
					<button
						type="button"
						key={sentiment}
						className={`tab ${sentiment === selectedSentiment ? "active" : ""}`}
						onClick={() => setSelectedSentiment(sentiment)}
					>
						{sentiment}
					</button>
				))}
			</div>

			{/* Display palette for the selected sentiment */}
			<div className="palette">
				{usages.map((usage) => (
					<div key={usage} className="usage-group">
						<h3>{usage.toUpperCase()}</h3>
						{prominences.map((prominence) => (
							<div key={prominence} className="prominence-group">
								<h4>{prominence}</h4>
								<div className="colors">
									{interactions.map((interaction) => {
										if (!isValidToken(usage, prominence, interaction)) {
											return null;
										}
										const colorVar = getSemanticColor(selectedSentiment, usage, prominence, interaction);
										return (
											<div key={interaction} className="color-swatch">
												<div className="color-box" style={{ backgroundColor: `${colorVar}` }} />
												<div className="color-label">{interaction}</div>
											</div>
										);
									})}
								</div>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default SentimentPalette;
