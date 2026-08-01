import { cx, getStatusLabel } from "../lib/runtime";

function getStatusClasses(status) {
  const classes = {
    approved: "border-[#84c89b]/35 bg-[#e1f6e4] text-[#2d6a45]",
    awaiting_admin: "border-[#f0b55c]/35 bg-[#ffeccf] text-[#7d5a14]",
    awaiting_approval: "border-[#f0b55c]/35 bg-[#ffeccf] text-[#7d5a14]",
    cache: "border-pokedex-line/15 bg-white/65 text-pokedex-text",
    "cache-stale": "border-[#f0b55c]/35 bg-[#fff3dc] text-[#7d5a14]",
    cancelled: "border-[#ef8b6c]/35 bg-[#ffe2d8] text-[#8a432f]",
    captured: "border-[#84c89b]/35 bg-[#e1f6e4] text-[#2d6a45]",
    denied: "border-[#ef8b6c]/35 bg-[#ffe2d8] text-[#8a432f]",
    delivered: "border-[#84c89b]/35 bg-[#e1f6e4] text-[#2d6a45]",
    fallback: "border-[#ef8b6c]/35 bg-[#ffe2d8] text-[#8a432f]",
    pending_review:
      "border-pokedex-accent/30 bg-pokedex-accentSoft/65 text-[#8a432f]",
    rejected: "border-[#ef8b6c]/35 bg-[#ffe2d8] text-[#8a432f]",
    remote: "border-[#70b7cf]/35 bg-[#dcf4fb] text-[#21596d]",
  };

  return (
    classes[status] ||
    "border-pokedex-line/15 bg-pokedex-cardSoft text-pokedex-text"
  );
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={cx(
        "inline-flex items-center justify-center rounded-full border px-3 py-1 font-pixel text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]",
        getStatusClasses(status),
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}
