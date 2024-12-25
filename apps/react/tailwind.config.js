export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				accent: {
					500: "#6366f1", // Indigo color used in the UI
				},
				base: {
					100: "#f3f4f6",
					200: "#e5e7eb",
					300: "#d1d5db",
					500: "#6b7280",
					900: "#111827",
				},
				chalk: "#ffffff",
			},
			gridTemplateColumns: {
				// Add if you want to use preset column values
				"auto-fill": "repeat(auto-fill, minmax(0, 1fr))",
			},
			gridTemplateRows: {
				// Add if you want to use preset row values
				"auto-fill": "repeat(auto-fill, minmax(0, 1fr))",
			},
		},
	},
	plugins: [],
	safelist: [
		// Add if you need to ensure specific dynamic classes are included
		{
			pattern: /grid-(cols|rows)-./,
		},
	],
};
