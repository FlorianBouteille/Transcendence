/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.html',
    './src/**/*.{js,ts}',
    './*.{js,ts}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)']
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: '9999px'
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        glass: 'var(--shadow-glass)',
        neon: 'var(--shadow-neon)'
      },
      backgroundImage: {
        cosmic: 'var(--bg-gradient)',
        glow: 'var(--surface-glow)'
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem'
      },
      animation: {
        'ticker': 'ticker 14s linear infinite',
        'pulse-neon': 'pulse-neon 2.4s ease-in-out infinite',
        'slide-down': 'slide-down 220ms ease-out'
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        'pulse-neon': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' }
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};
