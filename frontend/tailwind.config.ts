import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        wood: {
          50: '#FAF6F0',
          100: '#F4ECE0',
          200: '#E6D5BE',
          300: '#D5BC98',
          400: '#C29F72',
          500: '#AD8250',
          600: '#94693D',
          700: '#755030',
          800: '#5A3D26',
          900: '#3D2817',
        },
        shaad: {
          50: '#f1f7f3',
          100: '#e0efe4',
          200: '#c3dec9',
          300: '#98c5a2',
          400: '#68a676',
          500: '#458853',
          600: '#336e40',
          700: '#2a5734',
          800: '#20572d', // Official Shaadwood Forest Green
          900: '#1c3e23',
          950: '#0c2112',
        },
        zen: {
          50: '#FAF8F5',
          100: '#F5F1EB',
          200: '#EAE4DC',
          300: '#DCD3C7',
          400: '#BFB2A2',
          500: '#9F9181',
          600: '#7E7163',
          700: '#61564B',
          800: '#473F37',
          900: '#2B2520',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      dropShadow: {
        xs: '0 1px 1px rgb(0 0 0 / 0.25)',
      },
      scale: {
        '103': '1.03',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
