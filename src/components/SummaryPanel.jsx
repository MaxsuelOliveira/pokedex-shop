import StatCard from "./StatCard";

export default function SummaryPanel({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
      {items.map((item) => (
        <StatCard
          key={item.label}
          caption={item.caption}
          label={item.label}
          value={item.value}
        />
      ))}
    </div>
  );
}
