import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		colors: {
			primary: 'var(--color-primary)',
			secondary: 'var(--color-secondary)',
			accent: 'var(--color-accent)',
			tp: 'var(--color-text-primary)',
			ts: 'var(--color-text-secondary)',
			tAccent: 'var(--color-text-accent)',
			tMuted: 'var(--color-text-muted)',
			br: 'var(--color-border)',
			backg: 'var(--color-background)',
			backgMuted: 'var(--color-background-muted)',
			transpLight: 'var(--color-transparent-light)',
			transpDark: 'var(--color-transparent-dark)',
		  },
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
