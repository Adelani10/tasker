/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#10B981",
        background: "#F9FAFB",
        surface: "#FFFFFF",
        textPrimary: "#1F2937",
        textSecondary: "#6B7280",
        danger: "#EF4444",
      },
    },
  },
  plugins: [],
};
