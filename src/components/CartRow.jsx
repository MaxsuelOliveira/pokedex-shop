import { buttonClass, formatCurrency, theme } from "../lib/runtime";
import TypeBadge from "./TypeBadge";

export default function CartRow({ item, onDecrease, onIncrease, onRemove }) {
  return (
    <article className="grid gap-4 rounded-[24px] border border-pokedex-line/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.78)_0%,rgba(243,236,225,0.78)_100%)] p-4 shadow-panel xl:grid-cols-[108px_minmax(0,1fr)_auto_auto_auto] xl:items-center">
      <img
        className={`${theme.imageFrame} h-24 w-24 object-contain p-2`}
        src={item.image}
        alt={item.name}
      />
      <div className="grid gap-2">
        <h3 className="font-pixel text-4xl">{item.name}</h3>
        <p className="text-pokedex-muted">{item.species}</p>
        <div className="flex flex-wrap gap-2">
          {item.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] border border-pokedex-line/15 bg-white/70 font-pixel text-3xl transition hover:-translate-y-0.5 hover:bg-white"
          onClick={() => onDecrease(item.id)}
          type="button"
        >
          -
        </button>
        <span className="font-pixel text-3xl">{item.quantity}</span>
        <button
          className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] border border-pokedex-line/15 bg-white/70 font-pixel text-3xl transition hover:-translate-y-0.5 hover:bg-white"
          onClick={() => onIncrease(item.id)}
          type="button"
        >
          +
        </button>
      </div>
      <strong className="font-pixel text-[2rem]">
        {formatCurrency(item.lineTotal)}
      </strong>
      <button
        className={buttonClass("ghost")}
        onClick={() => onRemove(item.id)}
        type="button"
      >
        Remover
      </button>
    </article>
  );
}
