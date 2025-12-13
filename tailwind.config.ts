import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Vyxo Codex Tailwind Configuration
 * Integrated with design tokens from src/styles/tokens.css
 */

const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ========================================
       * COLORS - Mapped to CSS Variables
       * ======================================== */
      colors: {
        background: {
          primary: "var(--background-primary)",
          secondary: "var(--background-secondary)",
          tertiary: "var(--background-tertiary)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        accent: {
          primary: "var(--accent-primary)",
          hover: "var(--accent-hover)",
          active: "var(--accent-active)",
        },
        status: {
          success: "var(--status-success)",
          warning: "var(--status-warning)",
          error: "var(--status-error)",
          info: "var(--status-info)",
        },
        border: {
          subtle: "var(--border-subtle)",
          emphasis: "var(--border-emphasis)",
        },
      },

      /* ========================================
       * TYPOGRAPHY
       * ======================================== */
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
      fontSize: {
        "4xl": ["var(--text-4xl)", { lineHeight: "var(--leading-4xl)" }],
        "3xl": ["var(--text-3xl)", { lineHeight: "var(--leading-3xl)" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "var(--leading-2xl)" }],
        xl: ["var(--text-xl)", { lineHeight: "var(--leading-xl)" }],
        lg: ["var(--text-lg)", { lineHeight: "var(--leading-lg)" }],
        base: ["var(--text-base)", { lineHeight: "var(--leading-base)" }],
        sm: ["var(--text-sm)", { lineHeight: "var(--leading-sm)" }],
        xs: ["var(--text-xs)", { lineHeight: "var(--leading-xs)" }],
      },
      fontWeight: {
        normal: "var(--font-normal)",
        medium: "var(--font-medium)",
        semibold: "var(--font-semibold)",
        bold: "var(--font-bold)",
      },
      letterSpacing: {
        tight: "var(--tracking-tight)",
        normal: "var(--tracking-normal)",
        wide: "var(--tracking-wide)",
      },

      /* ========================================
       * SPACING - 8pt Grid
       * ======================================== */
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        16: "var(--space-16)",
      },

      /* ========================================
       * BORDER RADIUS
       * ======================================== */
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },

      /* ========================================
       * BOX SHADOW - Elevation
       * ======================================== */
      boxShadow: {
        1: "var(--elevation-1)",
        2: "var(--elevation-2)",
        3: "var(--elevation-3)",
      },

      /* ========================================
       * TRANSITIONS
       * ======================================== */
      transitionDuration: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
      },

      /* ========================================
       * Z-INDEX
       * ======================================== */
      zIndex: {
        base: "0",
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        "modal-backdrop": "1040",
        modal: "1050",
        popover: "1060",
        tooltip: "1070",
        toast: "1080",
      },

      /* ========================================
       * ANIMATIONS
       * ======================================== */
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fadeIn var(--transition-base) ease-out",
        "slide-up": "slideUp var(--transition-base) ease-out",
        "slide-down": "slideDown var(--transition-base) ease-out",
        spin: "spin 1s linear infinite",
      },

      /* ========================================
       * BREAKPOINTS (Screen Sizes)
       * ======================================== */
      screens: {
        mobile: "640px",
        tablet: "1024px",
        desktop: "1280px",
      },
    },
  },
  plugins: [animate],
} satisfies Config;

export default config;
