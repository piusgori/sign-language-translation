/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
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
							100: "#d9cced",
							200: "#c0aae1",
							300: "#a688d4",
							400: "#8d66c8",
							500: "#734daf",
							600: "#5a3b88",
							700: "#402b61",
							800: "#26193a",
							900: "#0d0813",
						},
					},
				},
			},
		}),
	],
};