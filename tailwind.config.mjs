/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        pulseScale: {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        basicScale: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "pulse-scale": "pulseScale 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "basic-scale": "basicScale 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      },
      scale: {
        120: "1.2",
      },
    },
  },
  plugins: [],
};
