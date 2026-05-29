import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rp-red': '#C8102E',
        'rp-red-dark': '#9B0C23',
        'rp-red-light': '#FDECEA',
        'rp-black': '#111111',
        'rp-gray': {
          700: '#444444',
          500: '#777777',
          200: '#E8E8E8',
          100: '#F5F5F5',
        },
        'rp-cream': '#FDF8F6',
        'rp-burgundy': '#6B1015',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
