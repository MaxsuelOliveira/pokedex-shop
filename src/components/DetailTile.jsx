import { cx, theme } from "../lib/runtime";

export default function DetailTile({ label, value, caption, className }) {
  return (
    <article className={cx(theme.detailTile, className)}>
      <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-pokedex-greenDark">
        {label}
      </span>
      <strong className="mt-2 block font-pixel text-[2rem] leading-none">
        {value}
      </strong>
      {caption ? (
        <p className="mt-2 text-sm leading-6 text-pokedex-muted">{caption}</p>
      ) : null}
    </article>
  );
}
