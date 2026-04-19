import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f5f3ee",
        ink: "#111111",
        grid: "rgba(17, 17, 17, 0.08)",
      },
      boxShadow: {
        frame: "0 24px 60px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
