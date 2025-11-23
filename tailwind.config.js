/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
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
        primary: "#FFFFFF",
        secondary: "#9CA3AF",
        secondary_second: "#C8CACC",
      },
    },
  },
  plugins: [],
};
