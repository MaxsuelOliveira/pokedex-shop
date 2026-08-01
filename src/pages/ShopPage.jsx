import React from "react";
import EmptyState from "../components/EmptyState";
import FeedbackBanner from "../components/FeedbackBanner";
import PokemonCard from "../components/PokemonCard";
import ProductModal from "../components/ProductModal";
import { buttonClass, cx, getTypeLabel, routeHref } from "../lib/runtime";
import { useAuth } from "../lib/useAuth";
import { useCart } from "../lib/useCart";
import { useCatalog } from "../lib/useCatalog";

function CatalogSkeleton({ viewMode, count = 6 }) {
  const isList = viewMode === "list";

  return (
    <div
      className={
        isList
          ? "grid gap-5"
          : "grid justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3"
      }
    >
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={`skeleton-${index}`}
          className={cx(
            "w-full overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_18px_40px_rgba(88,103,122,0.14)]",
            isList
              ? "min-h-[340px] lg:grid lg:grid-cols-[300px_minmax(0,1fr)]"
              : "max-w-[320px]",
          )}
        >
          <div className="animate-pulse">
            <div className="min-h-[280px] bg-[linear-gradient(180deg,#9bc1dd_0%,#b9d6e7_100%)]" />
            <div className="-mt-8 grid gap-4 rounded-t-[30px] bg-white px-5 pb-5 pt-5">
              <div className="flex items-start justify-between gap-3">
                <div className="grid gap-2">
                  <div className="h-3 w-24 rounded-full bg-[#edf1f6]" />
                  <div className="h-8 w-36 rounded-full bg-[#eef3f8]" />
                </div>
                <div className="h-12 w-24 rounded-[16px] bg-[#eef3f8]" />
              </div>
              <div className="flex gap-2">
                <div className="h-7 w-20 rounded-full bg-[#eef3f8]" />
                <div className="h-7 w-20 rounded-full bg-[#eef3f8]" />
              </div>
              <div className="grid gap-2">
                <div className="h-[5px] rounded-full bg-[#eef3f8]" />
                <div className="h-[5px] rounded-full bg-[#eef3f8]" />
                <div className="h-[5px] rounded-full bg-[#eef3f8]" />
                <div className="h-[5px] rounded-full bg-[#eef3f8]" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-16 rounded-[18px] bg-[#f3f6fa]" />
                <div className="h-16 rounded-[18px] bg-[#f3f6fa]" />
                <div className="h-16 rounded-[18px] bg-[#f3f6fa]" />
              </div>
              <div className="flex gap-3">
                <div className="h-12 flex-1 rounded-[16px] bg-[#f3f6fa]" />
                <div className="h-12 flex-1 rounded-[16px] bg-[#d9e3ee]" />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function FilterSidebarSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`filter-skeleton-${index}`}
          className="rounded-[28px] bg-white p-5 shadow-[0_18px_38px_rgba(88,103,122,0.14)]"
        >
          <div className="animate-pulse grid gap-4">
            <div className="h-3 w-24 rounded-full bg-[#eef3f8]" />
            <div className="h-12 w-full rounded-[16px] bg-[#f4f7fb]" />
            <div className="h-3 w-5/6 rounded-full bg-[#eef3f8]" />
            {index >= 2 ? (
              <div className="flex flex-wrap gap-3">
                <div className="h-11 w-24 rounded-[16px] bg-[#eef3f8]" />
                <div className="h-11 w-24 rounded-[16px] bg-[#eef3f8]" />
                <div className="h-11 w-24 rounded-[16px] bg-[#eef3f8]" />
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function PaginationSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-[28px] bg-white p-5 shadow-[0_18px_38px_rgba(88,103,122,0.14)] sm:flex-row sm:items-center sm:justify-between">
      <div className="animate-pulse grid gap-2">
        <div className="h-3 w-52 rounded-full bg-[#eef3f8]" />
        <div className="h-3 w-40 rounded-full bg-[#eef3f8]" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="h-11 w-28 rounded-[18px] bg-[#eef3f8]" />
        <div className="h-10 w-10 rounded-[14px] bg-[#eef3f8]" />
        <div className="h-10 w-10 rounded-[14px] bg-[#eef3f8]" />
        <div className="h-10 w-10 rounded-[14px] bg-[#eef3f8]" />
        <div className="h-11 w-28 rounded-[18px] bg-[#eef3f8]" />
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [selectedPokemonId, setSelectedPokemonId] = React.useState(null);
  const [feedback, setFeedback] = React.useState("");
  const auth = useAuth();
  const cart = useCart();
  const catalog = useCatalog();
  const hasMountedRef = React.useRef(false);
  const searchDebounceRef = React.useRef(null);
  const selectedPokemon =
    catalog.catalog.find((pokemon) => pokemon.id === selectedPokemonId) || null;
  const visiblePageNumbers = React.useMemo(() => {
    const currentPage = catalog.pagination.currentPage;
    const pageCount = catalog.pagination.pageCount;
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(pageCount, start + 2);
    const normalizedStart = Math.max(1, end - 2);

    return Array.from(
      { length: end - normalizedStart + 1 },
      (_, index) => normalizedStart + index,
    );
  }, [catalog.pagination.currentPage, catalog.pagination.pageCount]);
  const ownedQuantities = catalog.ownedPokemons.reduce((accumulator, item) => {
    accumulator[item.id] = item.quantity;
    return accumulator;
  }, {});
  const showcasePokemons = React.useMemo(() => {
    const source = catalog.visibleCatalog.length
      ? catalog.visibleCatalog
      : catalog.catalog;

    return source.slice(0, 9);
  }, [catalog.catalog, catalog.visibleCatalog]);
  const spotlightPokemon = selectedPokemon || showcasePokemons[0] || null;

  const asideStats = [
    {
      label: "Pokemons",
      value: catalog.pagination.totalCount,
      caption: "na API",
    },
    {
      label: "Favoritos",
      value: catalog.stats.favoritesCount,
      caption: "por usuario",
    },
    {
      label: "Carrinho",
      value: cart.stats.cartCount,
      caption: "itens prontos",
    },
    {
      label: "Pagina",
      value: `${catalog.pagination.currentPage}/${catalog.pagination.pageCount}`,
      caption: "catalogo remoto",
    },
  ];

  function handleAddToCart(id) {
    const result = cart.addToCart(id);
    setFeedback(result.message);
  }

  React.useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return undefined;
    }

    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = window.setTimeout(() => {
      catalog.refreshCatalog({
        page: 1,
        pageSize: catalog.pagination.pageSize,
        search: catalog.ui.search,
        selectedType: catalog.ui.selectedType,
        selectedRegion: catalog.ui.selectedRegion,
      });
    }, 320);

    return () => {
      if (searchDebounceRef.current) {
        window.clearTimeout(searchDebounceRef.current);
      }
    };
  }, [
    catalog.pagination.pageSize,
    catalog.ui.search,
    catalog.ui.selectedRegion,
    catalog.ui.selectedType,
  ]);

  return (
    <main className="mx-auto w-[min(1500px,calc(100%-1rem))] pb-16 pt-5 text-[#516173] md:w-[min(1500px,calc(100%-2rem))]">
      <header className="mb-8 rounded-[36px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(247,250,253,0.88)_100%)] p-5 shadow-[0_22px_50px_rgba(86,104,126,0.16)] backdrop-blur-xl md:p-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="grid gap-4">
            <div className="text-[0.78rem] font-semibold uppercase tracking-[0.42em] text-[#7e8ea2]">
              Pokédex Shop
            </div>
            <div className="font-pixel text-[clamp(3.4rem,9vw,7rem)] leading-[0.88] text-[#5d6a80]">
              Pokédex
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { id: "app", label: "App" },
                { id: "shop", label: "Loja" },
                { id: "cart", label: "Carrinho" },
                { id: "profile", label: "Perfil" },
                {
                  id: "auth",
                  label: auth.isAuthenticated ? "Conta" : "Entrar",
                },
              ].map((item) => (
                <a
                  key={item.id}
                  className={cx(
                    "inline-flex min-h-[58px] items-center justify-center rounded-[22px] px-6 font-pixel text-[2rem] text-[#5d6a80] shadow-[0_14px_34px_rgba(104,122,144,0.12)] transition hover:-translate-y-0.5",
                    item.id === "shop" ? "bg-[#6f8dab] text-white" : "bg-white",
                  )}
                  href={routeHref(item.id)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            <div className="rounded-[22px] border border-[#cde3f3] bg-[#e7f5ff] px-5 py-3 font-pixel text-[2rem] text-[#527894] shadow-[0_12px_30px_rgba(104,122,144,0.12)]">
              API {catalog.meta.catalogSource}
            </div>
            <a
              className="rounded-[22px] bg-white px-5 py-3 font-pixel text-[2rem] text-[#5d6a80] shadow-[0_12px_30px_rgba(104,122,144,0.12)]"
              href={routeHref("cart")}
            >
              Bolsa {cart.stats.cartCount}
            </a>
            {auth.sessionInfo.isAuthenticated ? (
              <button
                className="rounded-[22px] bg-white px-5 py-3 font-pixel text-[2rem] text-[#5d6a80] shadow-[0_12px_30px_rgba(104,122,144,0.12)]"
                onClick={auth.logout}
                type="button"
              >
                Sair
              </button>
            ) : (
              <a
                className="rounded-[22px] bg-white px-5 py-3 font-pixel text-[2rem] text-[#5d6a80] shadow-[0_12px_30px_rgba(104,122,144,0.12)]"
                href={routeHref("auth")}
              >
                Entrar
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="grid gap-4 xl:sticky xl:top-5 xl:self-start">
          {catalog.meta.catalogLoading ? <FilterSidebarSkeleton /> : null}

          {!catalog.meta.catalogLoading ? (
            <>
              <div className="filter-card-enter rounded-[30px] bg-white p-5 shadow-[0_18px_38px_rgba(88,103,122,0.14)]">
                <div className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#92a0b1]">
                  Busca e ordenação
                </div>
                <div className="grid gap-4">
                  <input
                    className="w-full rounded-[18px] border border-[#e1e8f0] bg-[#f9fbfd] px-4 py-3 text-sm text-[#627287] outline-none transition focus:border-[#8ba9c4]"
                    onChange={(event) =>
                      catalog.updateSearch(event.target.value)
                    }
                    placeholder="Buscar por nome"
                    type="search"
                    value={catalog.ui.search}
                  />
                  <select
                    className="w-full rounded-[18px] border border-[#e1e8f0] bg-[#f9fbfd] px-4 py-3 text-sm text-[#627287] outline-none"
                    onChange={(event) => catalog.updateSort(event.target.value)}
                    value={catalog.ui.sortBy}
                  >
                    <option value="featured">Destaques</option>
                    <option value="price-asc">Menor valor</option>
                    <option value="price-desc">Maior valor</option>
                    <option value="name">Nome</option>
                    <option value="stock">Estoque</option>
                  </select>
                </div>
              </div>

              <div
                className="filter-card-enter rounded-[30px] bg-white p-5 shadow-[0_18px_38px_rgba(88,103,122,0.14)]"
                style={{ animationDelay: "90ms" }}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#92a0b1]">
                    Tipo
                  </div>
                  <div className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#a3b0bf]">
                    remoto
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {catalog.availableTypes.map((type) => (
                    <button
                      key={type}
                      className={cx(
                        "rounded-full px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] transition",
                        catalog.ui.selectedType === type
                          ? "bg-[#6f8dab] text-white"
                          : "bg-[#f4f7fb] text-[#6f7f94] hover:bg-[#ebf0f6]",
                      )}
                      onClick={() => catalog.updateTypeFilter(type)}
                      type="button"
                    >
                      {type === "all" ? "Todos" : getTypeLabel(type)}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="filter-card-enter rounded-[30px] bg-white p-5 shadow-[0_18px_38px_rgba(88,103,122,0.14)]"
                style={{ animationDelay: "180ms" }}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#92a0b1]">
                    Região
                  </div>
                  <div className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#a3b0bf]">
                    gerações
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {catalog.availableRegions.map((region) => (
                    <button
                      key={region}
                      className={cx(
                        "rounded-full px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] transition",
                        catalog.ui.selectedRegion === region
                          ? "bg-[#9bc1dd] text-white"
                          : "bg-[#f4f7fb] text-[#6f7f94] hover:bg-[#ebf0f6]",
                      )}
                      onClick={() => catalog.updateRegionFilter(region)}
                      type="button"
                    >
                      {region === "all" ? "Todas" : region}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="filter-card-enter rounded-[30px] bg-white p-5 shadow-[0_18px_38px_rgba(88,103,122,0.14)]"
                style={{ animationDelay: "270ms" }}
              >
                <div className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#92a0b1]">
                  Dados da vitrine
                </div>
                <div className="grid gap-3">
                  {asideStats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[18px] bg-[#f6f8fb] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                    >
                      <div className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-[#97a5b7]">
                        {item.label}
                      </div>
                      <div className="font-pixel text-[2.2rem] leading-none text-[#5f6b7f]">
                        {item.value}
                      </div>
                      <div className="text-sm text-[#8f9daf]">
                        {item.caption}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    className={buttonClass("outline")}
                    onClick={() => catalog.refreshCatalog({ force: true })}
                    type="button"
                  >
                    Sincronizar
                  </button>
                  <button
                    className={buttonClass("ghost")}
                    onClick={() =>
                      catalog.updateViewMode(
                        catalog.ui.viewMode === "grid" ? "list" : "grid",
                      )
                    }
                    type="button"
                  >
                    {catalog.ui.viewMode === "grid" ? "Lista" : "Grade"}
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </aside>

        <section className="grid gap-5">
          <FeedbackBanner message={feedback} />
          <FeedbackBanner
            message={catalog.meta.catalogError}
            variant="warning"
          />

          <div className="rounded-[34px] bg-white p-5 shadow-[0_18px_40px_rgba(88,103,122,0.14)] md:p-6">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#93a1b3]">
                  Shop catalog
                </div>
                <h2 className="font-pixel text-[3rem] leading-none text-[#5f6b7f]">
                  Pokemons
                </h2>
                <p className="mt-2 max-w-[56ch] text-sm leading-6 text-[#8595a8]">
                  Preco em reais calculado pela soma dos stats base do Pokemon
                  dividida por 1000. Filtros de nome, tipo e regiao consultam a
                  API remota.
                </p>
              </div>
              <div className="rounded-[22px] bg-[#f4f7fb] px-4 py-3 text-sm text-[#7f8ea2]">
                {catalog.ui.search
                  ? `${catalog.pagination.totalCount} resultado(s) para \"${catalog.ui.search}\"`
                  : `${catalog.pagination.filteredCount} item(ns) nesta pagina`}
              </div>
            </div>

            {catalog.meta.catalogLoading ? (
              <CatalogSkeleton
                count={catalog.pagination.pageSize}
                viewMode={catalog.ui.viewMode}
              />
            ) : catalog.visibleCatalog.length ? (
              <div
                className={
                  catalog.ui.viewMode === "list"
                    ? theme.cardGridList
                    : "grid justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3"
                }
              >
                {catalog.visibleCatalog.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    isFavorite={catalog.favorites.includes(pokemon.id)}
                    onAdd={handleAddToCart}
                    onOpen={setSelectedPokemonId}
                    onToggleFavorite={catalog.toggleFavorite}
                    ownedQuantity={ownedQuantities[pokemon.id] || 0}
                    pokemon={pokemon}
                    viewMode={catalog.ui.viewMode}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhum pokemon encontrado"
                message="Ajuste os filtros ou limpe a busca para restaurar a vitrine."
                action={
                  <button
                    className={buttonClass("outline")}
                    onClick={() => {
                      catalog.updateSearch("");
                      catalog.updateTypeFilter("all");
                      catalog.updateRegionFilter("all");
                    }}
                    type="button"
                  >
                    Limpar filtros
                  </button>
                }
              />
            )}

            {catalog.meta.catalogLoading ? (
              <PaginationSkeleton />
            ) : catalog.pagination.pageCount > 1 ? (
              <div className="pagination-enter mt-8 flex flex-col gap-3 rounded-[28px] bg-[#f6f8fb] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-[#8595a8]">
                    Página {catalog.pagination.currentPage} de{" "}
                    {catalog.pagination.pageCount}.
                  </p>
                  <p className="text-sm text-[#8595a8]">
                    Total remoto: {catalog.pagination.totalCount} Pokémon(s)
                    {catalog.pagination.selectedType &&
                    catalog.pagination.selectedType !== "all"
                      ? ` no tipo ${getTypeLabel(catalog.pagination.selectedType)}`
                      : ""}
                    {catalog.pagination.selectedRegion &&
                    catalog.pagination.selectedRegion !== "all"
                      ? ` em ${catalog.pagination.selectedRegion}`
                      : ""}
                    .
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    className="rounded-[16px] bg-white px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#6c7d92] shadow-[0_10px_22px_rgba(121,137,158,0.08)] disabled:opacity-45"
                    disabled={
                      !catalog.pagination.hasPreviousPage ||
                      catalog.meta.catalogLoading
                    }
                    onClick={() =>
                      catalog.updateCatalogPage(
                        catalog.pagination.currentPage - 1,
                      )
                    }
                    type="button"
                  >
                    Anterior
                  </button>

                  {visiblePageNumbers.map((page) => (
                    <button
                      key={page}
                      className={cx(
                        "h-11 w-11 rounded-[14px] text-sm font-semibold shadow-[0_10px_22px_rgba(121,137,158,0.08)] transition",
                        page === catalog.pagination.currentPage
                          ? "bg-[#6f8dab] text-white"
                          : "bg-white text-[#6c7d92]",
                      )}
                      disabled={catalog.meta.catalogLoading}
                      onClick={() => catalog.updateCatalogPage(page)}
                      type="button"
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="rounded-[16px] bg-white px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#6c7d92] shadow-[0_10px_22px_rgba(121,137,158,0.08)] disabled:opacity-45"
                    disabled={
                      !catalog.pagination.hasNextPage ||
                      catalog.meta.catalogLoading
                    }
                    onClick={() =>
                      catalog.updateCatalogPage(
                        catalog.pagination.currentPage + 1,
                      )
                    }
                    type="button"
                  >
                    Proxima
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </section>
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
    </main>
  );
}
