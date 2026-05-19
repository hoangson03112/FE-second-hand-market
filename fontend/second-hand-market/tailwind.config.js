/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  important: true, // Make Tailwind classes take precedence over Bootstrap
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#344960',
          light: '#f0f4f8',
          hover: '#667eea',
        },
      },
      keyframes: {
        pulseNotification: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        pulseNotification: 'pulseNotification 2s infinite',
        fadeInUp: 'fadeInUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts with Bootstrap
  },
}
