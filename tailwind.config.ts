import type { Config } from "tailwindcss";

// Design tokens live as CSS variables in src/index.css; Tailwind is used for layout utilities only.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
