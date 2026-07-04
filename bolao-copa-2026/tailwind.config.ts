import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campo: "#0B3D2E",      // verde campo escuro
        campoClaro: "#136F4A", // verde campo vivo
        ouro: "#E8B33D",       // dourado taça
        marfim: "#F6F3EC",     // fundo claro
        carvao: "#1C1C1C",     // texto escuro
        erro: "#C1443C",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};
export default config;
