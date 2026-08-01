import React from "react";
import AccountStatusStrip from "../components/AccountStatusStrip";
import EmptyState from "../components/EmptyState";
import FeedbackBanner from "../components/FeedbackBanner";
import OrderCard from "../components/OrderCard";
import PokemonMiniCard from "../components/PokemonMiniCard";
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
import { useStoreSnapshot } from "../lib/store";
import { useAuth } from "../lib/useAuth";
import { useCatalog } from "../lib/useCatalog";

export default function ProfilePage() {
  const [feedback, setFeedback] = React.useState("");
  const auth = useAuth();
  const catalog = useCatalog();
  const orders = useStoreSnapshot((snapshot) => snapshot.orders);
  const [formState, setFormState] = React.useState(auth.profile);

  React.useEffect(() => {
    setFormState(auth.profile);
  }, [
    auth.profile.name,
    auth.profile.email,
    auth.profile.city,
    auth.profile.favoriteType,
    auth.profile.balance,
    auth.profile.bio,
  ]);

  const asideStats = [
    {
      label: "Saldo",
      value: formatCurrency(auth.profile.balance),
      caption: "carteira local",
    },
    {
      label: "Favoritos",
      value: auth.stats.favoritesCount,
      caption: "na lista salva",
    },
    {
      label: "Pedidos",
      value: auth.stats.orderCount,
      caption: "histórico real",
    },
    {
      label: "Coleção",
      value: auth.stats.inventoryCount,
      caption: "Pokémons entregues",
    },
  ];

  const profileStrip = [
    {
      label: "Conta",
      value: auth.currentUser?.role === "admin" ? "Admin" : "Cliente",
      caption: auth.currentUser?.email,
    },
    {
      label: "Cidade",
      value: auth.profile.city || "Sem cidade",
      caption: "dados do treinador",
    },
    {
      label: "Favorito",
      value: auth.profile.favoriteType || "Normal",
      caption: "tipo principal",
    },
  ];

  function updateField(event) {
    const { name, value } = event.target;
    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = auth.updateProfile(formState);
    setFeedback(result.message);
  }

  return (
    <SiteLayout
      currentPage="profile"
      sessionInfo={auth.sessionInfo}
      catalogSource={auth.sessionInfo.meta?.catalogSource}
      onLogout={auth.logout}
      title="Perfil do treinador"
      subtitle="Edite seus dados em um só lugar e acompanhe favoritos, pedidos e coleção sem repetir o mesmo contexto em vários blocos."
      actions={
        <>
          <a className={buttonClass("outline")} href={routeHref("shop")}>
            Voltar para a loja
          </a>
          <a
            className={buttonClass("solid")}
            href={auth.isAuthenticated ? routeHref("cart") : routeHref("auth")}
          >
            {auth.isAuthenticated ? "Abrir carrinho" : "Entrar"}
          </a>
        </>
      }
      aside={<SummaryPanel items={asideStats} />}
    >
      {!auth.isAuthenticated ? (
        <EmptyState
          title="Nenhuma sessao ativa"
          message="Faça login ou cadastre uma conta para editar dados, enviar pedidos e receber Pokémons aprovados."
          action={
            <a className={buttonClass("solid")} href={routeHref("auth")}>
              Abrir autenticacao
            </a>
          }
        />
      ) : (
        <>
          <div className={theme.dashboardColumns}>
            <SectionCard
              className="min-h-full"
              title="Dados do usuário"
              subtitle="As alterações abaixo ficam salvas no perfil autenticado e alimentam o restante da experiência."
            >
              <div className="grid gap-5">
                <AccountStatusStrip items={profileStrip} />

                <form className="grid gap-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className={theme.fieldGroup}>
                      <span className={theme.fieldLabel}>Nome</span>
                      <input
                        className={theme.fieldControl}
                        name="name"
                        onChange={updateField}
                        placeholder="Seu nome"
                        type="text"
                        value={formState.name}
                      />
                    </label>
                    <label className={theme.fieldGroup}>
                      <span className={theme.fieldLabel}>E-mail</span>
                      <input
                        className={theme.fieldControl}
                        name="email"
                        onChange={updateField}
                        placeholder="seuemail@exemplo.com"
                        type="email"
                        value={formState.email}
                      />
                    </label>
                    <label className={theme.fieldGroup}>
                      <span className={theme.fieldLabel}>Cidade</span>
                      <input
                        className={theme.fieldControl}
                        name="city"
                        onChange={updateField}
                        placeholder="Sua cidade"
                        type="text"
                        value={formState.city}
                      />
                    </label>
                    <label className={theme.fieldGroup}>
                      <span className={theme.fieldLabel}>Tipo favorito</span>
                      <input
                        className={theme.fieldControl}
                        name="favoriteType"
                        onChange={updateField}
                        placeholder="planta, psíquico, fantasma..."
                        type="text"
                        value={formState.favoriteType}
                      />
                    </label>
                  </div>
                  <label className={theme.fieldGroup}>
                    <span className={theme.fieldLabel}>Saldo</span>
                    <input
                      className={theme.fieldControl}
                      min="0"
                      name="balance"
                      onChange={updateField}
                      step="0.01"
                      type="number"
                      value={formState.balance}
                    />
                    <span className={theme.fieldHint}>
                      Use esse campo para simular diferentes limites de compra.
                    </span>
                  </label>
                  <label className={theme.fieldGroup}>
                    <span className={theme.fieldLabel}>Bio</span>
                    <textarea
                      className={cx(theme.fieldControl, theme.textarea)}
                      name="bio"
                      onChange={updateField}
                      placeholder="Descreva sua colecao, estilo de jogo ou objetivos na loja."
                      value={formState.bio}
                    />
                    <span className={theme.fieldHint}>
                      Esse resumo ajuda a deixar o perfil com mais
                      personalidade.
                    </span>
                  </label>
                  <div className="flex justify-end">
                    <button className={buttonClass("solid")} type="submit">
                      Salvar perfil
                    </button>
                  </div>
                </form>
              </div>

              <FeedbackBanner message={feedback} />
            </SectionCard>

            <SectionCard
              title="Wishlist"
              subtitle="Os favoritos marcados na loja aparecem aqui automaticamente."
            >
              {catalog.favoriteItems.length ? (
                <div className={theme.miniList}>
                  {catalog.favoriteItems.map((pokemon) => (
                    <PokemonMiniCard
                      key={pokemon.id}
                      pokemon={pokemon}
                      subtitle={formatCurrency(pokemon.price)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Wishlist vazia"
                  message="Favorite produtos na loja para popular esta lista."
                  action={
                    <a
                      className={buttonClass("outline")}
                      href={routeHref("shop")}
                    >
                      Escolher favoritos
                    </a>
                  }
                />
              )}
            </SectionCard>
          </div>

          <SectionCard
            title="Colecao aprovada"
            subtitle="Todo pedido aprovado entrega o Pokémon aqui, respeitando o estoque limitado de cada item."
          >
            {catalog.ownedPokemons.length ? (
              <div className={theme.miniList}>
                {catalog.ownedPokemons.map((pokemon) => (
                  <PokemonMiniCard
                    key={`${pokemon.id}-${pokemon.orderId}`}
                    pokemon={pokemon}
                    subtitle={`${pokemon.quantity} unidade(s)`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Colecao vazia"
                message="A colecao sera preenchida assim que um pedido seu for aprovado pelo administrador."
              />
            )}
          </SectionCard>

          <SectionCard
            title="Historico de pedidos"
            subtitle="Os pedidos mostram status reais de aprovação e pagamento. Somente pedidos aprovados entregam Pokémons e descontam saldo."
          >
            {orders.length ? (
              <div className={theme.orderGrid}>
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhum pedido enviado"
                message="Complete um checkout para validar o fluxo fim a fim com aprovacao administrativa."
                action={
                  <a className={buttonClass("solid")} href={routeHref("cart")}>
                    Abrir carrinho
                  </a>
                }
              />
            )}
          </SectionCard>
        </>
      )}
    </SiteLayout>
  );
}
