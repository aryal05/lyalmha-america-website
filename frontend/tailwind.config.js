/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact Logo Colors
        'newari-red': '#C41E3A',        // Deep Red from Nepali text
        'deep-maroon': '#8B1538',       // Darker red shade
        'royal-blue': '#0A3161',        // Deep Royal Blue from English text
        'bright-blue': '#1E4D8B',       // Lighter blue accent
        'gold-accent': '#D4AF37',       // Classic gold border
        'bright-gold': '#FFD700',       // Bright golden yellow
        
        // Background Colors - Optimized for readability
        'cream-white': '#FDFEFE',       // Very soft white with hint of warmth
        'pure-white': '#FFFFFF',        // Pure white
        'charcoal-black': '#1a1a1a',    // Soft black
        'dark-navy': '#0a1628',         // Very dark blue
        'light-gray': '#F7F9FB',        // Optimized soft blue-gray background
        'slate-bg': '#FAFBFC',          // Elegant slate background - lighter
        
        // Text Colors - Optimized contrast
        'primary-text': '#1A202C',      // Darker for better readability
        'secondary-text': '#4A5568',    // Medium gray with good contrast
        'paragraph-text': '#2D3748',    // Body text - darker for readability
        'muted-text': '#718096',        // Lighter for secondary content
        
        // UI Elements
        'border-line': '#e2e8f0',       // Subtle borders
        'border-accent': '#C41E3A',     // Red accent borders
        'footer-bg': '#0a1628',
        
        // Legacy support
        'deep-black': '#1a1a1a',
        'nepal-red': '#C41E3A',
        'usa-blue': '#0A3161',
        'accent-gray': '#e2e8f0',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(220, 20, 60, 0.3)',
        'gold': '0 8px 32px rgba(255, 215, 0, 0.25)',
        'blue': '0 8px 32px rgba(30, 58, 138, 0.25)',
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
