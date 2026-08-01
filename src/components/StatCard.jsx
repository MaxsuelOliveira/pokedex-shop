export default function StatCard({ label, value, caption }) {
  return (
    <article className="relative overflow-hidden rounded-[24px] border border-pokedex-line/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.78)_0%,rgba(243,236,225,0.82)_60%,rgba(216,242,239,0.56)_100%)] px-4 py-4 shadow-panel">
      <span className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-pokedex-accent/15 blur-2xl" />
      <span className="relative mb-1 block font-pixel text-lg text-pokedex-muted">
        {label}
      </span>
      <strong className="relative block font-pixel text-[clamp(1.8rem,4vw,2.8rem)] leading-none">
        {value}
      </strong>
      {caption ? (
        <small className="relative mt-2 block text-sm text-pokedex-muted">
          {caption}
        </small>
      ) : null}
    </article>
  );
}
