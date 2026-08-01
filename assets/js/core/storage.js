(function storageModule() {
  const STORAGE_KEY = "pokedex-marketplace-state-v1";

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createInitialState() {
    const bootstrapCatalog = clone(window.PokedexSeed || []);

    return {
      catalog: bootstrapCatalog,
      catalogCache: {
        items: bootstrapCatalog,
        fetchedAt: null,
        source: "bootstrap",
      },
      orders: [],
      users: [
        {
          id: "user-local",
          role: "customer",
          name: "Treinador Local",
          email: "treinador@localhost",
          password: "pikachu123",
          city: "Pallet Town",
          favoriteType: "electric",
          balance: 320,
          bio: "Colecionador independente pronto para integrar este fluxo a um backend real.",
          inventory: [],
        },
        {
          id: "admin-local",
          role: "admin",
          name: "Professor Oak",
          email: "admin@localhost",
          password: "master123",
          city: "Indigo Plateau",
          favoriteType: "psychic",
          balance: 0,
          bio: "Administrador local responsável por revisar e aprovar pedidos.",
          inventory: [],
        },
      ],
      session: {
        currentUserId: "user-local",
      },
      cartsByUser: {
        guest: [],
        "user-local": [],
        "admin-local": [],
      },
      favoritesByUser: {
        guest: [],
        "user-local": [],
        "admin-local": [],
      },
      ui: {
        search: "",
        selectedType: "all",
        selectedRegion: "all",
        sortBy: "featured",
        viewMode: "grid",
        currentPage: 1,
        pageSize: 16,
      },
      meta: {
        catalogLoading: false,
        catalogSource: bootstrapCatalog.length ? "bootstrap" : "empty",
        catalogError: "",
        catalogTotalCount: bootstrapCatalog.length,
        catalogPageCount: 1,
        catalogHasNextPage: false,
        catalogHasPreviousPage: false,
      },
    };
  }

  function loadState() {
    try {
      const rawState = window.localStorage.getItem(STORAGE_KEY);
      if (!rawState) {
        return createInitialState();
      }

      const parsedState = JSON.parse(rawState);
      if (!parsedState || typeof parsedState !== "object") {
        throw new Error("Estado local invalido.");
      }

      return parsedState;
    } catch (error) {
      console.warn("Falha ao carregar o estado local da loja.", error);
      window.localStorage.removeItem(STORAGE_KEY);
      return createInitialState();
    }
  }

  function saveState(state) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  window.PokedexStorage = {
    STORAGE_KEY,
    clone,
    createInitialState,
    loadState,
    saveState,
  };
})();
