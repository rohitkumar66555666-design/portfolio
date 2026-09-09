/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        card: '#12121a',
        border: '#1e1e2a',
        fg: '#e8e8f0',
        muted: '#6b6b80',
        accent: '#00d4aa',
        accent2: '#a855f7',
        neon: '#00ff88',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}