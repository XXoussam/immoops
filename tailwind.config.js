/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* shadcn / agents-ui CSS variable tokens */
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        /* project brand tokens */
        purple: {
          DEFAULT: '#6D4AFF',
          hover:   '#7F5FFF',
          light:   '#C084FC',
          pale:    '#F7F5FF',
          faint:   '#F0EEFF',
          dark:    '#0F1117',
        },
        gray: {
          bg:      '#F7F5FF',
          bgalt:   '#F0EEFF',
          line:    '#E8EAF0',
          line2:   '#EDEEF3',
          copy:    '#6B7280',
          menu:    '#6B7280',
        },
        ink: {
          DEFAULT: '#0F1117',
          body:    '#6B7280',
          muted:   '#6B7280',
          light:   '#9090b0',
        },
      },
      fontFamily: {
        sans:    ['Jost', 'Arial', 'sans-serif'],
        tight:   ['Jost', 'Arial', 'sans-serif'],
        mono:    ['"Fira Mono"', 'monospace'],
      },
      fontSize: {
        'h1': ['5.5rem',  { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'h2': ['3.75rem', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'h3': ['2.5rem',  { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h4': ['1.625rem',{ lineHeight: '1.35', letterSpacing: '-0.01em' }],
        'b1': ['1.375rem',{ lineHeight: '1.55', letterSpacing: '-0.2px' }],
        'b2': ['1.125rem',{ lineHeight: '1.55', letterSpacing: '-0.16px' }],
        'sm': ['0.9375rem',{ lineHeight: '1.5' }],
        'xs': ['0.8125rem',{ lineHeight: '1.5' }],
      },
      fontWeight: {
        '450': '450',
      },
      maxWidth: {
        'container': '1200px',
      },
      borderRadius: {
        /* Galadrim-style geometry: square corners everywhere */
        'btn':  '0px',
        'card': '0px',
        'pill': '0px',
      },
      boxShadow: {
        'card':  '0 2px 12px rgba(0,0,0,0.06)',
        'card2': '0 4px 24px rgba(109,74,255,0.12)',
        'dark':  '0 4px 32px rgba(0,0,0,0.3)',
      },
      transitionDuration: {
        '200': '200ms',
        '333': '333ms',
      },
      animation: {
        first:  'moveVertical 30s ease infinite',
        second: 'moveInCircle 20s reverse infinite',
        third:  'moveInCircle 40s linear infinite',
        fourth: 'moveHorizontal 40s ease infinite',
        fifth:  'moveInCircle 20s ease infinite',
      },
      keyframes: {
        moveHorizontal: {
          '0%':   { transform: 'translateX(-50%) translateY(-10%)' },
          '50%':  { transform: 'translateX(50%) translateY(10%)' },
          '100%': { transform: 'translateX(-50%) translateY(-10%)' },
        },
        moveInCircle: {
          '0%':   { transform: 'rotate(0deg)' },
          '50%':  { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        moveVertical: {
          '0%':   { transform: 'translateY(-50%)' },
          '50%':  { transform: 'translateY(50%)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
