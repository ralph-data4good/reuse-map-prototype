import type { Config } from "tailwindcss";

// ZWA design tokens are declared as CSS variables in globals.css and mapped here.
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // ZWA palette (see globals.css)
        cream: "hsl(var(--zwa-cream))",
        panel: "hsl(var(--zwa-panel))",
        navy: {
          DEFAULT: "hsl(var(--zwa-navy))",
          hover: "hsl(var(--zwa-navy-hover))",
        },
        gold: "hsl(var(--zwa-gold))",
        brand: "hsl(var(--zwa-green))",
        ink: "hsl(var(--zwa-text))",
        muted: "hsl(var(--zwa-muted))",
        border: "hsl(var(--zwa-border))",
        // Verification chips
        "chip-verified-bg": "hsl(var(--chip-verified-bg))",
        "chip-verified-fg": "hsl(var(--chip-verified-fg))",
        "chip-staff-bg": "hsl(var(--chip-staff-bg))",
        "chip-staff-fg": "hsl(var(--chip-staff-fg))",
        "chip-unverified-bg": "hsl(var(--chip-unverified-bg))",
        "chip-unverified-fg": "hsl(var(--chip-unverified-fg))",
      },
      borderRadius: {
        card: "12px",
        btn: "10px",
      },
      fontFamily: {
        // Poppins for headings, Inter for body (loaded via next/font)
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        pop: "0 10px 30px rgba(0,0,0,0.15)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
