/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f4f7ed",
          100: "#e4ebd0",
          200: "#cddbb0",
          300: "#aec78a",
          400: "#9DC08B",
          500: "#7BAF78",
          600: "#609966",
          700: "#4a5d3a",
          800: "#40513B",
          900: "#2a3526",
        },
        cream: {
          50: "#fdfcf7",
          100: "#faf8ed",
          200: "#f6f4e0",
          300: "#f4f2e3",
          400: "#ece8c9",
          500: "#e0d9a8",
          600: "#d4ca87",
          700: "#c8bb66",
          800: "#bcac45",
          900: "#b09d24",
        },
        accent: {
          50: "#fdf4e6",
          100: "#fae3bf",
          200: "#f5d196",
          300: "#f0bf6d",
          400: "#ebad44",
          500: "#c2823e",
          600: "#a06a32",
          700: "#7d5226",
          800: "#5b3a1a",
          900: "#39220e",
        },
        forest: {
          DEFAULT: "#2a3526",
          50: "#e8ebe5",
          100: "#c5ccc0",
          200: "#9eab97",
          300: "#778a6e",
          400: "#5a7250",
          500: "#40513B",
          600: "#354430",
          700: "#2a3526",
          800: "#1f271c",
          900: "#141912",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "28px",
      },
      boxShadow: {
        soft: "0 2px 12px rgba(64, 81, 59, 0.08)",
        hover: "0 8px 30px rgba(64, 81, 59, 0.12)",
        card: "0 4px 20px rgba(64, 81, 59, 0.06)",
        "card-hover": "0 12px 40px rgba(64, 81, 59, 0.15)",
        glow: "0 0 30px rgba(157, 192, 139, 0.2)",
        inner: "inset 0 2px 4px rgba(64, 81, 59, 0.06)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 2s infinite linear",
        "ken-burns": "kenBurns 15s ease-in-out infinite alternate",
        marquee: "marquee 30s linear infinite",
        float: "float 6s ease-in-out infinite",
        "draw-line": "drawLine 1s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        kenBurns: {
          "0%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1.15)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        drawLine: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
