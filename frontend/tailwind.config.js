/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#f0f4f8',
          100: '#d9e4ee',
          200: '#b3c9dd',
          300: '#80a6c6',
          400: '#4d83af',
          500: '#2d6496',
          600: '#1f4f7a',
          700: '#163c5e',
          800: '#0f2a42',
          900: '#081826',
          950: '#040c14',
        },
        sand: {
          50:  '#faf8f4',
          100: '#f4f0e6',
          200: '#e8dece',
          300: '#d9c9b0',
          400: '#c4ae8a',
          500: '#ad9066',
          600: '#967550',
          700: '#7a5d3e',
          800: '#5f4830',
          900: '#3d2e1e',
        },
        rust: {
          50:  '#fdf4f0',
          100: '#fae5db',
          200: '#f4c8b5',
          300: '#eba185',
          400: '#de7252',
          500: '#c8512a',
          600: '#a83d1e',
          700: '#852e15',
          800: '#62220f',
          900: '#3d1508',
        },
      },
      fontFamily: {
        heading: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
      },
    },
  },
  plugins: [],
}
 