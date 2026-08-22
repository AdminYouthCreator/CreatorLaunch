/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#F05238',
        'accent': '#13B5D1',
        'sun': '#FFC43D',
        'light': '#FFF8F1',
        'dark': '#172033',
        'medium': '#526077'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
};
