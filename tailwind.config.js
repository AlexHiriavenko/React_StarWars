/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        title: ['"Rubik Mono One"', 'sans-serif'],
      },
      screens: {
        'max-xs': { max: '480px' },
        'max-md': { max: '796px' },
      },
      colors: {
        input: '#282828',
      },
    },
  },
  plugins: [],
};
