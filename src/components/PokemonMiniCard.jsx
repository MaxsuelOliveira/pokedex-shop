import { theme } from "../lib/runtime";

export default function PokemonMiniCard({ pokemon, subtitle }) {
  return (
    <div
      className={`${theme.softPanel} grid grid-cols-[84px_minmax(0,1fr)] items-center gap-4 p-4 transition duration-300 hover:-translate-y-0.5`}
    >
      <img
        className={`${theme.imageFrame} pokemon-float-alt h-[84px] w-[84px] object-contain p-2 drop-shadow-[0_16px_18px_rgba(20,48,56,0.16)]`}
        src={pokemon.image}
        alt={pokemon.name}
      />
      <div className="min-w-0">
        <strong className="block max-w-[11ch] break-words font-pixel text-[1.8rem] leading-[0.92] text-[#5d6a80] sm:text-[2rem]">
          {pokemon.name}
        </strong>
        <span className="mt-2 block text-sm leading-5 text-pokedex-muted">
          {subtitle}
        </span>
      </div>
    </div>
  );
}
