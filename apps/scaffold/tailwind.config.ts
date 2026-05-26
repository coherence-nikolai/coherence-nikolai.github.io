import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F5EF",
        surface: "#FFFCF6",
        ink: "#262821",
        muted: "#62685D",
        line: "#D8D2C2",
        moss: "#3F7C6B",
        mossDark: "#28584D",
        clay: "#B96B59",
        iris: "#6661A8",
        amberSoft: "#F0C36A"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(36, 38, 32, 0.10)"
      }
    }
  },
  plugins: []
} satisfies Config;
