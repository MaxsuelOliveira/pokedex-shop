import {
  cx,
  formatCurrency,
  getPokemonTone,
  getRarityLabel,
  getTypeLabel,
} from "../lib/runtime";

export default function ProductModal({
  pokemon,
  isFavorite,
  onAdd,
  onClose,
  onToggleFavorite,
}) {
  if (!pokemon) {
    return null;
  }

  const tone = getPokemonTone(pokemon);
  const statItems = [
    { label: "HP", value: pokemon.stats.hp },
    { label: "Ataque", value: pokemon.stats.attack },
    { label: "Defesa", value: pokemon.stats.defense },
    { label: "Atq. esp.", value: pokemon.stats.specialAttack },
    { label: "Def. esp.", value: pokemon.stats.specialDefense },
    { label: "Veloc.", value: pokemon.stats.speed },
  ];

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(63,86,111,0.38)] p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className={cx(
          "modal-sheet-enter max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-auto rounded-[36px] border border-white/80 bg-[linear-gradient(180deg,rgba(252,253,255,0.98)_0%,rgba(240,245,251,0.98)_100%)] p-5 shadow-[0_34px_80px_rgba(76,96,120,0.3)] md:p-7",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex justify-between gap-3">
          <div className="rounded-full bg-[#eef3f8] px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#8b98ab]">
            #{String(pokemon.id).padStart(3, "0")} {pokemon.region}
          </div>
          <button
            className="inline-flex min-h-[44px] items-center justify-center rounded-[16px] border border-[#dde5ee] bg-white px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#6b7a8f] transition hover:-translate-y-0.5"
            onClick={onClose}
            type="button"
          >
            Fechar
          </button>
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
          <div className="rounded-[34px] bg-white p-4 shadow-[0_18px_44px_rgba(103,121,145,0.18)]">
            <div
              className={`relative min-h-[430px] overflow-hidden rounded-[30px] bg-gradient-to-b ${tone.cardTop} px-6 pt-6`}
            >
              <div className="absolute left-5 top-5 rounded-full border border-white/26 bg-white/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
                {pokemon.species}
              </div>
              <div className="absolute right-5 top-5 rounded-full border border-white/26 bg-white/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
                {getRarityLabel(pokemon.rarity)}
              </div>
              <img
                className="pokemon-float-alt absolute bottom-8 left-1/2 z-[1] max-h-[320px] w-[min(88%,320px)] -translate-x-1/2 object-contain object-center drop-shadow-[0_28px_30px_rgba(29,43,73,0.22)]"
                src={pokemon.image}
                alt={pokemon.name}
              />
              <div className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white px-5 pb-6 pt-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-pixel text-[2.7rem] leading-none text-[#5a6579]">
                      {pokemon.name}
                    </h2>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#97a5b6]">
                      Poder total {pokemon.stats.power}
                    </p>
                  </div>
                  <button
                    className="rounded-full border border-[#e3ebf3] bg-[#f7f9fc] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#7c8ca2]"
                    onClick={() => onToggleFavorite(pokemon.id)}
                    type="button"
                  >
                    {isFavorite ? "Favorito" : "Salvar"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
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
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[30px] bg-white p-6 shadow-[0_18px_44px_rgba(103,121,145,0.14)]">
              <p className="mb-4 text-sm leading-7 text-[#8292a6]">
                {pokemon.description}
              </p>
              <div className="grid gap-3">
                {statItems.map((item) => (
                  <div
                    key={`${pokemon.id}-${item.label}`}
                    className="grid grid-cols-[96px_minmax(0,1fr)_44px] items-center gap-3"
                  >
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#8e9bad]">
                      {item.label}
                    </span>
                    <div className="h-[7px] overflow-hidden rounded-full bg-[#edf1f6]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${tone.meter}`}
                        style={{
                          width: `${Math.min((item.value / 180) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-[#7a899e]">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] bg-white p-4 text-center shadow-[0_16px_34px_rgba(103,121,145,0.12)]">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9aa7b7]">
                  Valor
                </div>
                <div className="mt-2 font-pixel text-[2.4rem] leading-none text-[#5a6579]">
                  {formatCurrency(pokemon.price)}
                </div>
              </div>
              <div className="rounded-[24px] bg-white p-4 text-center shadow-[0_16px_34px_rgba(103,121,145,0.12)]">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9aa7b7]">
                  Estoque
                </div>
                <div className="mt-2 font-pixel text-[2.4rem] leading-none text-[#5a6579]">
                  {pokemon.stock}
                </div>
              </div>
              <div className="rounded-[24px] bg-white p-4 text-center shadow-[0_16px_34px_rgba(103,121,145,0.12)]">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9aa7b7]">
                  Regiao
                </div>
                <div className="mt-2 font-pixel text-[2rem] leading-none text-[#5a6579]">
                  {pokemon.region}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex min-h-[50px] items-center justify-center rounded-[18px] border border-[#dbe5ef] bg-white px-5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#6a7a90] transition hover:-translate-y-0.5"
                onClick={() => onToggleFavorite(pokemon.id)}
                type="button"
              >
                {isFavorite ? "Remover favorito" : "Favoritar"}
              </button>
              <button
                className="inline-flex min-h-[50px] items-center justify-center rounded-[18px] bg-[#6c8fb5] px-5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white transition hover:-translate-y-0.5"
                onClick={() => onAdd(pokemon.id)}
                type="button"
              >
                Comprar agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
