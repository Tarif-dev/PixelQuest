import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        dark: "#121212",
        light: "#f0f0f0",
        "hud-bg": "rgba(20, 20, 30, 0.7)",
        "health-color": "var(--success)",
        "damage-color": "var(--danger)",
        // Retro palette
        "retro-black": "#1a1c2c",
        "retro-purple": "#5d3fe8",
        "retro-blue": "#41a6f6",
        "retro-green": "#73ef67",
        "retro-yellow": "#ffcd75",
        "retro-orange": "#ff8a2b",
        "retro-red": "#ff6b6b",
        "retro-pink": "#d767ff",
      },
      fontFamily: {
        pixel: ["PixelFont", "monospace"],
        retro: ["PixelFont", "Press Start 2P", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
        flash: "flash 0.5s ease-in-out",
        "pixel-dissolve": "pixel-dissolve 0.8s ease-out forwards",
        scanline: "scanline 2s linear infinite",
        glitch: "glitch 1s linear infinite",
        "pixel-fade-in": "pixel-fade-in 0.3s steps(5) forwards",
        bounce: "bounce 0.5s ease-in-out infinite alternate",
        blink: "blink 1s steps(1) infinite",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
        flash: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "pixel-dissolve": {
          "0%": {
            clipPath: "circle(0% at center)",
            opacity: "0",
          },
          "100%": {
            clipPath: "circle(100% at center)",
            opacity: "1",
          },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        glitch: {
          "0%": {
            textShadow:
              "0.5px 0 rgba(255, 0, 0, 0.75), -0.5px 0 rgba(0, 255, 255, 0.75)",
          },
          "14%": {
            textShadow:
              "0.5px 0 rgba(255, 0, 0, 0.75), -0.5px 0 rgba(0, 255, 255, 0.75)",
          },
          "15%": {
            textShadow:
              "-0.5px 0 rgba(255, 0, 0, 0.75), 0.5px 0 rgba(0, 255, 255, 0.75)",
          },
          "49%": {
            textShadow:
              "-0.5px 0 rgba(255, 0, 0, 0.75), 0.5px 0 rgba(0, 255, 255, 0.75)",
          },
          "50%": {
            textShadow:
              "0.5px 0 rgba(0, 255, 255, 0.75), -0.5px 0 rgba(255, 0, 0, 0.75)",
          },
          "99%": {
            textShadow:
              "0.5px 0 rgba(0, 255, 255, 0.75), -0.5px 0 rgba(255, 0, 0, 0.75)",
          },
          "100%": {
            textShadow:
              "-0.5px 0 rgba(0, 255, 255, 0.75), 0.5px 0 rgba(255, 0, 0, 0.75)",
          },
        },
        "pixel-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        bounce: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-8px)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      backgroundImage: {
        "game-pattern": "url('/assets/backgrounds/game-bg.svg')",
        "menu-pattern": "url('/assets/backgrounds/menu-bg.svg')",
      },
      borderWidth: {
        "1": "1px",
        "3": "3px",
      },
      boxShadow: {
        pixel: "4px 4px 0px rgba(0, 0, 0, 0.2)",
        "pixel-sm": "2px 2px 0px rgba(0, 0, 0, 0.2)",
        "pixel-lg": "6px 6px 0px rgba(0, 0, 0, 0.2)",
        "pixel-inner": "inset 4px 4px 0px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: (utilities: Record<string, any>) => void }) {
      const newUtilities = {
        ".pixelated": {
          "image-rendering": "pixelated",
          "-webkit-image-rendering": "crisp-edges",
          "-moz-image-rendering": "crisp-edges",
        },
        ".pixel-borders": {
          "border-style": "solid",
          "border-width": "4px",
          "border-image":
            "linear-gradient(45deg, var(--primary), var(--secondary)) 1",
          "image-rendering": "pixelated",
        },
        ".pixel-text": {
          "font-family": '"PixelFont", monospace',
          "letter-spacing": "1px",
          "text-shadow": "2px 2px 0 rgba(0, 0, 0, 0.2)",
          "-webkit-font-smoothing": "none",
          "-moz-osx-font-smoothing": "grayscale",
        },
        ".crt-effect": {
          position: "relative",
          overflow: "hidden",
          "border-radius": "8px",
          "&::after": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.2) 80%, rgba(0, 0, 0, 0.4) 100%)",
            "pointer-events": "none",
            "z-index": "5",
          },
        },
        ".retro-scanlines": {
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.1) 50%)",
            "background-size": "100% 4px",
            "pointer-events": "none",
            "z-index": "10",
          },
        },
        ".touch-control": {
          "user-select": "none",
          "-webkit-tap-highlight-color": "transparent",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
