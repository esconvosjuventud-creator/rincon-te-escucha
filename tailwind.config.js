/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A496A',
        navy: '#073B5C',
        sky: '#74C7EF',
        pale: '#EAF7FC',
        sunshine: '#FFC928',
        cream: '#FFF9E9',
        blush: '#F7B7D8',
        mint: '#BFE7CE',
        lilac: '#D9C9F4'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(7,59,92,0.12)'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
}
