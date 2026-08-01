import { useEffect } from "react";
import { getPokemonTone, getTypeLabel } from "../lib/runtime";

export default function SplashScreen({ pokemons, onClose }) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, 2200);
    return () => window.clearTimeout(timeoutId);
  }, [onClose]);

  const items = (pokemons.length ? pokemons : window.PokedexSeed || []).slice(
    0,
    3,
  );

  return (
    <div className="splash-overlay fixed inset-0 z-[80] grid place-items-center px-4 py-6">
      <div className="splash-panel w-full max-w-5xl overflow-hidden rounded-[40px] border border-white/80 bg-[linear-gradient(180deg,rgba(252,253,255,0.97)_0%,rgba(238,243,248,0.97)_100%)] p-6 shadow-[0_34px_90px_rgba(71,93,120,0.24)] md:p-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] xl:items-center">
          <div>
            <div className="mb-3 text-[0.76rem] font-semibold uppercase tracking-[0.4em] text-[#8ea0b6]">
              Bem-vindo à sua Pokédex Shop
            </div>
            <h1 className="font-pixel text-[clamp(3.2rem,8vw,6rem)] leading-[0.9] text-[#5d6a80]">
              Pokédex
            </h1>
            <p className="mt-4 max-w-[58ch] text-base leading-8 text-[#7b8b9f] md:text-lg">
              Uma vitrine inspirada em aplicativos de coleção, com catálogo
              remoto da PokeAPI, carrinho, favoritos, aprovação administrativa e
              preço calculado pelo poder total de cada Pokémon.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#7f90a5]">
              <span className="rounded-full bg-[#edf3f9] px-4 py-2">
                Catálogo remoto
              </span>
              <span className="rounded-full bg-[#edf3f9] px-4 py-2">
                Tudo em português
              </span>
              <span className="rounded-full bg-[#edf3f9] px-4 py-2">
                Experiência local-first
              </span>
            </div>
            <button
              className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-[18px] bg-[#6f8dab] px-6 py-3 font-pixel text-[2rem] text-white shadow-[0_18px_36px_rgba(111,141,171,0.26)] transition hover:-translate-y-0.5"
              onClick={onClose}
              type="button"
            >
              Entrar na Pokédex
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {items.map((pokemon, index) => {
              const tone = getPokemonTone(pokemon);
              return (
                <article
                  key={`splash-${pokemon.id}`}
                  className="hero-panel-enter overflow-hidden rounded-[28px] bg-white shadow-[0_18px_40px_rgba(88,103,122,0.16)]"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div
                    className={`relative min-h-[180px] bg-gradient-to-b ${tone.cardTop} px-4 pt-4`}
                  >
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/82">
                      #{String(pokemon.id).padStart(3, "0")}
                    </div>
                    <img
                      className="absolute bottom-4 right-4 max-h-[132px] w-[46%] object-contain object-center drop-shadow-[0_16px_20px_rgba(29,43,73,0.22)]"
                      src={pokemon.image}
                      alt={pokemon.name}
                    />
                  </div>
                  <div className="grid gap-2 p-4">
                    <div className="font-pixel text-[2rem] leading-none text-[#5d6a80]">
                      {pokemon.name}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.types.slice(0, 2).map((type) => (
                        <span
                          key={`${pokemon.id}-splash-${type}`}
                          className="rounded-full px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.22em]"
                          style={{
                            backgroundColor: `${tone.accent}20`,
                            color: tone.accent,
                          }}
                        >
                          {getTypeLabel(type)}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
