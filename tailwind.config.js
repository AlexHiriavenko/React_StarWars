/**
 *
 * config not used because tailwind.config in tailwind v4 is legacy and you need to use css first syntax via directives (look index.css file).
 * But if you still want to use the config, you can include it in index.css as follows: @config "../../tailwind.config.js";
 * More details: https://youtu.be/bupetqS1SMU
 *
 * */

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
        accent: '#11CB55',
        input: '#3b3b3b',
      },
    },
  },
  plugins: [],
};
