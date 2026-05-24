/***Tailwind CSS Configuration***/
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        // "Lume" — emerald primary, total visual reset from purple
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Warm amber highlight — for gradients & glow contrast
        highlight: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Warm neutral surface (replaces pure zinc/slate where used)
        surface: {
          50: '#fafaf9',
          100: '#f5f5f4',
          900: '#0c0a09',
          950: '#0a0908',
        },
      },
      backgroundImage: {
        'grid-black': 'linear-gradient(to right, #00000010 1px, transparent 1px), linear-gradient(to bottom, #00000010 1px, transparent 1px)',
        'grid-white': 'linear-gradient(to right, #ffffff10 1px, transparent 1px), linear-gradient(to bottom, #ffffff10 1px, transparent 1px)',
        'lume-radial': 'radial-gradient(ellipse at top, rgba(16,185,129,0.18), transparent 55%), radial-gradient(ellipse at bottom right, rgba(245,158,11,0.14), transparent 50%)',
        'lume-gradient': 'linear-gradient(135deg, #10b981 0%, #34d399 40%, #fbbf24 100%)',
      },
      backgroundSize: {
        'grid-size': '50px 50px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'aurora': 'aurora 14s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-12px) translateX(6px)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0%, 0%) rotate(0deg)' },
          '50%': { transform: 'translate(-8%, 6%) rotate(8deg)' },
        },
      },
    },
  },
  plugins: [],
};