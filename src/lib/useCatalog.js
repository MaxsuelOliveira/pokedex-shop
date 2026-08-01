import { useStoreActions, useStoreSnapshot } from "./store";

export function useCatalog() {
  const actions = useStoreActions();
  const state = useStoreSnapshot((snapshot) => ({
    sessionInfo: snapshot,
    catalog: snapshot.catalog,
    featuredCatalog: snapshot.featuredCatalog,
    visibleCatalog: snapshot.visibleCatalog,
    availableTypes: snapshot.availableTypes,
    availableRegions: snapshot.availableRegions,
    favoriteItems: snapshot.favoriteItems,
    favorites: snapshot.favorites,
    meta: snapshot.meta,
    ownedPokemons: snapshot.ownedPokemons,
    pagination: snapshot.pagination,
    stats: snapshot.stats,
    ui: snapshot.ui,
  }));

  return {
    ...state,
    addToCart: actions.addToCart,
    refreshCatalog: actions.refreshCatalog,
    toggleFavorite: actions.toggleFavorite,
    updateCatalogPage: actions.updateCatalogPage,
    updateRegionFilter: actions.updateRegionFilter,
    updateSearch: actions.updateSearch,
    updateSort: actions.updateSort,
    updateTypeFilter: actions.updateTypeFilter,
    updateViewMode: actions.updateViewMode,
  };
}
