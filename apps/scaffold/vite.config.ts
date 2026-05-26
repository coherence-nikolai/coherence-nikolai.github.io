import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  test: {
    globals: true,
    environment: "node",
    exclude: ["node_modules/**", "dist/**", "tests/e2e/**"]
  }
});
