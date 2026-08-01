module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        pokedex: {
          bg: "#f7f3eb",
          card: "#fff8ef",
          cardSoft: "#f3ece1",
          accent: "#f26a4b",
          accentSoft: "#ffd5c8",
          panel: "rgba(255,249,241,0.76)",
          text: "#143038",
          muted: "#5d7078",
          line: "#21434b",
          green: "#3aa39c",
          greenDark: "#1a6c67",
          redSoft: "#f3b39f",
          cyanSoft: "#d8f2ef",
        },
      },
      fontFamily: {
        sans: ["Raleway", "serif"],
        pixel: ["VT323", "monospace"],
      },
      boxShadow: {
        panel: "0 24px 70px rgba(20, 48, 56, 0.14)",
        hard: "0 22px 52px rgba(20, 48, 56, 0.18)",
      },
      backgroundImage: {
        "pokedex-page":
          "radial-gradient(circle at 12% 18%, rgba(242, 106, 75, 0.28), transparent 19%), radial-gradient(circle at 88% 16%, rgba(58, 163, 156, 0.22), transparent 24%), radial-gradient(circle at 50% 100%, rgba(255, 213, 200, 0.34), transparent 26%), linear-gradient(180deg, #fffaf2 0%, #eef5f2 54%, #e8efe8 100%)",
        "pokedex-panel":
          "linear-gradient(145deg, rgba(255,255,255,0.84) 0%, rgba(243,236,225,0.82) 52%, rgba(216,242,239,0.78) 100%)",
        "pokedex-card":
          "linear-gradient(155deg, #fff8ef 0%, #ffd5c8 42%, #d8f2ef 100%)",
        "pokedex-thumb": "linear-gradient(180deg, #d8f2ef 0%, #fffaf2 100%)",
      },
    },
  },
};
