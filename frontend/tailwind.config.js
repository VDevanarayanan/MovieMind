export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        surface: "#0b0f19",
        "surface-light": "#161f30",
        primary: "#f43f5e",
        accent: "#06b6d4",
        "accent-purple": "#a855f7",
        "accent-gold": "#fbbf24",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
