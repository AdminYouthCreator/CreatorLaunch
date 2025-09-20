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
        'primary': '#F55F55',
        'accent': '#387ADF',
        'light': '#F7F9FC',
        'dark': '#2D3748',
        'medium': '#4A5568'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
};
