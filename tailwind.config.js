/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#0A4D68',
        'secondary-blue': '#088395',
        'light-blue-bg': '#f5f8fa',
        'accent-gold': '#FFC107',
        'text-dark': '#34495e',
        'text-light': '#7f8c8d',
      }
    },
  },
  plugins: [],
};