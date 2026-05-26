import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F1E7",
        surface: "#FFFCF6",
        ink: "#22251F",
        muted: "#636B61",
        line: "#D8CFBF",
        moss: "#3F7C6B",
        mossDark: "#28584D",
        clay: "#A85F4F",
        brass: "#B18B4D",
        blueGrey: "#5F6F75",
        amberSoft: "#D8B765"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(36, 38, 32, 0.10)",
        premium: "0 24px 70px rgba(34, 37, 31, 0.08)",
        action: "0 16px 34px rgba(63, 124, 107, 0.22)"
      }
    }
  },
  plugins: []
} satisfies Config;
