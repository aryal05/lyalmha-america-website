/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        'newari-red': '#C4161C',
        'deep-maroon': '#8E0E13',
        'gold-accent': '#D4A574',
        'charcoal-black': '#0F0F14',
        'dark-navy': '#1E2430',
        
        // Text Colors
        'primary-text': '#FFFFFF',
        'paragraph-text': '#D1D5DB',
        'muted-text': '#9CA3AF',
        
        // UI Elements
        'border-line': '#2A2F3A',
        'footer-bg': '#0B0B10',
        
        // Legacy support
        'deep-black': '#0F0F14',
        'nepal-red': '#C4161C',
        'usa-blue': '#1F3C88',
        'accent-gray': '#2E2E2E',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(196, 22, 28, 0.1)',
        'gold': '0 8px 32px rgba(242, 201, 76, 0.15)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-out',
        'slideUp': 'slideUp 0.6s ease-out',
        'slideDown': 'slideDown 0.6s ease-out',
        'scaleIn': 'scaleIn 0.4s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
