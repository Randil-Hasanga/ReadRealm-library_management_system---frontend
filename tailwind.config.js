/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chocolate: {
          50: '#f5f0e5', // Lightest chocolate
          100: '#e2d1a5',
          200: '#c7a763',
          300: '#b27d42', // Light chocolate
          400: '#9a6732',
          500: '#7f4f1f', // Default chocolate
          600: '#6a3f18',
          700: '#553017',
          800: '#402417',
          900: '#2b1911', // Dark chocolate
        },
      },
    },
  },
  plugins: [],
}

