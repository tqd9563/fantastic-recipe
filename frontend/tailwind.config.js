/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
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
        sage: {
          DEFAULT: "#6B9080",
          50: "#F0F7F4",
          100: "#E0EFE8",
          200: "#C1DFD1",
          300: "#A2CFC0",
          400: "#83BFAD",
          500: "#6B9080", // Primary
          600: "#557366",
          700: "#40564D",
          800: "#2B3933",
          900: "#151D19",
        },
        orange: {
          DEFAULT: "#F4A261",
          50: "#FEF6EC",
          100: "#FDECD9",
          200: "#FBD9B3",
          300: "#F9C68D",
          400: "#F7B467",
          500: "#F4A261", // Secondary
          600: "#C3824E",
          700: "#92613A",
          800: "#624127",
          900: "#312013",
        },
        cream: {
          DEFAULT: "#F6F7F2",
          50: "#FFFFFF",
          100: "#FEFEFE",
          200: "#FCFDFD",
          300: "#FAFBFC",
          400: "#F8F9FA",
          500: "#F6F7F2", // Background
          600: "#C5C6C2",
          700: "#949491",
          800: "#626361",
          900: "#313130",
        },
        charcoal: "#264653",
        slate: "#556B75",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

