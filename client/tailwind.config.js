/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B1220',
          muted: '#5B6478',
          faint: '#9AA3B8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#F7F9FC',
          sunken: '#F0F3F9',
        },
        border: {
          DEFAULT: '#E4E9F2',
          strong: '#D3DAE8',
        },
        brand: {
          50: '#EEF1FF',
          100: '#DCE3FF',
          200: '#B9C7FF',
          300: '#8FA3FF',
          400: '#5F78FF',
          500: '#2452FF',
          600: '#1B3FDE',
          700: '#1631B0',
          800: '#132786',
          900: '#101F63',
        },
        cyan: {
          50: '#E7FDFB',
          100: '#CBFAF6',
          200: '#98F2EB',
          300: '#5DE3DB',
          400: '#22CCC2',
          500: '#0FB8AE',
          600: '#0C948C',
          700: '#0A756F',
        },
        success: '#16A34A',
        danger: '#E11D48',
        warning: '#D97706',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11,18,32,0.04), 0 4px 16px -4px rgba(11,18,32,0.06)',
        card: '0 2px 8px rgba(11,18,32,0.05), 0 12px 32px -12px rgba(20,45,120,0.12)',
        raised: '0 8px 24px -8px rgba(20,45,120,0.18)',
        glow: '0 0 0 1px rgba(36,82,255,0.08), 0 8px 24px -8px rgba(36,82,255,0.35)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(11,18,32,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,18,32,0.035) 1px, transparent 1px)',
        'hero-glow':
          'radial-gradient(60% 50% at 50% 0%, rgba(36,82,255,0.10) 0%, rgba(15,184,174,0.06) 45%, rgba(255,255,255,0) 100%)',
      },
      keyframes: {
        'caret-blink': {
          '0%,49%': { opacity: '1' },
          '50%,100%': { opacity: '0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1s step-end infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
