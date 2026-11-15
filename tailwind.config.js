/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: '#0C1B2E',
          soft: '#16263d',
          card: '#1a2d44',
        },
        field: {
          DEFAULT: '#127A55',
          light: '#1a9c6f',
          dark: '#0e5f42',
        },
        bright: {
          DEFAULT: '#45D19A',
          light: '#6ee0b5',
        },
        maize: {
          DEFAULT: '#F4C04E',
          light: '#f8d27a',
        },
        mist: '#E6F1EC',
        paper: '#F2F6F4',
        alert: {
          DEFAULT: '#E5604D',
          light: '#f08a7a',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl2': '1.5rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.5s ease-out both',
        'draw-in': 'drawIn 1.2s ease-out both',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'progress-fill': 'progressFill 0.5s ease-out both',
        'press': 'press 0.15s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        drawIn: {
          '0%': { opacity: '0', transform: 'scaleY(0)' },
          '100%': { opacity: '1', transform: 'scaleY(1)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
        progressFill: {
          '0%': { width: '0%' },
        },
        press: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.96)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
