import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "../assets/js/core/services.js";
import "../assets/js/core/storage.js";
import "../assets/js/core/store.js";
import "../assets/js/data/pokemon-seed.js";
import App from "./App";

const SPLASH_STORAGE_KEY = "pokedex-shop:first-access-complete";

function hasSeenSplash() {
  try {
    return window.localStorage.getItem(SPLASH_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function markSplashSeen() {
  try {
    window.localStorage.setItem(SPLASH_STORAGE_KEY, "true");
  } catch {
    // Ignora bloqueios de storage e segue com a experiência.
  }
}

function createBootSplash() {
  if (hasSeenSplash()) {
    return;
  }

  const existingSplash = document.getElementById("boot-splash");
  if (existingSplash) {
    existingSplash.remove();
  }

  const splash = document.createElement("div");
  splash.id = "boot-splash";
  splash.className =
    "splash-overlay fixed inset-0 z-[90] min-h-screen w-screen overflow-auto bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.46),transparent_28%),linear-gradient(180deg,#d6e2eb_0%,#c7d6e4_100%)]";

  const splashPokemons = (window.PokedexSeed || []).slice(0, 3);
  const posterMarkup = splashPokemons
    .map(
      (pokemon) => `
        <article class="hero-panel-enter overflow-hidden rounded-[28px] bg-white shadow-[0_18px_40px_rgba(88,103,122,0.16)]" style="animation-delay:${pokemon.id * 40}ms">
          <div class="relative min-h-[180px] bg-[linear-gradient(180deg,#8be091_0%,#5dd8b5_100%)] px-4 pt-4">
            <div class="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/82">#${String(pokemon.id).padStart(3, "0")}</div>
            <img class="absolute bottom-4 right-4 max-h-[132px] w-[46%] object-contain object-center drop-shadow-[0_16px_20px_rgba(29,43,73,0.22)]" src="${pokemon.image}" alt="${pokemon.name}" />
          </div>
          <div class="grid gap-2 p-4">
            <div class="font-pixel text-[2rem] leading-none text-[#5d6a80]">${pokemon.name}</div>
          </div>
        </article>
      `,
    )
    .join("");

  splash.innerHTML = `
    <div class="splash-panel min-h-screen w-full px-4 py-4 md:px-8 md:py-8">
      <div class="grid min-h-[calc(100vh-2rem)] gap-8 overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,rgba(252,253,255,0.94)_0%,rgba(237,243,249,0.96)_100%)] p-6 shadow-[0_34px_90px_rgba(71,93,120,0.24)] md:min-h-[calc(100vh-4rem)] md:p-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)] xl:items-center">
        <div class="flex h-full flex-col justify-center">
          <div class="mb-3 text-[0.76rem] font-semibold uppercase tracking-[0.4em] text-[#8ea0b6]">Primeiro acesso à sua Pokédex Shop</div>
          <h1 class="font-pixel text-[clamp(3.6rem,9vw,7rem)] leading-[0.88] text-[#5d6a80]">Pokédex</h1>
          <p class="mt-5 max-w-[60ch] text-base leading-8 text-[#7b8b9f] md:text-lg">Uma vitrine inspirada em aplicativos de coleção, com catálogo remoto da PokeAPI, carrinho, favoritos, aprovação administrativa e preço calculado pelo poder total de cada Pokémon.</p>
          <div class="mt-7 grid gap-3 sm:grid-cols-3">
            <div class="rounded-[24px] bg-white/80 px-4 py-4 shadow-[0_14px_30px_rgba(104,122,144,0.1)]">
              <div class="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#95a4b6]">Catálogo</div>
              <div class="mt-2 font-pixel text-[2rem] leading-none text-[#5d6a80]">API</div>
              <div class="mt-2 text-sm leading-6 text-[#7b8b9f]">Busca remota com cache local para navegação fluida.</div>
            </div>
            <div class="rounded-[24px] bg-white/80 px-4 py-4 shadow-[0_14px_30px_rgba(104,122,144,0.1)]">
              <div class="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#95a4b6]">Preços</div>
              <div class="mt-2 font-pixel text-[2rem] leading-none text-[#5d6a80]">Poder</div>
              <div class="mt-2 text-sm leading-6 text-[#7b8b9f]">Cada valor usa o poder total do Pokémon dividido por 1000.</div>
            </div>
            <div class="rounded-[24px] bg-white/80 px-4 py-4 shadow-[0_14px_30px_rgba(104,122,144,0.1)]">
              <div class="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#95a4b6]">Fluxo</div>
              <div class="mt-2 font-pixel text-[2rem] leading-none text-[#5d6a80]">Conta</div>
              <div class="mt-2 text-sm leading-6 text-[#7b8b9f]">Compra, aprovação administrativa e coleção entregue ao perfil.</div>
            </div>
          </div>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button id="boot-splash-close" class="inline-flex min-h-[56px] items-center justify-center rounded-[18px] bg-[#6f8dab] px-6 py-3 font-pixel text-[2rem] text-white shadow-[0_18px_36px_rgba(111,141,171,0.26)] transition hover:-translate-y-0.5">Entrar na Pokédex</button>
            <span class="inline-flex min-h-[56px] items-center justify-center rounded-[18px] border border-[#d7e1eb] bg-white/70 px-5 py-3 text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-[#7d8ea3]">Essa apresentação aparece só no primeiro acesso</span>
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-3 xl:grid-cols-1">${posterMarkup}</div>
      </div>
    </div>
  `;

  const removeSplash = () => {
    markSplashSeen();
    splash.remove();
  };

  splash.addEventListener("click", (event) => {
    if (event.target === splash) {
      removeSplash();
    }
  });
  document.body.appendChild(splash);
  const closeButton = document.getElementById("boot-splash-close");
  if (closeButton) {
    closeButton.addEventListener("click", removeSplash, { once: true });
  }
  window.setTimeout(removeSplash, 7000);
}

createBootSplash();

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <HashRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <App />
    </HashRouter>
  </React.StrictMode>,
);
