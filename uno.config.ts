import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': "inline-block",
        'vertical-align': "middle",
        'background-color': 'transparent',
        'color': 'inherit',
      },
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: "Inter:400,500,600,700",
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      primary: {
        DEFAULT: "#4361EE",
        dark: "#3A56D4",
        light: "#637BFF",
        lighter: "#899BFF",
        lightest: "#F0F3FF",
      },
      secondary: {
        DEFAULT: "#455A64",
        dark: "#37474F",
        light: "#78909C",
        lighter: "#B0BEC5",
        lightest: "#ECEFF1",
      },
      danger: {
        DEFAULT: "#FF4560",
        dark: "#E63E57",
        light: "#FF6B83",
        lighter: "#FF9EAD",
        lightest: "#FFE5EA",
      },
      success: {
        DEFAULT: "#38CB89",
        dark: "#2EAA73",
        light: "#5DDAA3",
        lighter: "#9BE9C6",
        lightest: "#E3F9EF",
      },
      background: "#F8FAFF",
    },
    borderRadius: {
      'lg': '0.5rem',
      'xl': '0.75rem',
      '2xl': '1rem',
      'pill': '9999px',
    },
  },
  shortcuts: {
    "btn": "px-5 py-3 rounded-xl font-medium inline-flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md",
    "btn-primary": "btn bg-primary text-white hover:bg-primary-dark focus:ring-primary-light hover:translate-y-[-1px]",
    "btn-secondary": "btn bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary-light hover:translate-y-[-1px]",
    "btn-danger": "btn bg-danger text-white hover:bg-danger-dark focus:ring-danger-light hover:translate-y-[-1px]",
    "btn-success": "btn bg-success text-white hover:bg-success-dark focus:ring-success-light hover:translate-y-[-1px]",
    "btn-outline-primary": "btn bg-transparent text-primary border-2 border-primary hover:bg-primary-lightest focus:ring-primary-light",
    "btn-outline-secondary": "btn bg-transparent text-secondary border-2 border-secondary hover:bg-secondary-lightest focus:ring-secondary-light",
    "btn-ghost": "btn bg-transparent hover:bg-gray-100 focus:ring-primary-light text-gray-700 shadow-none hover:shadow-none",
    "btn-icon": "p-2 rounded-full transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 hover:shadow-md",
    "btn-icon-primary": "btn-icon text-primary hover:text-white hover:bg-primary focus:ring-primary-light",
    "btn-icon-secondary": "btn-icon text-secondary hover:text-white hover:bg-secondary focus:ring-secondary-light",
    "btn-icon-danger": "btn-icon text-danger hover:text-white hover:bg-danger focus:ring-danger-light",
    "card": "bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200",
    "input": "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-gray-900 bg-white placeholder:text-gray-400 transition-colors duration-150 ease-in-out",
    "form-label": "block text-sm font-semibold text-gray-700 mb-1.5",
    "error-box": "bg-danger-lightest text-danger-dark p-4 rounded-xl text-sm border-l-4 border-danger",
  },
  safelist: "prose m-auto text-left".split(" "),
});