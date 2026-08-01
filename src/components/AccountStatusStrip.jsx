export default function AccountStatusStrip({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="grid gap-3 rounded-[24px] border border-[#dce6f0] bg-[linear-gradient(145deg,rgba(255,255,255,0.84)_0%,rgba(240,246,251,0.94)_100%)] p-4 shadow-[0_18px_34px_rgba(104,122,144,0.08)] sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="min-w-0 rounded-[20px] bg-white/75 px-4 py-3"
        >
          <div className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#98a6b7]">
            {item.label}
          </div>
          <div className="mt-1 truncate font-pixel text-[1.9rem] leading-none text-[#5e6b80]">
            {item.value}
          </div>
          {item.caption ? (
            <div className="mt-2 text-sm leading-5 text-[#8190a3]">
              {item.caption}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
