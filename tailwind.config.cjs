const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0C1231',
        indigoGlow: '#4D5DFB',
        cyanAura: '#5CE1E6',
        sunset: '#FF6B6B',
        slate: colors.slate
      },
      fontFamily: {
        sans: ['\"Plus Jakarta Sans\"', 'ui-sans-serif', 'system-ui'],
        heading: ['\"Space Grotesk\"', 'ui-sans-serif', 'system-ui']
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at 20% 20%, rgba(92, 225, 230, 0.2), transparent 40%), radial-gradient(circle at 80% 30%, rgba(77, 93, 251, 0.25), transparent 45%)'
      },
      boxShadow: {
        card: '0 30px 60px rgba(12, 18, 49, 0.35)'
      }
    }
  },
  plugins: []
};
