/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C5F7C',
        secondary: '#4A8BA8',
        accent: '#FF6B6B',
        surface: '#FFFFFF',
        background: '#F8FAFB',
        success: '#51CF66',
        warning: '#FFB84D',
        error: '#FF6B6B',
        info: '#4A8BA8',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}