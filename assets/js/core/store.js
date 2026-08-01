(function storeModule() {
  const listeners = new Set();
  const repositories = window.PokedexServices.resolveRepositories();
  let state = normalizeState(window.PokedexStorage.loadState());
  let cachedSnapshot = null;
  let latestCatalogRequestId = 0;

  function roundMoney(value) {
    return Math.round(value * 100) / 100;
  }

  function normalizeCatalog(catalog) {
    if (!Array.isArray(catalog) || !catalog.length) {
      return window.PokedexServices.clone(
        window.PokedexServices.getFallbackCatalog(),
      );
    }

    return catalog.map((pokemon) => ({
      ...pokemon,
      types: Array.isArray(pokemon.types) ? pokemon.types : [],
      stock: Number.isFinite(pokemon.stock) ? pokemon.stock : 0,
      price: Number.isFinite(pokemon.price) ? pokemon.price : 0,
    }));
  }

  function normalizeInventory(inventory) {
    if (!Array.isArray(inventory)) {
      return [];
    }

    return inventory
      .map((item) => ({
        pokemonId: Number(item.pokemonId),
        quantity: Number.isFinite(item.quantity) ? item.quantity : 0,
        acquiredAt: item.acquiredAt || new Date().toISOString(),
        orderId: item.orderId || null,
      }))
      .filter((item) => item.pokemonId && item.quantity > 0);
  }

  function normalizeUsers(candidateState, baseState) {
    const baseUsers = window.PokedexServices.clone(baseState.users || []);
    const legacyProfile =
      candidateState && candidateState.profile ? candidateState.profile : null;
    const candidateUsers = Array.isArray(candidateState && candidateState.users)
      ? candidateState.users
      : [];
    const mergedUsers = candidateUsers.length
      ? candidateUsers
      : baseUsers.map((user) =>
          user.id === "user-local" && legacyProfile
            ? { ...user, ...legacyProfile }
            : user,
        );

    const normalizedUsers = mergedUsers.map((user) => ({
      id: user.id,
      role: user.role || "customer",
      name: user.name || "Treinador",
      email: user.email || "",
      password: user.password || "123456",
      city: user.city || "",
      favoriteType: user.favoriteType || "normal",
      balance: Number.isFinite(user.balance) ? roundMoney(user.balance) : 0,
      bio: user.bio || "",
      inventory: normalizeInventory(user.inventory),
    }));

    if (!normalizedUsers.some((user) => user.id === "admin-local")) {
      normalizedUsers.push(baseUsers.find((user) => user.id === "admin-local"));
    }

    if (!normalizedUsers.some((user) => user.id === "user-local")) {
      normalizedUsers.unshift(
        baseUsers.find((user) => user.id === "user-local"),
      );
    }

    return normalizedUsers;
  }

  function normalizeOrders(candidateState) {
    const legacyOrders = Array.isArray(candidateState && candidateState.orders)
      ? candidateState.orders
      : [];

    return legacyOrders.map((order) => {
      const rawStatus = String(order.status || "").toLowerCase();
      const normalizedStatus =
        rawStatus === "confirmado" || rawStatus === "confirmed"
          ? "approved"
          : rawStatus === "pendente" || rawStatus === "pending"
            ? "pending_review"
            : rawStatus === "rejeitado" || rawStatus === "rejected"
              ? "rejected"
              : order.status || "approved";

      return {
        id: order.id || "ORDER-" + Date.now(),
        userId: order.userId || "user-local",
        createdAt: order.createdAt || new Date().toISOString(),
        updatedAt:
          order.updatedAt || order.createdAt || new Date().toISOString(),
        approvedAt: order.approvedAt || null,
        status: normalizedStatus,
        paymentStatus:
          order.paymentStatus ||
          (normalizedStatus === "approved"
            ? "captured"
            : normalizedStatus === "rejected"
              ? "denied"
              : "awaiting_admin"),
        fulfillmentStatus:
          order.fulfillmentStatus ||
          (normalizedStatus === "approved"
            ? "delivered"
            : normalizedStatus === "rejected"
              ? "cancelled"
              : "awaiting_approval"),
        total: Number.isFinite(order.total) ? roundMoney(order.total) : 0,
        items: Array.isArray(order.items)
          ? order.items.map((item) => ({
              id: Number(item.id),
              name: item.name,
              quantity: Number.isFinite(item.quantity) ? item.quantity : 1,
              price: Number.isFinite(item.price) ? roundMoney(item.price) : 0,
              image: item.image || "",
            }))
          : [],
      };
    });
  }

  function normalizeUserMap(mapCandidate, fallbackList) {
    const normalizedMap =
      mapCandidate && typeof mapCandidate === "object"
        ? { ...mapCandidate }
        : {};
    Object.keys(fallbackList).forEach((key) => {
      if (!Array.isArray(normalizedMap[key])) {
        normalizedMap[key] = fallbackList[key];
      }
    });

    return normalizedMap;
  }

  function normalizeState(candidateState) {
    const base = window.PokedexStorage.createInitialState();
    const users = normalizeUsers(candidateState, base);
    const defaultUserId = users.some((user) => user.id === "user-local")
      ? "user-local"
      : users[0].id;
    const legacyCart = Array.isArray(candidateState && candidateState.cart)
      ? candidateState.cart
      : [];
    const legacyFavorites = Array.isArray(
      candidateState && candidateState.favorites,
    )
      ? candidateState.favorites
      : [];
    const mergedState = {
      ...base,
      ...candidateState,
      ui: {
        ...base.ui,
        ...(candidateState && candidateState.ui ? candidateState.ui : {}),
      },
      meta: {
        ...base.meta,
        ...(candidateState && candidateState.meta ? candidateState.meta : {}),
      },
      catalogCache: {
        ...base.catalogCache,
        ...(candidateState && candidateState.catalogCache
          ? candidateState.catalogCache
          : {}),
      },
      session: {
        ...base.session,
        ...(candidateState && candidateState.session
          ? candidateState.session
          : {}),
        currentUserId:
          candidateState &&
          candidateState.session &&
          Object.prototype.hasOwnProperty.call(
            candidateState.session,
            "currentUserId",
          )
            ? candidateState.session.currentUserId
            : defaultUserId,
      },
      users,
      orders: normalizeOrders(candidateState),
      catalog: normalizeCatalog(candidateState && candidateState.catalog),
    };

    mergedState.cartsByUser = normalizeUserMap(
      candidateState && candidateState.cartsByUser,
      {
        guest: legacyCart,
        [defaultUserId]: legacyCart,
        "admin-local": [],
      },
    );

    mergedState.favoritesByUser = normalizeUserMap(
      candidateState && candidateState.favoritesByUser,
      {
        guest: legacyFavorites,
        [defaultUserId]: legacyFavorites,
        "admin-local": [],
      },
    );

    mergedState.catalogCache.items = normalizeCatalog(
      mergedState.catalogCache.items || mergedState.catalog,
    );

    return mergedState;
  }

  function persist() {
    repositories.state.persist(state);
  }

  function getUserKey(snapshotState) {
    return snapshotState.session.currentUserId || "guest";
  }

  function getCurrentUser(snapshotState) {
    return (
      snapshotState.users.find(
        (user) => user.id === snapshotState.session.currentUserId,
      ) || null
    );
  }

  function getCurrentCart(snapshotState) {
    return snapshotState.cartsByUser[getUserKey(snapshotState)] || [];
  }

  function getCurrentFavorites(snapshotState) {
    return snapshotState.favoritesByUser[getUserKey(snapshotState)] || [];
  }

  function getOrdersWithUsers(snapshotState) {
    return snapshotState.orders
      .map((order) => {
        const user =
          snapshotState.users.find((entry) => entry.id === order.userId) ||
          null;
        return {
          ...order,
          userName: user ? user.name : "Usuário removido",
          userEmail: user ? user.email : "",
        };
      })
      .sort(
        (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
      );
  }

  function getCurrentOrders(snapshotState) {
    const currentUser = getCurrentUser(snapshotState);
    if (!currentUser) {
      return [];
    }

    return getOrdersWithUsers(snapshotState).filter(
      (order) => order.userId === currentUser.id,
    );
  }

  function getOwnedPokemons(snapshotState, currentUser) {
    if (!currentUser) {
      return [];
    }

    return currentUser.inventory
      .map((entry) => {
        const pokemon = snapshotState.catalog.find(
          (item) => item.id === entry.pokemonId,
        );
        if (!pokemon) {
          return null;
        }

        return {
          ...pokemon,
          quantity: entry.quantity,
          acquiredAt: entry.acquiredAt,
          orderId: entry.orderId,
        };
      })
      .filter(Boolean)
      .sort(
        (left, right) => new Date(right.acquiredAt) - new Date(left.acquiredAt),
      );
  }

  function getAvailableTypes(catalog) {
    const typeSet = new Set();
    catalog.forEach((pokemon) => {
      pokemon.types.forEach((type) => typeSet.add(type));
    });

    return ["all"].concat(Array.from(typeSet).sort());
  }

  function getAvailableRegions(catalog) {
    const regionSet = new Set();
    catalog.forEach((pokemon) => {
      if (pokemon.region) {
        regionSet.add(String(pokemon.region).toLowerCase());
      }
    });

    return ["all"].concat(Array.from(regionSet).sort());
  }

  function getVisibleCatalog(snapshot) {
    const sortedItems = snapshot.catalog.slice();

    const sortBy = snapshot.ui.sortBy;
    sortedItems.sort((left, right) => {
      if (sortBy === "price-asc") {
        return left.price - right.price;
      }

      if (sortBy === "price-desc") {
        return right.price - left.price;
      }

      if (sortBy === "name") {
        return left.name.localeCompare(right.name);
      }

      if (sortBy === "stock") {
        return right.stock - left.stock;
      }

      if (left.featured !== right.featured) {
        return left.featured ? -1 : 1;
      }

      return left.name.localeCompare(right.name);
    });

    return sortedItems;
  }

  function getCatalogPagination(snapshot, visibleCatalog) {
    const totalCount = Math.max(
      0,
      Number(snapshot.meta.catalogTotalCount) || snapshot.catalog.length,
    );
    const pageSize = Math.max(1, Number(snapshot.ui.pageSize) || 16);
    const pageCount = Math.max(
      1,
      Number(snapshot.meta.catalogPageCount) ||
        Math.ceil(totalCount / pageSize),
    );
    const currentPage = Math.min(
      Math.max(1, Number(snapshot.ui.currentPage) || 1),
      pageCount,
    );

    return {
      currentPage,
      pageSize,
      totalCount,
      pageCount,
      hasNextPage:
        typeof snapshot.meta.catalogHasNextPage === "boolean"
          ? snapshot.meta.catalogHasNextPage
          : currentPage < pageCount,
      hasPreviousPage:
        typeof snapshot.meta.catalogHasPreviousPage === "boolean"
          ? snapshot.meta.catalogHasPreviousPage
          : currentPage > 1,
      filteredCount: visibleCatalog.length,
      search: snapshot.meta.catalogSearch || "",
      selectedType:
        snapshot.meta.catalogSelectedType || snapshot.ui.selectedType || "all",
      selectedRegion:
        snapshot.meta.catalogSelectedRegion ||
        snapshot.ui.selectedRegion ||
        "all",
    };
  }

  function getCartDetailed(snapshot) {
    return getCurrentCart(snapshot)
      .map((item) => {
        const pokemon = snapshot.catalog.find((entry) => entry.id === item.id);
        if (!pokemon) {
          return null;
        }

        return {
          ...pokemon,
          quantity: item.quantity,
          lineTotal: roundMoney(item.quantity * pokemon.price),
        };
      })
      .filter(Boolean);
  }

  function getCartTotals(cartDetailed) {
    const subtotal = roundMoney(
      cartDetailed.reduce((total, item) => total + item.lineTotal, 0),
    );
    const shipping = subtotal === 0 ? 0 : subtotal >= 140 ? 0 : 12.9;
    const total = roundMoney(subtotal + shipping);
    const itemsCount = cartDetailed.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    return {
      subtotal,
      shipping,
      total,
      itemsCount,
    };
  }

  function getFeaturedCatalog(snapshot) {
    return snapshot.catalog
      .filter((pokemon) => pokemon.featured)
      .sort((left, right) => right.price - left.price)
      .slice(0, 4);
  }

  function getFavoriteItems(snapshot) {
    const favorites = getCurrentFavorites(snapshot);
    return snapshot.catalog.filter((pokemon) => favorites.includes(pokemon.id));
  }

  function buildSnapshot(sourceState) {
    const normalizedState = normalizeState(sourceState);
    const currentUser = getCurrentUser(normalizedState);
    const visibleCatalog = getVisibleCatalog(normalizedState);
    const cartDetailed = getCartDetailed(normalizedState);
    const cartTotals = getCartTotals(cartDetailed);
    const favorites = getCurrentFavorites(normalizedState);
    const currentOrders = getCurrentOrders(normalizedState);
    const allOrders = getOrdersWithUsers(normalizedState);
    const ownedPokemons = getOwnedPokemons(normalizedState, currentUser);
    const pendingOrders = allOrders.filter(
      (order) => order.status === "pending_review",
    );
    const pagination = getCatalogPagination(normalizedState, visibleCatalog);
    const usersSummary = normalizedState.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      balance: user.balance,
      inventoryCount: user.inventory.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    }));

    return {
      ...normalizedState,
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isAdmin: Boolean(currentUser && currentUser.role === "admin"),
      profile: currentUser
        ? {
            name: currentUser.name,
            email: currentUser.email,
            city: currentUser.city,
            favoriteType: currentUser.favoriteType,
            balance: currentUser.balance,
            bio: currentUser.bio,
          }
        : {
            name: "Visitante",
            email: "",
            city: "",
            favoriteType: "normal",
            balance: 0,
            bio: "Faça login para comprar, receber aprovações e montar sua coleção.",
          },
      cart: getCurrentCart(normalizedState),
      favorites,
      availableTypes: getAvailableTypes(normalizedState.catalog),
      availableRegions: getAvailableRegions(normalizedState.catalog),
      visibleCatalog,
      pagination,
      cartDetailed,
      cartTotals,
      featuredCatalog: getFeaturedCatalog(normalizedState),
      favoriteItems: getFavoriteItems(normalizedState),
      orders: currentOrders,
      allOrders,
      pendingOrders,
      ownedPokemons,
      usersSummary,
      authPresets: {
        customer: {
          email: "treinador@localhost",
          password: "pikachu123",
        },
        admin: {
          email: "admin@localhost",
          password: "master123",
        },
      },
      stats: {
        catalogCount: normalizedState.catalog.length,
        favoritesCount: favorites.length,
        cartCount: cartTotals.itemsCount,
        orderCount: currentOrders.length,
        balance: currentUser ? currentUser.balance : 0,
        inventoryCount: ownedPokemons.reduce(
          (total, item) => total + item.quantity,
          0,
        ),
        pendingOrderCount: pendingOrders.length,
      },
    };
  }

  function getSnapshot() {
    if (!cachedSnapshot) {
      cachedSnapshot = buildSnapshot(state);
    }

    return cachedSnapshot;
  }

  function emit() {
    const snapshot = getSnapshot();
    listeners.forEach((listener) => listener(snapshot));
  }

  function setState(updater) {
    const draft = window.PokedexServices.clone(state);
    const nextState =
      typeof updater === "function" ? updater(draft) || draft : updater;
    state = normalizeState(nextState);
    cachedSnapshot = null;
    persist();
    emit();
    return getSnapshot();
  }

  function subscribe(listener) {
    listeners.add(listener);
    return function unsubscribe() {
      listeners.delete(listener);
    };
  }

  function updateSearch(search) {
    setState((draft) => {
      draft.ui.search = search;
      draft.ui.currentPage = 1;
    });
  }

  function updateTypeFilter(selectedType) {
    setState((draft) => {
      draft.ui.selectedType = selectedType;
      draft.ui.currentPage = 1;
    });
  }

  function updateRegionFilter(selectedRegion) {
    setState((draft) => {
      draft.ui.selectedRegion = selectedRegion;
      draft.ui.currentPage = 1;
    });
  }

  function updateSort(sortBy) {
    setState((draft) => {
      draft.ui.sortBy = sortBy;
    });
  }

  function updateViewMode(viewMode) {
    setState((draft) => {
      draft.ui.viewMode = viewMode;
    });
  }

  function toggleFavorite(id) {
    setState((draft) => {
      const userKey = getUserKey(draft);
      const currentFavorites = draft.favoritesByUser[userKey] || [];

      if (currentFavorites.includes(id)) {
        draft.favoritesByUser[userKey] = currentFavorites.filter(
          (favoriteId) => favoriteId !== id,
        );
        return;
      }

      draft.favoritesByUser[userKey] = [id].concat(currentFavorites);
    });
  }

  function addToCart(id) {
    const snapshot = getSnapshot();
    const pokemon = snapshot.catalog.find((entry) => entry.id === id);
    const cartEntry = snapshot.cart.find((item) => item.id === id);

    if (!pokemon) {
      return {
        ok: false,
        message: "Pokemon não encontrado no catálogo atual.",
      };
    }

    if (pokemon.stock <= 0) {
      return { ok: false, message: "Este Pokemon está esgotado." };
    }

    if (cartEntry && cartEntry.quantity >= pokemon.stock) {
      return {
        ok: false,
        message: "Quantidade máxima deste Pokemon já está no carrinho.",
      };
    }

    setState((draft) => {
      const userKey = getUserKey(draft);
      const cart = draft.cartsByUser[userKey] || [];
      const existingItem = cart.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id, quantity: 1 });
      }

      draft.cartsByUser[userKey] = cart;
    });

    return { ok: true, message: "Pokemon adicionado ao carrinho." };
  }

  function decreaseQuantity(id) {
    setState((draft) => {
      const userKey = getUserKey(draft);
      const cart = draft.cartsByUser[userKey] || [];
      const existingItem = cart.find((item) => item.id === id);
      if (!existingItem) {
        return;
      }

      existingItem.quantity -= 1;
      draft.cartsByUser[userKey] = cart.filter((item) => item.quantity > 0);
    });
  }

  function removeFromCart(id) {
    setState((draft) => {
      const userKey = getUserKey(draft);
      draft.cartsByUser[userKey] = (draft.cartsByUser[userKey] || []).filter(
        (item) => item.id !== id,
      );
    });
  }

  function clearCart() {
    setState((draft) => {
      draft.cartsByUser[getUserKey(draft)] = [];
    });
  }

  function updateProfile(profilePayload) {
    const snapshot = getSnapshot();
    if (!snapshot.currentUser) {
      return { ok: false, message: "Faça login antes de editar o perfil." };
    }

    setState((draft) => {
      const parsedBalance = Number(profilePayload.balance);
      draft.users = draft.users.map((user) => {
        if (user.id !== draft.session.currentUserId) {
          return user;
        }

        return {
          ...user,
          ...profilePayload,
          balance: Number.isFinite(parsedBalance)
            ? roundMoney(parsedBalance)
            : user.balance,
        };
      });
    });

    return { ok: true, message: "Perfil salvo no localStorage." };
  }

  function login(credentials) {
    const email = String(credentials.email || "")
      .trim()
      .toLowerCase();
    const password = String(credentials.password || "");
    const snapshot = getSnapshot();
    const user = snapshot.users.find(
      (entry) =>
        entry.email.toLowerCase() === email && entry.password === password,
    );

    if (!user) {
      return { ok: false, message: "Credenciais inválidas." };
    }

    setState((draft) => {
      draft.session.currentUserId = user.id;
    });

    return { ok: true, message: "Sessão iniciada com sucesso." };
  }

  function logout() {
    setState((draft) => {
      draft.session.currentUserId = null;
    });

    return { ok: true, message: "Sessão encerrada." };
  }

  function register(payload) {
    const email = String(payload.email || "")
      .trim()
      .toLowerCase();
    const password = String(payload.password || "").trim();

    if (!email || !password || !payload.name) {
      return {
        ok: false,
        message: "Preencha nome, e-mail e senha para criar a conta.",
      };
    }

    const snapshot = getSnapshot();
    if (snapshot.users.some((user) => user.email.toLowerCase() === email)) {
      return { ok: false, message: "Já existe uma conta com este e-mail." };
    }

    const newUser = {
      id: "user-" + Date.now(),
      role: "customer",
      name: payload.name,
      email,
      password,
      city: payload.city || "",
      favoriteType: payload.favoriteType || "normal",
      balance: Number.isFinite(Number(payload.balance))
        ? roundMoney(Number(payload.balance))
        : 180,
      bio: payload.bio || "Novo treinador cadastrado localmente.",
      inventory: [],
    };

    setState((draft) => {
      draft.users.push(newUser);
      draft.cartsByUser[newUser.id] = [];
      draft.favoritesByUser[newUser.id] = [];
      draft.session.currentUserId = newUser.id;
    });

    return { ok: true, message: "Conta criada e sessão iniciada." };
  }

  function checkout() {
    const snapshot = getSnapshot();

    if (!snapshot.currentUser) {
      return { ok: false, message: "Faça login antes de finalizar um pedido." };
    }

    if (!snapshot.cartDetailed.length) {
      return { ok: false, message: "Seu carrinho ainda está vazio." };
    }

    const hasInvalidStock = snapshot.cartDetailed.some(
      (item) => item.quantity > item.stock,
    );
    if (hasInvalidStock) {
      return {
        ok: false,
        message:
          "Uma ou mais quantidades no carrinho ultrapassam o estoque disponível.",
      };
    }

    const order = {
      id: "ORDER-" + Date.now(),
      userId: snapshot.currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvedAt: null,
      status: "pending_review",
      paymentStatus: "awaiting_admin",
      fulfillmentStatus: "awaiting_approval",
      total: snapshot.cartTotals.total,
      items: snapshot.cartDetailed.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
    };

    setState((draft) => {
      draft.orders.unshift(order);
      draft.cartsByUser[getUserKey(draft)] = [];
    });

    return {
      ok: true,
      message:
        "Pedido criado com status pendente. Um administrador precisa aprovar para liberar o Pokemon e consumir o estoque.",
    };
  }

  function approveOrder(orderId) {
    const snapshot = getSnapshot();
    if (!snapshot.isAdmin) {
      return {
        ok: false,
        message: "Somente administradores podem aprovar pedidos.",
      };
    }

    const order = snapshot.allOrders.find((entry) => entry.id === orderId);
    if (!order || order.status !== "pending_review") {
      return { ok: false, message: "Pedido indisponível para aprovação." };
    }

    const targetUser = snapshot.users.find((user) => user.id === order.userId);
    if (!targetUser) {
      return { ok: false, message: "Usuário do pedido não encontrado." };
    }

    if (targetUser.balance < order.total) {
      return {
        ok: false,
        message: "Saldo insuficiente do usuário para capturar o pagamento.",
      };
    }

    const hasStockIssue = order.items.some((item) => {
      const catalogItem = snapshot.catalog.find(
        (pokemon) => pokemon.id === item.id,
      );
      return !catalogItem || catalogItem.stock < item.quantity;
    });

    if (hasStockIssue) {
      return {
        ok: false,
        message: "Estoque insuficiente para aprovar este pedido.",
      };
    }

    setState((draft) => {
      draft.catalog = draft.catalog.map((pokemon) => {
        const orderedItem = order.items.find((item) => item.id === pokemon.id);
        if (!orderedItem) {
          return pokemon;
        }

        return {
          ...pokemon,
          stock: pokemon.stock - orderedItem.quantity,
        };
      });

      draft.users = draft.users.map((user) => {
        if (user.id !== order.userId) {
          return user;
        }

        const nextInventory = normalizeInventory(user.inventory);
        order.items.forEach((item) => {
          const inventoryEntry = nextInventory.find(
            (entry) => entry.pokemonId === item.id,
          );
          if (inventoryEntry) {
            inventoryEntry.quantity += item.quantity;
            inventoryEntry.acquiredAt = new Date().toISOString();
            inventoryEntry.orderId = order.id;
          } else {
            nextInventory.push({
              pokemonId: item.id,
              quantity: item.quantity,
              acquiredAt: new Date().toISOString(),
              orderId: order.id,
            });
          }
        });

        return {
          ...user,
          balance: roundMoney(user.balance - order.total),
          inventory: nextInventory,
        };
      });

      draft.orders = draft.orders.map((entry) => {
        if (entry.id !== order.id) {
          return entry;
        }

        return {
          ...entry,
          updatedAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
          status: "approved",
          paymentStatus: "captured",
          fulfillmentStatus: "delivered",
        };
      });

      draft.catalogCache.items = draft.catalog;
      draft.catalogCache.fetchedAt = Date.now();
      draft.catalogCache.source = draft.meta.catalogSource;
    });

    return {
      ok: true,
      message:
        "Pedido aprovado. Estoque consumido e Pokemon entregue ao usuário.",
    };
  }

  function rejectOrder(orderId) {
    const snapshot = getSnapshot();
    if (!snapshot.isAdmin) {
      return {
        ok: false,
        message: "Somente administradores podem rejeitar pedidos.",
      };
    }

    const order = snapshot.allOrders.find((entry) => entry.id === orderId);
    if (!order || order.status !== "pending_review") {
      return { ok: false, message: "Pedido indisponível para rejeição." };
    }

    setState((draft) => {
      draft.orders = draft.orders.map((entry) => {
        if (entry.id !== orderId) {
          return entry;
        }

        return {
          ...entry,
          updatedAt: new Date().toISOString(),
          status: "rejected",
          paymentStatus: "denied",
          fulfillmentStatus: "cancelled",
        };
      });
    });

    return { ok: true, message: "Pedido rejeitado pelo administrador." };
  }

  async function refreshCatalog(options) {
    const settings = options || {};
    const requestId = ++latestCatalogRequestId;
    const requestedPage = Math.max(
      1,
      Number(settings.page) || Number(state.ui.currentPage) || 1,
    );
    const requestedPageSize = Math.max(
      1,
      Number(settings.pageSize) || Number(state.ui.pageSize) || 16,
    );
    const requestedSearch = String(
      Object.prototype.hasOwnProperty.call(settings, "search")
        ? settings.search
        : state.ui.search,
    ).trim();
    const requestedType = String(
      Object.prototype.hasOwnProperty.call(settings, "selectedType")
        ? settings.selectedType
        : state.ui.selectedType,
    ).trim();
    const requestedRegion = String(
      Object.prototype.hasOwnProperty.call(settings, "selectedRegion")
        ? settings.selectedRegion
        : state.ui.selectedRegion,
    ).trim();

    setState((draft) => {
      draft.meta.catalogLoading = true;
      draft.meta.catalogError = "";
      draft.ui.currentPage = requestedPage;
      draft.ui.pageSize = requestedPageSize;
      draft.ui.search = requestedSearch;
      draft.ui.selectedType = requestedType || "all";
      draft.ui.selectedRegion = requestedRegion || "all";
    });

    const payload = await repositories.catalog.list({
      cache: state.catalogCache,
      forceRefresh: Boolean(settings.force),
      page: requestedPage,
      pageSize: requestedPageSize,
      search: requestedSearch,
      selectedType: requestedType,
      selectedRegion: requestedRegion,
    });

    if (requestId !== latestCatalogRequestId) {
      return payload;
    }

    setState((draft) => {
      draft.catalog = normalizeCatalog(payload.items);
      draft.ui.currentPage = payload.page || requestedPage;
      draft.ui.pageSize = payload.pageSize || requestedPageSize;
      draft.ui.search = payload.search ?? requestedSearch;
      draft.ui.selectedType = payload.selectedType || requestedType || "all";
      draft.ui.selectedRegion =
        payload.selectedRegion || requestedRegion || "all";
      draft.catalogCache = {
        items: normalizeCatalog(payload.items),
        version: payload.version,
        fetchedAt: payload.fetchedAt,
        source: payload.source,
        page: payload.page || requestedPage,
        pageSize: payload.pageSize || requestedPageSize,
        totalCount: payload.totalCount || payload.items.length,
        pageCount: payload.pageCount || 1,
        search: payload.search ?? requestedSearch,
        selectedType: payload.selectedType || requestedType || "all",
        selectedRegion: payload.selectedRegion || requestedRegion || "all",
      };
      draft.meta.catalogLoading = false;
      draft.meta.catalogSource = payload.source;
      draft.meta.catalogError = payload.error || "";
      draft.meta.catalogTotalCount = payload.totalCount || payload.items.length;
      draft.meta.catalogPageCount = payload.pageCount || 1;
      draft.meta.catalogHasNextPage = Boolean(payload.hasNextPage);
      draft.meta.catalogHasPreviousPage = Boolean(payload.hasPreviousPage);
      draft.meta.catalogSearch = payload.search ?? requestedSearch;
      draft.meta.catalogSelectedType =
        payload.selectedType || requestedType || "all";
      draft.meta.catalogSelectedRegion =
        payload.selectedRegion || requestedRegion || "all";
    });

    return payload;
  }

  function updateCatalogPage(page) {
    const snapshot = getSnapshot();
    const nextPage = Math.max(1, Number(page) || 1);
    if (nextPage === snapshot.pagination.currentPage) {
      return Promise.resolve(snapshot.pagination);
    }

    return refreshCatalog({
      page: nextPage,
      pageSize: snapshot.pagination.pageSize,
      search: snapshot.pagination.search,
      selectedType: snapshot.pagination.selectedType,
      selectedRegion: snapshot.pagination.selectedRegion,
    });
  }

  function initializeCatalog() {
    refreshCatalog({
      page: state.ui.currentPage || 1,
      pageSize: state.ui.pageSize || 16,
    }).catch((error) => {
      setState((draft) => {
        draft.meta.catalogLoading = false;
        draft.meta.catalogError = error.message;
      });
    });
  }

  initializeCatalog();

  window.PokedexStore = {
    subscribe,
    getSnapshot,
    actions: {
      addToCart,
      approveOrder,
      checkout,
      clearCart,
      decreaseQuantity,
      login,
      logout,
      refreshCatalog,
      register,
      rejectOrder,
      removeFromCart,
      toggleFavorite,
      updateCatalogPage,
      updateProfile,
      updateRegionFilter,
      updateSearch,
      updateSort,
      updateTypeFilter,
      updateViewMode,
    },
  };
})();
