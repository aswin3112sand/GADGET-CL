/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50: '#fcf7ef',
          100: '#f5ebdd',
          200: '#ead8bd',
          300: '#dbc097',
          400: '#c99f67',
          500: '#b7864b',
          600: '#94602f',
          700: '#704625',
          800: '#4e301d',
          900: '#291911',
        },
        sand: {
          50: '#fffcf7',
          100: '#faf3e9',
          200: '#f0e4d4',
          300: '#e4d1ba',
        },
        ink: {
          50: '#7d6f63',
          100: '#625449',
          200: '#493b31',
          300: '#30241d',
          400: '#19120e',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        glass: '0 18px 40px rgba(43, 30, 18, 0.08), inset 0 1px 0 rgba(255,255,255,0.74)',
        'soft-lift': '0 14px 34px rgba(34, 24, 16, 0.07)',
        'card-hover': '0 28px 58px rgba(27, 18, 10, 0.14)',
        premium: '0 28px 78px rgba(20, 14, 9, 0.2)',
        anchor: '0 34px 88px rgba(17, 11, 7, 0.28)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
