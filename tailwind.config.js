/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        holoDark: "#09071E",
        holoCard: "#0E0B2B",
        holoSurface: "#130E38",
        holoBorder: "#1F2937",
        cyanGlow: "#00F0FF",
        cyanAccent: "#38BDF8",
        violetGlow: "#9333EA",
        crimsonBlock: "#EF4444",
        amberWarn: "#F59E0B",
        emeraldAllow: "#10B981",
        // Additional utility colors
        obsidian: {
          DEFAULT: '#09071E',
          card: '#0E0B2B',
          surface: '#130E38',
          border: '#1F2937'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace', 'ui-monospace']
      },
      boxShadow: {
        'cyan-glow': '0 0 25px -3px rgba(0, 240, 255, 0.45)',
        'cyan-sm': '0 0 10px rgba(0, 240, 255, 0.3)',
        'violet-glow': '0 0 25px -3px rgba(147, 51, 234, 0.45)',
        'crimson-glow': '0 0 25px -3px rgba(239, 68, 68, 0.45)',
        'hud': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 10px 30px -10px rgba(0, 0, 0, 0.85)'
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        }
      }
    },
  },
  plugins: [],
}
