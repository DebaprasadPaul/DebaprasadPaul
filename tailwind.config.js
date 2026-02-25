/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: { bg: '#0F0F14', card: '#1A1A24', border: '#2A2A3A' },
        accent: { cyan: '#22D3EE', 'cyan-dim': '#0891B2' },
        text: { primary: '#F9FAFB', secondary: '#9CA3AF', muted: '#6B7280' },

        retro: {
          bg: '#E8DCC6',
          cream: '#FFF8E7',
          sand: '#D4C4A0',
          dirt: '#A08860',
          wood: '#6B5233',
          bark: '#3B2F20',
          green: '#5A8C3C',
          'green-dark': '#3D6B2E',
          teal: '#5F9EA0',
          sky: '#A8C8D8',
          gold: '#C89B3C',
          rust: '#8B4513',
          brick: '#A0522D',
          roof: '#B22222',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}