import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
	"./src/**/*.{js,ts,jsx,tsx}",
	"./node_modules/@nextui-org/theme/dist/components/spinner.js",
	"./node_modules/@nextui-org/theme/dist/components/image.js",
  ],
  theme: {
		extend: {
			colors: {
				dark: "#58514d",
				paper: "#f5f5f5",
				borders: "#f6f6e9",
			},
			screens: {
				sm: "360px",
			},
		},
	},
	darkMode: "class",
	plugins: [
		nextui({
			themes: {
				light: {
					colors: {
						primary: {
							DEFAULT: "#8055c2",
							50: "#f2eef9",
							100: "#e6ddf3",
							200: "#ccbbe7",
							300: "#b399da",
							400: "#8d66c8",
							500: "#8055c2",
							600: "#66449b",
							700: "#4d3374",
							800: "#26193a",
							900: "#0d0813",
						},
					},
				},
			},
		}),
	],
}

