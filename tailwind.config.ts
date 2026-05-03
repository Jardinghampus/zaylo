import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          blue:   "#0071E3",
          green:  "#34C759",
          red:    "#FF3B30",
          orange: "#FF9500",
          grey:   "#8E8E93",
        },
        text: {
          primary:     "#1D1D1F",
          secondary:   "#6E6E73",
          tertiary:    "#AEAEB2",
          quaternary:  "#C7C7CC",
        },
        bg: {
          primary:   "#FFFFFF",
          secondary: "#F2F2F7",
        },
        whatsapp: "#25D366",
      },
      fontFamily: {
        apple:         ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Helvetica Neue", "sans-serif"],
        "apple-display": ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Helvetica Neue", "sans-serif"],
        mono:          ["SF Mono", "Menlo", "Monaco", "monospace"],
      },
      borderRadius: {
        sm:   "6px",
        md:   "10px",
        lg:   "14px",
        xl:   "20px",
        pill: "980px",
      },
      boxShadow: {
        sm:   "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        md:   "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        lg:   "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        card: "0 2px 12px rgba(0,0,0,0.07)",
      },
      transitionTimingFunction: {
        apple:  "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast:   "160ms",
        normal: "240ms",
        slow:   "380ms",
      },
      maxWidth: {
        content: "980px",
      },
    },
  },
  plugins: [],
};
export default config;
