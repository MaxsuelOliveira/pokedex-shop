import React from "react";
import DetailTile from "../components/DetailTile";
import EmptyState from "../components/EmptyState";
import FeedbackBanner from "../components/FeedbackBanner";
import OrderCard from "../components/OrderCard";
import PokemonMiniCard from "../components/PokemonMiniCard";
import SectionCard from "../components/SectionCard";
import SiteLayout from "../components/SiteLayout";
import StatusBadge from "../components/StatusBadge";
import SummaryPanel from "../components/SummaryPanel";
import { buttonClass, formatCurrency, routeHref, theme } from "../lib/runtime";
import { useStoreActions, useStoreSnapshot } from "../lib/store";
import { useAuth } from "../lib/useAuth";
import { useCatalog } from "../lib/useCatalog";

export default function AdminPage() {
  const [feedback, setFeedback] = React.useState("");
  const auth = useAuth();
  const catalog = useCatalog();
  const actions = useStoreActions();
  const adminState = useStoreSnapshot((snapshot) => ({
    pendingOrders: snapshot.pendingOrders,
    allOrders: snapshot.allOrders,
    usersSummary: snapshot.usersSummary,
  }));

  const asideStats = [
    {
      label: "Pendentes",
      value: auth.stats.pendingOrderCount,
      caption: "aguardando revisao",
    },
    {
      label: "Usuarios",
      value: auth.usersSummary.length,
      caption: "contas locais",
    },
    {
      label: "Catalogo",
      value: catalog.stats.catalogCount,
      caption: catalog.meta.catalogSource,
    },
    {
      label: "Pedidos",
      value: adminState.allOrders.length,
      caption: "historico total",
    },
  ];

  function handleApprove(orderId) {
    const result = actions.approveOrder(orderId);
    setFeedback(result.message);
  }

  function handleReject(orderId) {
    const result = actions.rejectOrder(orderId);
    setFeedback(result.message);
  }

  if (!auth.isAdmin) {
    return (
      <SiteLayout
        currentPage="admin"
        sessionInfo={auth.sessionInfo}
        catalogSource={catalog.meta.catalogSource}
        onLogout={auth.logout}
        title="Painel administrativo"
        subtitle="Apenas administradores podem revisar pedidos e consumir estoque."
        actions={
          <a className={buttonClass("solid")} href={routeHref("auth")}>
            Entrar como admin
          </a>
        }
        aside={<SummaryPanel items={asideStats} />}
      >
        <EmptyState
          title="Acesso negado"
          message="Entre com a conta admin@localhost / master123 para revisar pedidos, aprovar pagamentos e entregar Pokémons."
          action={
            <a className={buttonClass("outline")} href={routeHref("auth")}>
              Abrir autenticacao
            </a>
          }
        />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout
      currentPage="admin"
      sessionInfo={auth.sessionInfo}
      catalogSource={catalog.meta.catalogSource}
      onLogout={auth.logout}
      title="Painel administrativo"
      subtitle="As aprovações aqui capturam o saldo do cliente, consomem o estoque limitado e entregam os Pokémons à coleção do comprador."
      actions={
        <button
          className={buttonClass("solid")}
          onClick={() => catalog.refreshCatalog({ force: true })}
          type="button"
        >
          Atualizar catálogo
        </button>
      }
      aside={<SummaryPanel items={asideStats} />}
    >
      <FeedbackBanner message={feedback} />
      <FeedbackBanner message={catalog.meta.catalogError} variant="warning" />

      <div className="grid gap-3 md:grid-cols-3">
        <DetailTile
          caption="aprovacao captura saldo e consome estoque"
          label="Fila"
          value={adminState.pendingOrders.length ? "Ativa" : "Livre"}
        />
        <DetailTile
          caption="catalogo remoto com fallback local"
          label="Origem"
          value={catalog.meta.catalogSource}
        />
        <DetailTile
          caption={`${auth.usersSummary.length} usuarios monitorados`}
          label="Escala"
          value={`${adminState.allOrders.length} pedidos`}
        />
      </div>

      <div className={theme.dashboardColumns}>
        <SectionCard
          className="min-h-full"
          title="Pedidos para revisao"
          subtitle="Somente pedidos pendentes podem ser aprovados ou rejeitados."
        >
          {adminState.pendingOrders.length ? (
            <div className="grid gap-4">
              {adminState.pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="grid gap-3 rounded-[28px] border border-pokedex-accent/18 bg-[linear-gradient(145deg,rgba(255,255,255,0.78)_0%,rgba(255,213,200,0.48)_100%)] p-4 shadow-panel"
                >
                  <OrderCard order={order} />
                  <div className="flex flex-wrap gap-3">
                    <button
                      className={buttonClass("solid")}
                      onClick={() => handleApprove(order.id)}
                      type="button"
                    >
                      Aprovar
                    </button>
                    <button
                      className={buttonClass("outline")}
                      onClick={() => handleReject(order.id)}
                      type="button"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nada pendente"
              message="Todos os pedidos ja foram processados no momento."
            />
          )}
        </SectionCard>

        <SectionCard
          title="Usuarios e saldo"
          subtitle="Visao rapida das contas locais para acompanhar quem pode comprar e quanto ja recebeu."
        >
          <div className="grid gap-4">
            {auth.usersSummary.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 rounded-[24px] border border-pokedex-line/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.76)_0%,rgba(243,236,225,0.74)_100%)] p-4 shadow-panel xl:flex-row xl:items-center xl:justify-between"
              >
                <div className="grid gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="font-pixel text-3xl">{user.name}</strong>
                    <StatusBadge
                      status={user.role === "admin" ? "approved" : "cache"}
                    />
                  </div>
                  <span>
                    {user.email} - {user.role}
                  </span>
                </div>
                <div className="grid gap-1 xl:text-right">
                  <strong>{formatCurrency(user.balance)}</strong>
                  <span>{user.inventoryCount} item(ns)</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Estoque atual"
        subtitle="Cada aprovacao diminui o estoque disponivel. Quando o estoque chega a zero, o Pokemon fica esgotado na loja."
      >
        <div className={theme.miniList}>
          {catalog.catalog.map((pokemon) => (
            <PokemonMiniCard
              key={pokemon.id}
              pokemon={pokemon}
              subtitle={`${pokemon.stock} em estoque - ${formatCurrency(pokemon.price)}`}
            />
          ))}
        </div>
      </SectionCard>
    </SiteLayout>
  );
}
