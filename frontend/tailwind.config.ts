import type { Config } from 'tailwindcss'

// Minimal Tailwind v4 config: no custom theme, only scan content.
const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
}

export default config
