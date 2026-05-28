import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F1E6",
        surface: "#FFFDF8",
        ink: "#20231D",
        muted: "#667064",
        line: "#D9CFBE",
        moss: "#3E786A",
        mossDark: "#28594F",
        clay: "#A76555",
        brass: "#AA8749",
        blueGrey: "#5F6F75",
        amberSoft: "#D9B86A"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(36, 38, 32, 0.10)",
        premium: "0 28px 80px rgba(34, 37, 31, 0.10)",
        action: "0 18px 36px rgba(63, 120, 106, 0.24)",
        "inner-soft": "inset 0 1px 0 rgba(255, 255, 255, 0.70)"
      }
    }
  },
  plugins: []
} satisfies Config;
