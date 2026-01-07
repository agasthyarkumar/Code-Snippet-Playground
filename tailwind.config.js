/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"JetBrains Mono"', '"IBM Plex Mono"', 'SFMono-Regular', 'ui-monospace', 'Menlo', 'monospace'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'SFMono-Regular', 'ui-monospace', 'Menlo', 'monospace'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
