/** @type {import('tailwindcss').Config} */
// Palette is sampled from the AbiSentry logo (public/logo.jpg).
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05070D',       // page background (logo's black)
        surface: '#0D1424',  // cards, panels, form fields
        line: '#1D2A45',     // borders, dividers
        fg: '#E8F1FF',       // main text
        cyan: '#2FD4F7',     // logo's bright shield highlight, primary
        sky: '#4FB5E8',      // logo's mid shield blue
        violet: '#7B8FE0',   // logo's ribbon periwinkle
        orchid: '#D45FB5',   // logo's pink ribbon edge
        mint: '#6FE8C8',     // logo's teal-green glow, healthy/resolved
        lock: '#2B6CB8',     // logo's padlock blue
        signal: '#F2527F',   // critical alerts (pink-red, sits with the ribbon)
        amber: '#F5B544',    // warnings
      },
      backgroundImage: {
        brand: 'linear-gradient(90deg, #2FD4F7 0%, #7B8FE0 70%, #D45FB5 130%)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(2.5rem, 6vw, 4.75rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
      },
      keyframes: {
        arrive: {
          '0%': { opacity: '0', transform: 'translateY(-14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
      },
      animation: {
        arrive: 'arrive 0.5s ease-out both',
        ripple: 'ripple 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
}
