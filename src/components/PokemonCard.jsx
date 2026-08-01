import {
  cx,
  formatCurrency,
  getPokemonTone,
  getRarityLabel,
  getTypeLabel,
} from "../lib/runtime";

export default function PokemonCard({
  pokemon,
  isFavorite,
  ownedQuantity,
  viewMode,
  onAdd,
  onOpen,
  onToggleFavorite,
}) {
  const isSoldOut = pokemon.stock <= 0;
  const isList = viewMode === "list";
  const tone = getPokemonTone(pokemon);
  const statItems = [
    { label: "HP", value: pokemon.stats.hp },
    { label: "ATK", value: pokemon.stats.attack },
    { label: "DEF", value: pokemon.stats.defense },
    { label: "SPA", value: pokemon.stats.specialAttack },
    { label: "SPD", value: pokemon.stats.specialDefense },
    { label: "VEL", value: pokemon.stats.speed },
  ];

  return (
    <article
      className={cx(
        "group relative overflow-hidden rounded-[34px] border border-white/80 bg-white shadow-[0_22px_46px_rgba(100,122,144,0.2)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_56px_rgba(100,122,144,0.28)]",
        isList
          ? "grid min-h-[340px] gap-0 lg:grid-cols-[300px_minmax(0,1fr)]"
          : "mx-auto flex min-h-full w-full max-w-[320px] flex-col",
      )}
    >
      <div
        className={cx(
          `stage-glow relative flex items-end justify-center overflow-hidden bg-gradient-to-b ${tone.cardTop} transition group-hover:brightness-[1.03]`,
          isList
            ? "min-h-[340px] px-7 pt-8 lg:min-h-full"
            : "min-h-[280px] px-4 pt-5 sm:min-h-[300px]",
        )}
        onClick={() => onOpen(pokemon.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen(pokemon.id);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4 text-white">
          <span className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] backdrop-blur-sm">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
          <button
            className="rounded-full border border-white/30 bg-white/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] backdrop-blur-sm transition hover:bg-white/18"
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(pokemon.id);
            }}
            type="button"
          >
            {isFavorite ? "Favorito" : "Salvar"}
          </button>
        </div>
        <div className="absolute left-4 top-16 rounded-full border border-white/24 bg-white/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
          {pokemon.region}
        </div>
        <img
          className={cx(
            "pokemon-float relative z-[1] object-contain drop-shadow-[0_22px_28px_rgba(28,38,76,0.2)] transition duration-300 group-hover:scale-[1.05]",
            isList
              ? "max-h-[292px] w-[82%] translate-y-5"
              : "max-h-[180px] w-[72%] translate-y-3 sm:max-h-[206px] sm:w-[74%]",
          )}
          src={pokemon.image}
          alt={pokemon.name}
        />
      </div>

      <div
        className={cx(
          "relative z-[1] -mt-8 flex flex-1 flex-col rounded-t-[30px] bg-white px-5 pb-5 pt-5",
          isList
            ? "lg:-ml-6 lg:mt-0 lg:rounded-l-[30px] lg:rounded-r-[0] lg:px-6 lg:pb-6 lg:pt-6"
            : "",
        )}
      >
        <div
          className={cx(
            "mb-3 grid items-start gap-3",
            isList
              ? "grid-cols-[minmax(0,1fr)_124px]"
              : "grid-cols-[minmax(0,1fr)_116px]",
          )}
        >
          <div className="min-w-0">
            <p
              className="line-clamp-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em]"
              style={{ color: tone.accent }}
            >
              {pokemon.species}
            </p>
            <h2
              className={cx(
                "mt-1 max-w-[11ch] break-words font-pixel leading-[0.88] tracking-[0.03em] text-[#5c677d]",
                isList
                  ? "text-[2.15rem] sm:text-[2.3rem]"
                  : "text-[1.9rem] sm:text-[2.15rem]",
              )}
            >
              {pokemon.name}
            </h2>
          </div>
          <div className="min-w-0 rounded-[18px] bg-[#f5f7fb] px-3 py-2 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]">
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#9ba8b8]">
              Valor
            </div>
            <div className="font-pixel text-[1.55rem] leading-none text-[#5c677d] sm:text-[1.7rem]">
              {formatCurrency(pokemon.price)}
            </div>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {pokemon.types.map((type) => (
            <div
              key={type}
              className="rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em]"
              style={{
                backgroundColor: `${tone.accent}22`,
                color: tone.accent,
              }}
            >
              {getTypeLabel(type)}
            </div>
          ))}
        </div>

        <div className="grid gap-2">
          {statItems.map((item) => (
            <div
              key={`${pokemon.id}-${item.label}`}
              className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-2"
            >
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#8d9aac]">
                {item.label}
              </span>
              <div className="h-[5px] overflow-hidden rounded-full bg-[#eef2f7]">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${tone.meter}`}
                  style={{
                    width: `${Math.min((item.value / 180) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-[24px] bg-[#f6f8fb] p-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
          <div>
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#9ba8b8]">
              Poder
            </div>
            <div className="font-pixel text-[1.65rem] leading-none text-[#5c677d]">
              {pokemon.stats.power}
            </div>
          </div>
          <div>
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#9ba8b8]">
              Estoque
            </div>
            <div className="font-pixel text-[1.65rem] leading-none text-[#5c677d]">
              {pokemon.stock}
            </div>
          </div>
          <div>
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#9ba8b8]">
              Raro
            </div>
            <div className="font-pixel text-[1.65rem] leading-none text-[#5c677d]">
              {getRarityLabel(pokemon.rarity).slice(0, 3)}
            </div>
          </div>
        </div>

        {ownedQuantity ? (
          <div className="mt-3 rounded-[18px] bg-[#fdf1e9] px-4 py-3 text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-[#dc7f5c]">
            Na coleção: {ownedQuantity}
          </div>
        ) : null}

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#8a97a9]">
          {pokemon.description}
        </p>

        <div className="mt-auto flex gap-3 pt-5">
          <button
            className="inline-flex min-h-[46px] flex-1 items-center justify-center rounded-[16px] border border-[#e6ebf1] bg-[#f7f9fc] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#6c788a] transition hover:-translate-y-0.5 hover:bg-white"
            onClick={() => onOpen(pokemon.id)}
            type="button"
          >
            Detalhe
          </button>
          <button
            className={cx(
              "inline-flex min-h-[46px] flex-1 items-center justify-center rounded-[16px] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none",
              isSoldOut ? "bg-[#c7d1dd]" : "bg-[#6c8fb5]",
            )}
            disabled={isSoldOut}
            onClick={() => onAdd(pokemon.id)}
            type="button"
          >
            {isSoldOut ? "Esgotado" : "+ Carrinho"}
          </button>
        </div>
      </div>
    </article>
  );
}
