/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "roboto-bold": ["Roboto-Bold"],
        "roboto-semibold": ["Roboto-SemiBold"],
        "roboto-medium": ["Roboto-Medium"],
        "roboto-regular": ["Roboto-Regular"],
        "roboto-thin": ["Roboto-Thin"],
      },
      colors: {
        primary: "#000000",
        secondary: "#6B7280",
        secondary_second: "#6B7280",
        card: "#F0F2F5",
        border: "rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
};
