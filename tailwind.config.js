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
  // add daisyUI plugin
  plugins: [require("daisyui")],
  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: ["light", "dark"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
};
