/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        surface: {
          DEFAULT: '#F4F4F5',
          subtle: '#F9F9FB',
          card: '#FFFFFF',
          border: '#E4E4E7',
          dark: '#18181B'
        },
        border: {
          DEFAULT: '#E4E4E7',
          subtle: '#F4F4F5',
          dark: '#27272A'
        },
        primary: {
          DEFAULT: '#09090B',
          hover: '#18181B',
          light: '#F4F4F5',
          dark: '#000000'
        },
        muted: {
          DEFAULT: '#71717A',
          foreground: '#A1A1AA',
          light: '#A1A1AA'
        },
        khmer: {
          blue: '#002B7F',
          red: '#ED1C24',
          gold: '#FBBF24'
        },
        accent: {
          success: '#10B981',
          'success-light': '#ECFDF5',
          warning: '#F59E0B',
          'warning-light': '#FFFBEB',
          error: '#EF4444',
          'error-light': '#FEF2F2',
          info: '#3B82F6',
          'info-light': '#EFF6FF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Kantumruy Pro', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        khmer: ['"Kantumruy Pro"', '"Khmer OS Battambang"', 'Inter', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 3px 1px rgba(0, 0, 0, 0.02)',
        elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        glow: '0 0 15px rgba(0, 0, 0, 0.05)'
      }
    },
  },
  plugins: [],
}
