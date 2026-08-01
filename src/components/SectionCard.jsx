import { cx, theme } from "../lib/runtime";

export default function SectionCard({
  overline = "Pokedex Market",
  title,
  subtitle,
  actions,
  className,
  children,
}) {
  return (
    <section className={cx(theme.panel, "p-6", className)}>
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <span className={theme.sectionOverline}>{overline}</span>
          <h2 className="font-pixel text-[clamp(2rem,3vw,2.9rem)] leading-[0.92] tracking-[0.1em]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-2 max-w-[62ch] text-pokedex-muted">{subtitle}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap gap-3 xl:justify-end">{actions}</div>
        ) : null}
      </div>
      {children}
    </section>
  );
}
