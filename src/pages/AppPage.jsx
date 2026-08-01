import React from "react";
import EmptyState from "../components/EmptyState";
import FeedbackBanner from "../components/FeedbackBanner";
import HeroShowcase from "../components/HeroShowcase";
import PokemonCard from "../components/PokemonCard";
import PokemonMiniCard from "../components/PokemonMiniCard";
import ProductModal from "../components/ProductModal";
import SectionCard from "../components/SectionCard";
import SiteLayout from "../components/SiteLayout";
import SummaryPanel from "../components/SummaryPanel";
import { buttonClass, formatCurrency, routeHref, theme } from "../lib/runtime";
import { useAuth } from "../lib/useAuth";
import { useCart } from "../lib/useCart";
import { useCatalog } from "../lib/useCatalog";

export default function AppPage() {
  const [selectedPokemonId, setSelectedPokemonId] = React.useState(null);
  const [feedback, setFeedback] = React.useState("");
  const auth = useAuth();
  const cart = useCart();
  const catalog = useCatalog();
  const selectedPokemon =
    catalog.catalog.find((pokemon) => pokemon.id === selectedPokemonId) || null;
  const ownedQuantities = catalog.ownedPokemons.reduce((accumulator, item) => {
    accumulator[item.id] = item.quantity;
    return accumulator;
  }, {});

  const heroStats = [
    {
      label: "Catalogo",
      value: catalog.stats.catalogCount,
      caption: catalog.meta.catalogLoading
        ? "sincronizando API"
        : "catalogo hibrido",
    },
    { label: "Carrinho", value: cart.stats.cartCount, caption: "itens ativos" },
    {
      label: "Saldo",
      value: formatCurrency(auth.stats.balance),
      caption: auth.isAuthenticated ? "saldo do usuario" : "faca login",
    },
    {
      label: "Pedidos",
      value: auth.stats.orderCount,
      caption: auth.isAdmin
        ? `${auth.stats.pendingOrderCount} pendentes`
        : "historico do usuario",
    },
  ];

  function handleAddToCart(id) {
    const result = cart.addToCart(id);
    setFeedback(result.message);
  }

  return (
    <SiteLayout
      currentPage="app"
      sessionInfo={auth.sessionInfo}
      catalogSource={catalog.meta.catalogSource}
      onLogout={auth.logout}
      title="A sua loja de Pokemons"
      subtitle="Um exemplo de marketplace local-first com catálogo remoto, carrinho local e checkout com aprovação administrativa."
      actions={
        <>
          <a className={buttonClass("solid")} href={routeHref("shop")}>
            Explorar loja
          </a>
          <a
            className={buttonClass("outline")}
            href={
              auth.isAuthenticated ? routeHref("profile") : routeHref("auth")
            }
          >
            {auth.isAuthenticated ? "Editar perfil" : "Entrar / cadastrar"}
          </a>
        </>
      }
      aside={<SummaryPanel items={heroStats} />}
    >
      <FeedbackBanner message={feedback} />
      <FeedbackBanner message={catalog.meta.catalogError} variant="warning" />

      <div className={theme.stack}>
        <HeroShowcase
          introText="Sua Pokédex reúne catálogo remoto, favoritos, coleção entregue e fluxos administrativos em uma interface inspirada em apps de coleção."
          introTitle="Pokédex"
          onSelectPokemon={setSelectedPokemonId}
          phoneTitle="App da Pokédex"
          pokemons={
            catalog.featuredCatalog.length
              ? catalog.featuredCatalog
              : catalog.catalog
          }
          spotlightPokemon={
            selectedPokemon ||
            catalog.featuredCatalog[0] ||
            catalog.catalog[0] ||
            null
          }
          totalCount={catalog.stats.catalogCount}
        />

        <SectionCard
          title="Vitrine principal"
          subtitle="Os destaques usam dados remotos com cache local."
          actions={
            <button
              className={buttonClass("outline")}
              onClick={() => catalog.refreshCatalog({ force: true })}
              type="button"
            >
              Atualizar catálogo
            </button>
          }
        >
          {catalog.featuredCatalog.length ? (
            <div className={theme.cardGrid}>
              {catalog.featuredCatalog.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  isFavorite={catalog.favorites.includes(pokemon.id)}
                  onAdd={handleAddToCart}
                  onOpen={setSelectedPokemonId}
                  onToggleFavorite={catalog.toggleFavorite}
                  ownedQuantity={ownedQuantities[pokemon.id] || 0}
                  pokemon={pokemon}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Carregando catalogo"
              message="Os produtos remotos estão sendo sincronizados neste momento."
            />
          )}
        </SectionCard>

        <div className={theme.dashboardColumns}>
          <SectionCard
            className="min-h-full"
            title="Operacao hibrida"
            subtitle="A experiencia segue local-first, mas o catalogo nasce de chamadas reais de API e cai para cache ou fallback quando necessario."
          >
            <div className={theme.featureList}>
              <article>
                <strong>Catalogo remoto com cache</strong>
                <p>
                  <code>assets/js/core/services.js</code> chama a PokeAPI,
                  normaliza os dados e reutiliza o cache local por TTL para
                  evitar fetch desnecessario.
                </p>
              </article>
              <article>
                <strong>Pedidos com aprovacao</strong>
                <p>
                  Checkout cria pedidos pendentes. O administrador aprova,
                  captura saldo, consome estoque e entrega os Pokemons ao
                  comprador.
                </p>
              </article>
              <article>
                <strong>Autenticacao com papeis</strong>
                <p>
                  Ha usuarios customer e admin, sessao local e paginas dedicadas
                  para login e governanca do marketplace.
                </p>
              </article>
            </div>
          </SectionCard>

          <SectionCard
            title={auth.isAuthenticated ? "Minha colecao" : "Acesso rapido"}
            subtitle={
              auth.isAuthenticated
                ? "Pokemons entregues apos aprovacao aparecem aqui e tambem no perfil."
                : "Entre com uma conta para comprar, acompanhar pedidos e receber seus Pokemons."
            }
          >
            {auth.isAuthenticated && catalog.ownedPokemons.length ? (
              <div className={theme.miniList}>
                {catalog.ownedPokemons.slice(0, 5).map((pokemon) => (
                  <PokemonMiniCard
                    key={`${pokemon.id}-${pokemon.orderId}`}
                    pokemon={pokemon}
                    subtitle={`${pokemon.quantity} unidade(s)`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title={
                  auth.isAuthenticated
                    ? "Nenhum Pokemon entregue ainda"
                    : "Sessao nao autenticada"
                }
                message={
                  auth.isAuthenticated
                    ? "Finalize um pedido e peca aprovacao administrativa para receber os Pokemons na colecao."
                    : "Use as credenciais locais ou crie uma conta para comecar a comprar."
                }
                action={
                  <a
                    className={buttonClass("outline")}
                    href={
                      auth.isAuthenticated
                        ? routeHref("shop")
                        : routeHref("auth")
                    }
                  >
                    {auth.isAuthenticated
                      ? "Ir para a loja"
                      : "Abrir autenticacao"}
                  </a>
                }
              />
            )}
          </SectionCard>
        </div>
      </div>

      <ProductModal
        isFavorite={
          selectedPokemon
            ? catalog.favorites.includes(selectedPokemon.id)
            : false
        }
        onAdd={handleAddToCart}
        onClose={() => setSelectedPokemonId(null)}
        onToggleFavorite={catalog.toggleFavorite}
        pokemon={selectedPokemon}
      />
    </SiteLayout>
  );
}
