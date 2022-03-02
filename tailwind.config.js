module.exports = {
  content: ["./client/**/*.{html,js}", "./imports/ui/*.svelte"],
  theme: {
    extend: {},
    fontFamily: {
      title: ["'Montserrat'", "sans-serif"],
      body: ["Helvetica"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
