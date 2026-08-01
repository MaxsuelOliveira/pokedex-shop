import { formatCurrency, theme } from "../lib/runtime";
import StatusBadge from "./StatusBadge";

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function OrderCard({ order }) {
  return (
    <article className="grid gap-4 rounded-[24px] border border-pokedex-line/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.78)_0%,rgba(243,236,225,0.78)_100%)] p-5 shadow-panel">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <strong className="font-pixel text-3xl">{order.id}</strong>
          <p className="text-pokedex-muted">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={order.status} />
          {order.paymentStatus ? (
            <StatusBadge status={order.paymentStatus} />
          ) : null}
        </div>
      </div>
      {order.userName ? (
        <p className="text-pokedex-muted">
          {order.userName} - {order.userEmail}
        </p>
      ) : null}
      <div className="grid gap-2">
        {order.items.map((item) => (
          <div key={`${order.id}-${item.id}`} className={theme.metricRow}>
            <span>
              {item.quantity}x {item.name}
            </span>
            <strong className="font-pixel text-2xl">
              {formatCurrency(item.quantity * item.price)}
            </strong>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1 border-t border-pokedex-line/10 pt-3 xl:flex-row xl:items-center xl:justify-between">
        <span>Total</span>
        <strong className="font-pixel text-3xl">
          {formatCurrency(order.total)}
        </strong>
      </div>
    </article>
  );
}
