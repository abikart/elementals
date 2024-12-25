module.exports = {
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
		},
	},
	plugins: [],
};
