/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        body: ["Sora", "ui-sans-serif", "system-ui"],
      },
      colors: {
        glass: "rgba(15, 23, 42, 0.6)",
        neon: "#38bdf8",
        pulse: "#f97316",
        quantum: "#22c55e",
      },
      boxShadow: {
        glow: "0 0 20px rgba(56, 189, 248, 0.35)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        pop: "pop 250ms ease-out",
      },
    },
  },
  plugins: [],
};
