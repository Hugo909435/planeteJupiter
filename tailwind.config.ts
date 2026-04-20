import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        white: '#ffffff',
        black: '#000000',
        'gray-mist': '#f0f0f0',
        'gray-light': '#b0b0b0',
        'gray-mid': '#606060',
        'gray-dark': '#1a1a1a',
        'gray-deep': '#0d0d0d',
      },
      letterSpacing: {
        widest: '0.3em',
        ultra: '0.5em',
      },
      transitionTimingFunction: {
        cinema: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      animation: {
        'spin-slow': 'spin 60s linear infinite',
        'fade-in': 'fadeIn 1.2s ease forwards',
        'scroll-line': 'scrollLine 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scrollLine: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '50%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '51%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
      },
    },
  },
  plugins: [],
}

export default config
