import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          charcoal: '#2A1711',
          surface: '#FFF9F4',
          card: '#FFFDF9',
          border: '#E8D8CC',
          subtle: '#CDB9AA',
          gold: '#A84D27',
          goldHover: '#8D3E1F',
          bronze: '#C9794B',
          cream: '#FFF7EF',
          muted: '#75665D',
          darkBg: '#1A0E0A',
        },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        display: ['var(--font-cinzel)', 'serif'],
      },
      boxShadow: {
        'luxury': '0 24px 70px rgba(80, 42, 25, 0.10)',
        'glow-gold': '0 0 45px -10px rgba(212, 175, 55, 0.22)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 4s infinite linear',
      },
    },
  },
  plugins: [],
};
export default config;
