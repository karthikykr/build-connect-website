/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        // Light Theme Colors (matching mobile app)
        primary: '#2A8E9E',
        secondary: '#001d3d',
        background: '#F5F7FA',
        card: '#FFFFFF',
        accent: '#E6F3F7',
        'text-primary': '#212121',
        'text-secondary': '#757575',
        success: '#4CAF50',
        warning: '#FFB300',
        error: '#D32F2F',
        gray: '#9CA3AF',
        'gray-light': '#F3F4F6',
        white: '#FFFFFF',

        // Dark Theme Colors
        dark: {
          background: '#121212',
          card: '#1E1E1E',
          'text-primary': '#E0E0E0',
          'text-secondary': '#B0B0B0',
          accent: '#1B2A33',
        },

        // Additional colors from mobile app
        graytext: '#666666',
        purple: '#7C3AED',
        pink: '#EC4899',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        playwrite: ['PlaywriteDKLoopet-Thin', 'cursive'],
      },
      boxShadow: {
        fab: '0px 2px 10px rgba(0, 0, 0, 0.25)',
        card: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        'card-hover': '0px 8px 25px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
