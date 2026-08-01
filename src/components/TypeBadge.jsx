import { capitalize, cx } from "../lib/runtime";

function getTypeClasses(type) {
  const classes = {
    fire: "border-[#ef8b6c]/40 bg-[#ffe2d8] text-[#8a432f]",
    electric: "border-[#f0b55c]/40 bg-[#ffeccf] text-[#7d5a14]",
    water: "border-[#70b7cf]/35 bg-[#dcf4fb] text-[#21596d]",
    ice: "border-[#8ecedf]/35 bg-[#e4f9ff] text-[#28596b]",
    psychic: "border-[#b7b2ec]/35 bg-[#ebe8ff] text-[#4c4688]",
    grass: "border-[#84c89b]/35 bg-[#e1f6e4] text-[#2d6a45]",
    bug: "border-[#84c89b]/35 bg-[#e1f6e4] text-[#2d6a45]",
    poison: "border-[#b99dd9]/35 bg-[#f0e6ff] text-[#5c3d82]",
    fairy: "border-[#ebb3c7]/35 bg-[#ffe9f1] text-[#8a4561]",
    ghost: "border-[#afaddd]/35 bg-[#eeedff] text-[#4f4b7e]",
    normal: "border-pokedex-line/15 bg-white/70 text-pokedex-text",
  };

  return (
    classes[type] ||
    "border-pokedex-line/15 bg-pokedex-cardSoft text-pokedex-text"
  );
}

export default function TypeBadge({ type }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-3 py-1 font-pixel text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]",
        getTypeClasses(type),
      )}
    >
      {capitalize(type)}
    </span>
  );
}
