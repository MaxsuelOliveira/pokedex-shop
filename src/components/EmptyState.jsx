import { theme } from "../lib/runtime";

export default function EmptyState({ title, message, action }) {
  return (
    <div className={`${theme.softPanel} px-6 py-8 text-center`}>
      <h3 className="font-pixel text-[2.8rem] leading-none">{title}</h3>
      <p className="mx-auto mt-3 max-w-[48ch] text-pokedex-muted">{message}</p>
      {action ? (
        <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>
      ) : null}
    </div>
  );
}
