/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sky: {
          soft: '#D0EEFF',
          main: '#48B6FF',
          deep: '#1883E6',
        },
        mint: {
          soft: '#D2F7E4',
          main: '#46DB93',
          deep: '#1C985E',
        },
        sun: {
          soft: '#FFF0CA',
          main: '#FFC94D',
          deep: '#D18E0B',
        },
        candy: {
          soft: '#FFE0EB',
          main: '#FF7FA9',
          deep: '#CC3E75',
        },
        ink: '#1F2540',
        cream: '#FFFBF6',
      },
      fontFamily: {
        display: ['Fredoka', 'Baloo 2', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '28px',
        pill: '9999px',
      },
      boxShadow: {
        sticker: '0 8px 0 -2px rgba(0,0,0,0.06), 0 16px 24px -6px rgba(31,37,64,0.12)',
        button: '0 4px 0 0 rgba(31,37,64,0.12)',
        keycap: '0 3px 0 0 rgba(31,37,64,0.14)',
      },
      keyframes: {
        wobble: {
          '0%,100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%,60%': { transform: 'translateX(-8px)' },
          '40%,80%': { transform: 'translateX(8px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.06)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        wobble: 'wobble 4s ease-in-out infinite',
        shake: 'shake 0.24s ease-in-out',
        pop: 'pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        floaty: 'floaty 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
