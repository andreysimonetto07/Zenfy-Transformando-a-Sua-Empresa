import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: {
    ink: "#080D2F",
    graphite: "#111A4B",
    mist: "#F5F8FF",
    brand: { DEFAULT: "#2563EB", dark: "#1D4ED8", cyan: "#19D3E7", violet: "#7C3AED", pink: "#D946EF", navy: "#06114F" }
  }, boxShadow: { "brand": "0 20px 60px rgba(37,99,235,.18)" } } },
  plugins: [],
};
export default config;
