import {
  cx,
  formatCurrency,
  getPokemonTone,
  getTypeLabel,
} from "../lib/runtime";

function PosterCard({ pokemon, className = "" }) {
  const tone = getPokemonTone(pokemon);

  return (
    <article
      className={cx(
        "shop-collage-card hidden w-[210px] overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_18px_40px_rgba(88,103,122,0.18)] xl:flex xl:flex-col",
        className,
      )}
    >
      <div
        className={`relative min-h-[170px] bg-gradient-to-b ${tone.cardTop}`}
      >
        <div className="absolute left-3 top-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/80">
          <span className="line-clamp-2 block max-w-[15ch] break-words">
            {pokemon.name}
          </span>
        </div>
        <img
          className="absolute bottom-4 left-1/2 max-h-[120px] w-[74%] -translate-x-1/2 object-contain object-center drop-shadow-[0_16px_22px_rgba(29,43,73,0.22)]"
          src={pokemon.image}
          alt={pokemon.name}
        />
      </div>
      <div className="grid gap-2 px-4 pb-4 pt-3">
        {[
          pokemon.stats.hp,
          pokemon.stats.attack,
          pokemon.stats.defense,
          pokemon.stats.specialAttack,
          pokemon.stats.specialDefense,
        ].map((value, index) => (
          <div
            key={`${pokemon.id}-poster-line-${index}`}
            className="h-[5px] rounded-full bg-[#edf1f6]"
          >
            <div
              className={`h-full rounded-full bg-gradient-to-r ${tone.meter}`}
              style={{ width: `${Math.min((value / 180) * 100, 100)}%` }}
            />
          </div>
        ))}
      </div>
    </article>
  );
}

export default function HeroShowcase({
  pokemons,
  spotlightPokemon,
  totalCount,
  searchValue = "",
  onSearchChange,
  onSelectPokemon,
  introTitle = "Pokédex",
  introText,
  phoneTitle = "Sua Pokédex",
  compact = false,
}) {
  const showcasePokemons = pokemons.slice(0, 9);
  const spotlight = spotlightPokemon || showcasePokemons[0] || null;

  return (
    <section
      className={cx(
        "rounded-[42px] bg-[linear-gradient(180deg,#dde5ed_0%,#d7e0ea_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.56)] md:p-8",
        compact ? "mb-6" : "mb-10",
      )}
    >
      <div className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(180deg,rgba(224,232,239,0.72)_0%,rgba(219,228,236,0.86)_100%)] p-4 md:p-6 xl:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.52),transparent_42%)]" />
        <div className="mb-8 hidden min-h-[420px] items-center justify-center xl:flex">
          <div className="shop-collage-grid">
            {showcasePokemons.map((pokemon, index) => (
              <PosterCard
                key={`hero-collage-${pokemon.id}`}
                className={`shop-collage-card-${(index % 9) + 1}`}
                pokemon={pokemon}
              />
            ))}
          </div>
        </div>

        <div className="relative grid gap-6 xl:grid-cols-[220px_minmax(320px,360px)_300px] xl:items-center xl:justify-center">
          <div className="hero-panel-enter mx-auto hidden min-h-[470px] w-full max-w-[220px] flex-col items-center justify-center rounded-[28px] bg-[#7da8c3] p-6 text-center text-white shadow-[0_24px_48px_rgba(93,122,146,0.22)] md:flex">
            <div className="mb-6 h-24 w-24 rounded-full bg-white/16 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
              <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_50%_38%,#ffffff_0%,#ffffff_38%,#2b3946_39%,#2b3946_45%,#e74f4f_46%,#e74f4f_100%)]" />
            </div>
            <div className="font-pixel text-[2.4rem] leading-none">
              {introTitle}
            </div>
            <p className="mt-4 text-sm leading-6 text-white/84">{introText}</p>
          </div>

          <div
            className="device-frame hero-panel-enter mx-auto w-full max-w-[360px]"
            style={{ animationDelay: "120ms" }}
          >
            <div className="device-screen p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="font-pixel text-[2.2rem] leading-none text-[#6a7b91]">
                  {phoneTitle}
                </div>
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#97a5b5]">
                  {totalCount} remotos
                </div>
              </div>

              {onSearchChange ? (
                <label className="mb-3 block">
                  <span className="sr-only">Buscar Pokémon</span>
                  <input
                    className="w-full rounded-[16px] border border-[#e1e8f0] bg-white px-4 py-3 text-sm text-[#627287] outline-none transition focus:border-[#8ba9c4]"
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Buscar Pokémon, tipo ou forma"
                    type="search"
                    value={searchValue}
                  />
                </label>
              ) : null}

              <div className="mb-4 flex items-center justify-between gap-2 rounded-[16px] bg-[#f4f7fb] p-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#96a2b3]">
                <span className="rounded-[12px] bg-white px-3 py-2 text-[#6d7d92] shadow-[0_8px_18px_rgba(121,137,158,0.08)]">
                  Pokémons
                </span>
                <span className="px-3 py-2">API</span>
                <span className="px-3 py-2">Detalhes</span>
              </div>

              <div className="grid gap-3">
                {showcasePokemons.slice(0, 4).map((pokemon, index) => {
                  const tone = getPokemonTone(pokemon);
                  return (
                    <button
                      key={`hero-phone-${pokemon.id}`}
                      className={`hero-panel-enter grid grid-cols-[1fr_80px] items-center gap-3 rounded-[18px] bg-gradient-to-r ${tone.cardTop} px-4 py-3 text-left text-white shadow-[0_14px_28px_rgba(111,136,170,0.16)] transition hover:-translate-y-0.5`}
                      onClick={() => onSelectPokemon?.(pokemon.id)}
                      style={{ animationDelay: `${180 + index * 70}ms` }}
                      type="button"
                    >
                      <div>
                        <div className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-white/78">
                          #{String(pokemon.id).padStart(3, "0")}
                        </div>
                        <div className="max-w-[8ch] break-words font-pixel text-[1.65rem] leading-[0.9] sm:text-[1.8rem]">
                          {pokemon.name}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {pokemon.types.slice(0, 2).map((type) => (
                            <span
                              key={`${pokemon.id}-hero-type-${type}`}
                              className="rounded-full border border-white/22 bg-white/16 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em]"
                            >
                              {getTypeLabel(type)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <img
                        className="mx-auto max-h-[84px] w-full object-contain object-center drop-shadow-[0_14px_20px_rgba(29,43,73,0.22)]"
                        src={pokemon.image}
                        alt={pokemon.name}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="hero-panel-enter mx-auto w-full max-w-[300px] rounded-[32px] bg-white p-4 shadow-[0_20px_44px_rgba(96,116,140,0.18)]"
            style={{ animationDelay: "240ms" }}
          >
            {spotlight ? (
              <div>
                <div
                  className={`relative min-h-[340px] overflow-hidden rounded-[28px] bg-gradient-to-b ${getPokemonTone(spotlight).cardTop} px-4 pt-4`}
                >
                  <div className="flex items-center justify-between text-white">
                    <button
                      className="rounded-full border border-white/24 bg-white/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em]"
                      onClick={() => onSelectPokemon?.(spotlight.id)}
                      type="button"
                    >
                      Abrir
                    </button>
                    <div className="max-w-[8ch] break-words text-right font-pixel text-[2rem] leading-[0.88] sm:text-[2.2rem]">
                      {spotlight.name}
                    </div>
                  </div>
                  <img
                    className="pokemon-float absolute bottom-6 left-1/2 max-h-[240px] w-[82%] -translate-x-1/2 object-contain object-center drop-shadow-[0_22px_26px_rgba(29,43,73,0.22)]"
                    src={spotlight.image}
                    alt={spotlight.name}
                  />
                  <div className="absolute inset-x-0 bottom-0 rounded-t-[26px] bg-white px-4 pb-4 pt-4">
                    <div className="mb-2 flex flex-wrap gap-2">
                      {spotlight.types.map((type) => (
                        <span
                          key={`spotlight-${type}`}
                          className="rounded-full px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.22em]"
                          style={{
                            backgroundColor: `${getPokemonTone(spotlight).accent}22`,
                            color: getPokemonTone(spotlight).accent,
                          }}
                        >
                          {getTypeLabel(type)}
                        </span>
                      ))}
                    </div>
                    <div className="grid gap-2">
                      {[
                        spotlight.stats.hp,
                        spotlight.stats.attack,
                        spotlight.stats.defense,
                        spotlight.stats.speed,
                      ].map((value, index) => (
                        <div
                          key={`spot-line-${index}`}
                          className="h-[5px] rounded-full bg-[#edf1f6]"
                        >
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getPokemonTone(spotlight).meter}`}
                            style={{
                              width: `${Math.min((value / 180) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 font-pixel text-[1.7rem] leading-none text-[#5f6b7f] sm:text-[1.9rem]">
                      {formatCurrency(spotlight.price)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-[420px] rounded-[28px] bg-[#f3f6fa]" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
