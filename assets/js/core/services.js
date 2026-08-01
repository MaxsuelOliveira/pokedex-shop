(function servicesModule() {
  const CATALOG_CACHE_TTL = 1000 * 60 * 60 * 6;
  const CATALOG_CACHE_VERSION = 2;
  const API_ROOT = "https://pokeapi.co/api/v2";
  const DEFAULT_PAGE_SIZE = 16;
  const POKEMON_INDEX_LIMIT = 1400;
  const REGION_GENERATION_MAP = {
    kanto: "generation-i",
    johto: "generation-ii",
    hoenn: "generation-iii",
    sinnoh: "generation-iv",
    unova: "generation-v",
    kalos: "generation-vi",
    alola: "generation-vii",
    galar: "generation-viii",
    paldea: "generation-ix",
  };
  let pokemonIndexPromise = null;
  const typeIndexPromises = new Map();
  const regionIndexPromises = new Map();
  const TYPE_LABELS = {
    bug: "inseto",
    dark: "sombrio",
    dragon: "dragão",
    electric: "elétrico",
    fairy: "fada",
    fighting: "lutador",
    fire: "fogo",
    flying: "voador",
    ghost: "fantasma",
    grass: "planta",
    ground: "terra",
    ice: "gelo",
    normal: "normal",
    poison: "veneno",
    psychic: "psíquico",
    rock: "pedra",
    steel: "aço",
    water: "água",
  };
  const RARITY_LABELS = {
    common: "comum",
    popular: "popular",
    rare: "raro",
    epic: "épico",
  };
  const STAT_LABELS = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defesa",
    speed: "Velocidade",
    "special-attack": "Ataque especial",
    "special-defense": "Defesa especial",
  };

  function clone(value) {
    return window.PokedexStorage.clone(value);
  }

  function normalizeText(value) {
    return String(value || "")
      .replace(/\f/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function capitalize(value) {
    if (!value) {
      return "";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function formatPokemonName(name) {
    return String(name || "")
      .split("-")
      .filter(Boolean)
      .map((part) => capitalize(part))
      .join(" ");
  }

  function getTypeLabel(type) {
    return TYPE_LABELS[String(type || "").toLowerCase()] || String(type || "");
  }

  function getFallbackCatalog() {
    return clone(window.PokedexSeed || []);
  }

  function getSeedMaps() {
    const fallbackCatalog = getFallbackCatalog();
    return {
      byId: new Map(fallbackCatalog.map((pokemon) => [pokemon.id, pokemon])),
      byName: new Map(
        fallbackCatalog.map((pokemon) => [pokemon.name.toLowerCase(), pokemon]),
      ),
    };
  }

  function isFreshCache(cache) {
    return Boolean(
      cache &&
      cache.version === CATALOG_CACHE_VERSION &&
      Array.isArray(cache.items) &&
      cache.items.length &&
      cache.fetchedAt &&
      Date.now() - cache.fetchedAt < CATALOG_CACHE_TTL,
    );
  }

  function clampPage(page) {
    return Math.max(1, Number(page) || 1);
  }

  function normalizePagination(totalCount, page, pageSize) {
    const safePageSize = Math.max(1, Number(pageSize) || DEFAULT_PAGE_SIZE);
    const safeTotalCount = Math.max(0, Number(totalCount) || 0);
    const pageCount = Math.max(1, Math.ceil(safeTotalCount / safePageSize));
    const safePage = Math.min(clampPage(page), pageCount);

    return {
      page: safePage,
      pageSize: safePageSize,
      totalCount: safeTotalCount,
      pageCount,
      hasNextPage: safePage < pageCount,
      hasPreviousPage: safePage > 1,
    };
  }

  async function getPokemonIndex() {
    if (!pokemonIndexPromise) {
      pokemonIndexPromise = fetchJson(
        API_ROOT + `/pokemon?limit=${POKEMON_INDEX_LIMIT}&offset=0`,
      ).then((payload) => payload.results || []);
    }

    return pokemonIndexPromise;
  }

  async function getNamesForType(type) {
    const normalizedType = normalizeText(type).toLowerCase();
    if (!normalizedType || normalizedType === "all") {
      return null;
    }

    if (!typeIndexPromises.has(normalizedType)) {
      typeIndexPromises.set(
        normalizedType,
        fetchJson(API_ROOT + `/type/${normalizedType}`).then((payload) =>
          (payload.pokemon || []).map((entry) => entry.pokemon.name),
        ),
      );
    }

    return typeIndexPromises.get(normalizedType);
  }

  async function getNamesForRegion(region) {
    const normalizedRegion = normalizeText(region).toLowerCase();
    const generation = REGION_GENERATION_MAP[normalizedRegion];
    if (!generation) {
      return null;
    }

    if (!regionIndexPromises.has(normalizedRegion)) {
      regionIndexPromises.set(
        normalizedRegion,
        fetchJson(API_ROOT + `/generation/${generation}`).then((payload) =>
          (payload.pokemon_species || []).map((entry) => entry.name),
        ),
      );
    }

    return regionIndexPromises.get(normalizedRegion);
  }

  async function resolveRequestedNames(options) {
    const settings = options || {};
    const search = normalizeText(settings.search).toLowerCase();
    const selectedType = normalizeText(settings.selectedType).toLowerCase();
    const selectedRegion = normalizeText(settings.selectedRegion).toLowerCase();
    const pokemonIndex = await getPokemonIndex();
    let candidateNames = pokemonIndex.map((pokemon) => pokemon.name);

    if (search) {
      candidateNames = candidateNames.filter((name) => name.includes(search));
    }

    if (selectedType && selectedType !== "all") {
      const typeNames = await getNamesForType(selectedType);
      const typeSet = new Set(typeNames || []);
      candidateNames = candidateNames.filter((name) => typeSet.has(name));
    }

    if (selectedRegion && selectedRegion !== "all") {
      const regionNames = await getNamesForRegion(selectedRegion);
      const regionSet = new Set(regionNames || []);
      candidateNames = candidateNames.filter((name) => regionSet.has(name));
    }

    return candidateNames;
  }

  function mapGenerationToRegion(generationName, seedPokemon) {
    if (seedPokemon && seedPokemon.region) {
      return seedPokemon.region;
    }

    const regionMap = {
      "generation-i": "Kanto",
      "generation-ii": "Johto",
      "generation-iii": "Hoenn",
      "generation-iv": "Sinnoh",
      "generation-v": "Unova",
      "generation-vi": "Kalos",
      "generation-vii": "Alola",
      "generation-viii": "Galar",
      "generation-ix": "Paldea",
    };

    return regionMap[generationName] || "Pokemon World";
  }

  function derivePower(detail) {
    return detail.stats.reduce((total, item) => total + item.base_stat, 0);
  }

  function derivePrice(detail, species, seedPokemon, index) {
    const totalPower = derivePower(detail);
    return Math.round((totalPower / 1000) * 100) / 100;
  }

  function deriveStock(detail, seedPokemon) {
    if (seedPokemon && Number.isFinite(seedPokemon.stock)) {
      return seedPokemon.stock;
    }

    return Math.max(
      1,
      Math.min(12, 14 - Math.floor(detail.base_experience / 20)),
    );
  }

  function deriveRarity(detail, species, seedPokemon) {
    if (seedPokemon && seedPokemon.rarity) {
      return seedPokemon.rarity;
    }

    if (species.is_legendary || species.is_mythical) {
      return "epic";
    }

    if (detail.base_experience >= 200) {
      return "rare";
    }

    if (detail.base_experience >= 120) {
      return "popular";
    }

    return "common";
  }

  function deriveFeatured(index, seedPokemon) {
    if (seedPokemon && typeof seedPokemon.featured === "boolean") {
      return seedPokemon.featured;
    }

    return index < 4;
  }

  function extractDescription(detail, species, seedPokemon, context) {
    const region = context.region;
    const rarity = context.rarity;
    const stock = context.stock;
    const power = derivePower(detail);
    const bestStat = detail.stats
      .slice()
      .sort((left, right) => right.base_stat - left.base_stat)[0];
    const typeText = detail.types
      .map((item) => getTypeLabel(item.type.name))
      .join(" e ");
    const rarityText = RARITY_LABELS[rarity] || rarity;
    const stockText =
      stock <= 3
        ? "estoque bem limitado"
        : stock <= 7
          ? "estoque controlado"
          : "estoque confortável";
    const bestStatLabel = STAT_LABELS[bestStat?.stat?.name] || "potencial";
    const specialStatus =
      species.is_legendary || species.is_mythical
        ? " Ele faz parte de uma linhagem lendária e aparece como peça de alto destaque na coleção."
        : "";

    if (
      seedPokemon &&
      seedPokemon.description &&
      /[ãáàâéêíóôõúç]/i.test(seedPokemon.description)
    ) {
      return normalizeText(seedPokemon.description);
    }

    return `${formatPokemonName(detail.name)} é um Pokémon da região de ${region}, com tipagem ${typeText}. Seu poder total chega a ${power}, com destaque para ${bestStatLabel.toLowerCase()} em ${bestStat?.base_stat || 0}. Na loja, ele aparece com perfil ${rarityText} e ${stockText}.${specialStatus}`;
  }

  function extractSpecies(detail, seedPokemon) {
    if (
      seedPokemon &&
      seedPokemon.species &&
      /[ãáàâéêíóôõúç]/i.test(seedPokemon.species)
    ) {
      return seedPokemon.species;
    }

    const primaryType = detail.types[0]
      ? getTypeLabel(detail.types[0].type.name)
      : "normal";
    return `Pokémon ${primaryType.toLowerCase()}`;
  }

  function mapStats(detail, seedPokemon) {
    const stats = detail.stats.reduce((accumulator, item) => {
      accumulator[item.stat.name] = item.base_stat;
      return accumulator;
    }, {});

    return {
      hp:
        stats.hp ||
        (seedPokemon && seedPokemon.stats ? seedPokemon.stats.hp : 0),
      attack:
        stats.attack ||
        (seedPokemon && seedPokemon.stats ? seedPokemon.stats.attack : 0),
      defense:
        stats.defense ||
        (seedPokemon && seedPokemon.stats ? seedPokemon.stats.defense : 0),
      specialAttack: stats["special-attack"] || 0,
      specialDefense: stats["special-defense"] || 0,
      speed:
        stats.speed ||
        (seedPokemon && seedPokemon.stats ? seedPokemon.stats.speed : 0),
      power: derivePower(detail),
    };
  }

  async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Falha ao carregar " + url + ": " + response.status);
    }

    return response.json();
  }

  async function fetchRemoteCatalog(options) {
    const settings = options || {};
    const seedMaps = getSeedMaps();
    const search = normalizeText(settings.search).toLowerCase();
    const selectedType = normalizeText(settings.selectedType).toLowerCase();
    const selectedRegion = normalizeText(settings.selectedRegion).toLowerCase();
    const pageSize = Math.max(
      1,
      Number(settings.pageSize) || DEFAULT_PAGE_SIZE,
    );
    const requestedPage = clampPage(settings.page);
    let requestedNames = [];
    let pagination;
    let offset = 0;

    if (
      search ||
      (selectedType && selectedType !== "all") ||
      (selectedRegion && selectedRegion !== "all")
    ) {
      const matchingNames = await resolveRequestedNames({
        search,
        selectedType,
        selectedRegion,
      });
      pagination = normalizePagination(
        matchingNames.length,
        requestedPage,
        pageSize,
      );
      offset = (pagination.page - 1) * pagination.pageSize;
      requestedNames = matchingNames.slice(
        offset,
        offset + pagination.pageSize,
      );
    } else {
      offset = (requestedPage - 1) * pageSize;
      const listPayload = await fetchJson(
        API_ROOT + `/pokemon?limit=${pageSize}&offset=${offset}`,
      );
      requestedNames = listPayload.results.map((pokemon) => pokemon.name);
      pagination = normalizePagination(
        listPayload.count,
        requestedPage,
        pageSize,
      );
    }

    const remoteItems = await Promise.all(
      requestedNames.map(async (name, index) => {
        const detail = await fetchJson(API_ROOT + "/pokemon/" + name);
        const species = await fetchJson(detail.species.url);
        const seedPokemon =
          seedMaps.byName.get(detail.name) ||
          seedMaps.byId.get(detail.id) ||
          null;
        const artwork =
          detail.sprites.other &&
          detail.sprites.other["official-artwork"] &&
          detail.sprites.other["official-artwork"].front_default;
        const stock = deriveStock(detail, seedPokemon);
        const rarity = deriveRarity(detail, species, seedPokemon);
        const region = mapGenerationToRegion(
          species.generation.name,
          seedPokemon,
        );

        return {
          id: detail.id,
          name: formatPokemonName(detail.name),
          species: extractSpecies(detail, seedPokemon),
          types: detail.types.map((item) => item.type.name),
          price: derivePrice(detail, species, seedPokemon, index),
          stock,
          rarity,
          region,
          featured: deriveFeatured(offset + index, seedPokemon),
          description: extractDescription(detail, species, seedPokemon, {
            region,
            rarity,
            stock,
          }),
          image: artwork || detail.sprites.front_default,
          stats: mapStats(detail, seedPokemon),
        };
      }),
    );

    return {
      items: remoteItems,
      search,
      selectedType,
      selectedRegion,
      ...pagination,
    };
  }

  const defaultCatalogRepository = {
    async list(options) {
      const settings = options || {};
      const cache = settings.cache || null;
      const page = clampPage(settings.page);
      const search = normalizeText(settings.search).toLowerCase();
      const selectedType = normalizeText(settings.selectedType).toLowerCase();
      const selectedRegion = normalizeText(
        settings.selectedRegion,
      ).toLowerCase();
      const pageSize = Math.max(
        1,
        Number(settings.pageSize) || DEFAULT_PAGE_SIZE,
      );

      if (
        !search &&
        (!selectedType || selectedType === "all") &&
        (!selectedRegion || selectedRegion === "all") &&
        !settings.forceRefresh &&
        isFreshCache(cache) &&
        Number(cache.page || 1) === page &&
        Number(cache.pageSize || DEFAULT_PAGE_SIZE) === pageSize
      ) {
        const pagination = normalizePagination(
          cache.totalCount,
          page,
          pageSize,
        );
        return {
          items: clone(cache.items),
          source: "cache",
          version: cache.version || CATALOG_CACHE_VERSION,
          fetchedAt: cache.fetchedAt,
          ...pagination,
        };
      }

      try {
        const remotePayload = await fetchRemoteCatalog({
          page,
          pageSize,
          search,
          selectedType,
          selectedRegion,
        });
        return {
          items: remotePayload.items,
          source: "remote",
          version: CATALOG_CACHE_VERSION,
          fetchedAt: Date.now(),
          page: remotePayload.page,
          pageSize: remotePayload.pageSize,
          totalCount: remotePayload.totalCount,
          pageCount: remotePayload.pageCount,
          hasNextPage: remotePayload.hasNextPage,
          hasPreviousPage: remotePayload.hasPreviousPage,
          search: remotePayload.search,
          selectedType: remotePayload.selectedType,
          selectedRegion: remotePayload.selectedRegion,
        };
      } catch (error) {
        if (cache && Array.isArray(cache.items) && cache.items.length) {
          const pagination = normalizePagination(
            cache.totalCount || cache.items.length,
            cache.page || page,
            cache.pageSize || pageSize,
          );
          return {
            items: clone(cache.items),
            source: "cache-stale",
            version: cache.version || CATALOG_CACHE_VERSION,
            fetchedAt: cache.fetchedAt,
            error: error.message,
            search,
            selectedType,
            selectedRegion,
            ...pagination,
          };
        }

        const fallbackCatalog = getFallbackCatalog();
        const pagination = normalizePagination(
          fallbackCatalog.length,
          page,
          pageSize,
        );
        const startIndex = (pagination.page - 1) * pagination.pageSize;
        return {
          items: fallbackCatalog.slice(
            startIndex,
            startIndex + pagination.pageSize,
          ),
          source: "fallback",
          version: CATALOG_CACHE_VERSION,
          fetchedAt: Date.now(),
          error: error.message,
          search,
          selectedType,
          selectedRegion,
          ...pagination,
        };
      }
    },
    async getById(id, options) {
      const payload = await this.list(options);
      return clone(payload.items.find((pokemon) => pokemon.id === id) || null);
    },
  };

  const defaultStateRepository = {
    persist(state) {
      window.PokedexStorage.saveState(state);
      return clone(state);
    },
  };

  function resolveRepositories() {
    const config = window.PokedexConfig || {};
    const repositories = config.repositories || {};

    return {
      catalog: repositories.catalog || defaultCatalogRepository,
      state: repositories.state || defaultStateRepository,
    };
  }

  window.PokedexServices = {
    API_ROOT,
    CATALOG_CACHE_TTL,
    DEFAULT_PAGE_SIZE,
    REGION_GENERATION_MAP,
    clone,
    defaultCatalogRepository,
    defaultStateRepository,
    getFallbackCatalog,
    resolveRepositories,
  };
})();
