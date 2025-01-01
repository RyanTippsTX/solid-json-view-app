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
      animation: {
        fade: 'fadeIn .5s ease-in-out',
        flash: 'flash 500ms ease-in-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '100' },
        },
        flash: {
          '0%': { color: 'rgb(34 197 94)', opacity: '100' }, // Tailwind's green-500
          '100%': { color: 'inherit', opacity: '100' }, // Back to the original color
        },
      },
    },
  },
  plugins: [],
};

export default config;
