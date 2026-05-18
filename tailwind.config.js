/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sky: {
          soft: '#BFE4FF',
          main: '#3FB6FF',
          deep: '#1F7FD6',
        },
        mint: {
          soft: '#C8F5DD',
          main: '#3DD58A',
          deep: '#1B8F58',
        },
        sun: {
          soft: '#FFE7A8',
          main: '#FFC23C',
          deep: '#C7860B',
        },
        candy: {
          soft: '#FFD3E2',
          main: '#FF6FA3',
          deep: '#C2356D',
        },
        ink: '#1F2540',
        cream: '#FFF8EE',
      },
      fontFamily: {
        display: ['Fredoka', 'Baloo 2', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '28px',
        pill: '9999px',
      },
      boxShadow: {
        sticker: '0 10px 0 -2px rgba(0,0,0,0.08), 0 18px 30px -8px rgba(31,37,64,0.18)',
        button: '0 5px 0 0 rgba(0,0,0,0.12)',
        keycap: '0 4px 0 0 rgba(0,0,0,0.14)',
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
