/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        lagon: { DEFAULT: '#1B8FAD', dark: '#0D5F78', light: '#D6F0F7' },
        sand: { DEFAULT: '#F7F1E3', dark: '#EDE4CC', darker: '#C8B98A' },
        jungle: { DEFAULT: '#2D6A4F', dark: '#1B4332', light: '#D8F3DC' },
        coral: { DEFAULT: '#E07B54', light: '#FCDDD3' },
        sunset: { DEFAULT: '#D4A843', light: '#FEF3D0' },
        lilac: { DEFAULT: '#7B6FA0', light: '#EDE9F5' },
        cream: '#FFFDF7',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        sm: '8px',
      },
    },
  },
  plugins: [],
}
