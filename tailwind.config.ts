import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Haunted Color Palette - "Graveyard at Midnight"
        'graveyard-black': '#0a0a0a',
        'midnight-black': '#121212',
        'shadow-gray': '#1a1a1a',
        'ghost-gray': '#2a2a2a',

        // Pumpkin Orange Shades
        'pumpkin-orange': {
          DEFAULT: '#ff7518',
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ff7518',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },

        // Mystic Purple Shades
        'mystic-purple': {
          DEFAULT: '#8b5cf6',
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },

        // Legacy spooky theme colors
        'haunted-purple': '#2D1B69',
        'halloween-orange': '#FF6B35',
        'ghost-white': '#FCFCFC',
        'midnight-blue': '#1A1A2E',
        'spooky-green': '#39FF14',

        // Additional semantic colors
        'tombstone-gray': '#71717a',
        'spirit-blue': '#60a5fa',
        'witch-green': '#4ade80',
        'blood-red': '#dc2626',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'orange-glow': '0 0 20px rgba(255, 117, 24, 0.3)',
        'orange-glow-lg': '0 0 30px rgba(255, 117, 24, 0.5)',
        'purple-glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'purple-glow-lg': '0 0 30px rgba(139, 92, 246, 0.5)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(255, 117, 24, 0.3)'
          },
          '50%': {
            opacity: '0.7',
            boxShadow: '0 0 30px rgba(255, 117, 24, 0.5)'
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        slideInRight: {
          from: {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        fadeInUp: 'fadeInUp 0.3s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
        scaleIn: 'scaleIn 0.3s ease-out',
        slideInRight: 'slideInRight 0.3s ease-out',
        'spin-slow': 'spin-slow 3s linear infinite',
      },
      animationDelay: {
        '0': '0s',
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      fontFamily: {
        creepster: ['Creepster', 'cursive'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.pumpkin-orange.500'),
              '&:hover': {
                color: theme('colors.pumpkin-orange.400'),
              },
            },
            h1: {
              color: theme('colors.pumpkin-orange.400'),
            },
            h2: {
              color: theme('colors.pumpkin-orange.400'),
            },
            h3: {
              color: theme('colors.pumpkin-orange.300'),
            },
            h4: {
              color: theme('colors.pumpkin-orange.300'),
            },
            code: {
              color: theme('colors.pumpkin-orange.300'),
              backgroundColor: theme('colors.gray.800'),
              borderRadius: '0.25rem',
              padding: '0.125rem 0.375rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            strong: {
              color: theme('colors.white'),
            },
            blockquote: {
              color: theme('colors.gray.400'),
              borderLeftColor: theme('colors.pumpkin-orange.500'),
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.pumpkin-orange.500'),
            },
            h1: {
              color: theme('colors.pumpkin-orange.400'),
            },
            h2: {
              color: theme('colors.pumpkin-orange.400'),
            },
            h3: {
              color: theme('colors.pumpkin-orange.300'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}

export default config
