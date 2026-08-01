import React from "react";
import CartRow from "../components/CartRow";
import EmptyState from "../components/EmptyState";
import FeedbackBanner from "../components/FeedbackBanner";
import SectionCard from "../components/SectionCard";
import SiteLayout from "../components/SiteLayout";
import SummaryPanel from "../components/SummaryPanel";
import {
  buttonClass,
  cx,
  formatCurrency,
  routeHref,
  theme,
} from "../lib/runtime";
import { useAuth } from "../lib/useAuth";
import { useCart } from "../lib/useCart";

export default function CartPage() {
  const [feedback, setFeedback] = React.useState("");
  const auth = useAuth();
  const cart = useCart();

  const asideStats = [
    {
      label: "Itens",
      value: cart.cartTotals.itemsCount,
      caption: "no carrinho",
    },
    {
      label: "Subtotal",
      value: formatCurrency(cart.cartTotals.subtotal),
      caption: "antes do frete",
    },
    {
      label: "Frete",
      value: formatCurrency(cart.cartTotals.shipping),
      caption: cart.cartTotals.shipping ? "padrao" : "gratis",
    },
    {
      label: "Total",
      value: formatCurrency(cart.cartTotals.total),
      caption: "aguarda aprovacao",
    },
  ];

  function handleCheckout() {
    const result = cart.checkout();
    setFeedback(result.message);
  }

  return (
    <SiteLayout
      currentPage="cart"
      sessionInfo={auth.sessionInfo}
      catalogSource={auth.sessionInfo.meta?.catalogSource}
      onLogout={auth.logout}
      title="Bolsa e checkout local"
      subtitle="O carrinho continua local ao usuário logado, mas o checkout agora gera pedidos pendentes que precisam de aprovação administrativa."
      actions={
        <>
          <a className={buttonClass("outline")} href={routeHref("shop")}>
            Continuar comprando
          </a>
          <button
            className={buttonClass("solid")}
            onClick={handleCheckout}
            type="button"
          >
            Finalizar pedido
          </button>
        </>
      }
      aside={<SummaryPanel items={asideStats} />}
    >
      {!auth.isAuthenticated ? (
        <div className={theme.warning}>
          Voce esta navegando como visitante. Faca login para submeter pedidos
          para aprovação.
        </div>
      ) : null}
      <div className={theme.cartColumns}>
        <SectionCard
          className="min-h-full"
          title="Itens selecionados"
          subtitle="Use os controles abaixo para ajustar o carrinho antes de enviar o pedido para revisão administrativa."
          actions={
            cart.cartDetailed.length ? (
              <button
                className={buttonClass("outline")}
                onClick={cart.clearCart}
                type="button"
              >
                Limpar carrinho
              </button>
            ) : null
          }
        >
          <FeedbackBanner message={feedback} />
          {cart.cartDetailed.length ? (
            <div className="grid gap-4">
              {cart.cartDetailed.map((item) => (
                <CartRow
                  key={item.id}
                  item={item}
                  onDecrease={cart.decreaseQuantity}
                  onIncrease={(id) => {
                    const result = cart.addToCart(id);
                    setFeedback(result.message);
                  }}
                  onRemove={cart.removeFromCart}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Seu carrinho esta vazio"
              message="Adicione alguns Pokemons na loja para simular um checkout completo com aprovacao administrativa."
              action={
                <a className={buttonClass("solid")} href={routeHref("shop")}>
                  Abrir loja
                </a>
              }
            />
          )}
        </SectionCard>

        <SectionCard
          title="Resumo financeiro"
          subtitle="O saldo só é capturado quando um administrador aprova o pedido. Nesse momento, o estoque é consumido e o Pokémon entra na coleção do usuário."
        >
          <div className="grid gap-3">
            <div className={theme.metricRow}>
              <span>Subtotal</span>
              <strong>{formatCurrency(cart.cartTotals.subtotal)}</strong>
            </div>
            <div className={theme.metricRow}>
              <span>Frete</span>
              <strong>{formatCurrency(cart.cartTotals.shipping)}</strong>
            </div>
            <div className={theme.metricRowAccent}>
              <span>Total</span>
              <strong>{formatCurrency(cart.cartTotals.total)}</strong>
            </div>
            <div className={theme.metricRow}>
              <span>Saldo atual</span>
              <strong>{formatCurrency(auth.profile.balance)}</strong>
            </div>
            <div className={theme.metricRow}>
              <span>Status do proximo pedido</span>
              <strong>Pendente</strong>
            </div>
            <button
              className={cx(buttonClass("solid"), "w-full")}
              onClick={handleCheckout}
              type="button"
            >
              Fechar pedido
            </button>
          </div>
        </SectionCard>
      </div>
    </SiteLayout>
  );
}
