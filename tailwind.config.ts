import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'burnt-orange': {
          DEFAULT: '#CC5500',
        },
      },
      fontSize: {
        '2xs': '0.625rem',
      },
    },
  },
  plugins: [],
};

export default config;
