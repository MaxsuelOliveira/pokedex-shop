export function getStore() {
  return window.PokedexStore;
}

export function getStoreActions() {
  return getStore().actions;
}

export function getStoreSnapshot() {
  return getStore().getSnapshot();
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

export function capitalize(value) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

const typeLabelMap = {
  bug: "Inseto",
  dark: "Sombrio",
  dragon: "Dragão",
  electric: "Elétrico",
  fairy: "Fada",
  fighting: "Lutador",
  fire: "Fogo",
  flying: "Voador",
  ghost: "Fantasma",
  grass: "Planta",
  ground: "Terra",
  ice: "Gelo",
  normal: "Normal",
  poison: "Veneno",
  psychic: "Psíquico",
  rock: "Pedra",
  steel: "Aço",
  water: "Água",
};

const rarityLabelMap = {
  common: "Comum",
  popular: "Popular",
  rare: "Raro",
  epic: "Épico",
};

export function getTypeLabel(type) {
  return typeLabelMap[String(type || "").toLowerCase()] || capitalize(type);
}

export function getRarityLabel(rarity) {
  return (
    rarityLabelMap[String(rarity || "").toLowerCase()] || capitalize(rarity)
  );
}

export function formatPokemonName(name) {
  return String(name || "")
    .split("-")
    .filter(Boolean)
    .map((part) => capitalize(part))
    .join(" ");
}

export function routeHref(page) {
  const routeMap = {
    app: "#/",
    shop: "#/shop",
    cart: "#/cart",
    profile: "#/profile",
    auth: "#/auth",
    admin: "#/admin",
  };

  return routeMap[page] || "#/";
}

export function getStatusLabel(status) {
  const labels = {
    approved: "Aprovado",
    awaiting_admin: "Aguardando admin",
    awaiting_approval: "Aguardando entrega",
    cache: "Cache local",
    "cache-stale": "Cache expirado",
    cancelled: "Cancelado",
    captured: "Pagamento capturado",
    denied: "Pagamento negado",
    delivered: "Entregue",
    fallback: "Fallback local",
    pending_review: "Pendente",
    rejected: "Rejeitado",
    remote: "API remota",
  };

  return labels[status] || capitalize(status);
}

const pokemonToneMap = {
  bug: {
    cardTop: "from-[#9ddf7a] via-[#7fdb97] to-[#5fd9b6]",
    badge: "bg-white/22 text-white",
    accent: "#63b56f",
    meter: "from-[#5ab76f] to-[#8add89]",
  },
  dragon: {
    cardTop: "from-[#6f88ff] via-[#7084e6] to-[#5ac7ff]",
    badge: "bg-white/20 text-white",
    accent: "#6287f4",
    meter: "from-[#5970dc] to-[#7fd5ff]",
  },
  electric: {
    cardTop: "from-[#ffd95a] via-[#ffc72c] to-[#ffb300]",
    badge: "bg-white/28 text-[#784d00]",
    accent: "#f6b100",
    meter: "from-[#ffb100] to-[#ffd55a]",
  },
  fairy: {
    cardTop: "from-[#ff98bd] via-[#ff86b1] to-[#ffb8c9]",
    badge: "bg-white/26 text-white",
    accent: "#ff81af",
    meter: "from-[#ff7aa8] to-[#ffb3cb]",
  },
  fighting: {
    cardTop: "from-[#ff9567] via-[#ff6b5b] to-[#f34a52]",
    badge: "bg-white/20 text-white",
    accent: "#f95f50",
    meter: "from-[#ff624c] to-[#ffa164]",
  },
  fire: {
    cardTop: "from-[#ffb14a] via-[#ff8741] to-[#ff5b38]",
    badge: "bg-white/22 text-white",
    accent: "#ff6b3c",
    meter: "from-[#ff5d3f] to-[#ffb54d]",
  },
  flying: {
    cardTop: "from-[#8fc8ff] via-[#70b0ff] to-[#8cdcf7]",
    badge: "bg-white/22 text-white",
    accent: "#68aef6",
    meter: "from-[#66a9f2] to-[#95def8]",
  },
  ghost: {
    cardTop: "from-[#8a6bc5] via-[#6e4e9f] to-[#59427d]",
    badge: "bg-white/20 text-white",
    accent: "#7152a9",
    meter: "from-[#67429b] to-[#9c7bd6]",
  },
  grass: {
    cardTop: "from-[#75d47e] via-[#4fd28f] to-[#58ddb7]",
    badge: "bg-white/22 text-white",
    accent: "#53c97d",
    meter: "from-[#38c97d] to-[#7de4a7]",
  },
  ground: {
    cardTop: "from-[#d8bc74] via-[#c7a15e] to-[#a98254]",
    badge: "bg-white/24 text-white",
    accent: "#b98f54",
    meter: "from-[#b38543] to-[#debf78]",
  },
  ice: {
    cardTop: "from-[#84e2f0] via-[#75d1f3] to-[#8cbfff]",
    badge: "bg-white/24 text-white",
    accent: "#6ecfe5",
    meter: "from-[#72cde7] to-[#9bc6ff]",
  },
  normal: {
    cardTop: "from-[#9ac2d8] via-[#85b4ce] to-[#74a8c7]",
    badge: "bg-white/24 text-white",
    accent: "#7eaecb",
    meter: "from-[#75a5c1] to-[#9ec5df]",
  },
  poison: {
    cardTop: "from-[#d27ad6] via-[#c35abd] to-[#9c4ca1]",
    badge: "bg-white/20 text-white",
    accent: "#bf5ec6",
    meter: "from-[#a34fb0] to-[#db8be3]",
  },
  psychic: {
    cardTop: "from-[#9571ba] via-[#724e95] to-[#5c447b]",
    badge: "bg-white/20 text-white",
    accent: "#7b59aa",
    meter: "from-[#6e4c9a] to-[#a98add]",
  },
  rock: {
    cardTop: "from-[#d3b66f] via-[#b99159] to-[#99814f]",
    badge: "bg-white/24 text-white",
    accent: "#b48c52",
    meter: "from-[#ad8446] to-[#d8be77]",
  },
  steel: {
    cardTop: "from-[#b1c6d7] via-[#94aec2] to-[#728ea8]",
    badge: "bg-white/24 text-white",
    accent: "#88a2bb",
    meter: "from-[#7e99b0] to-[#b9cfdf]",
  },
  water: {
    cardTop: "from-[#4e9cd8] via-[#397fc0] to-[#2f679c]",
    badge: "bg-white/20 text-white",
    accent: "#3f89c9",
    meter: "from-[#2f76b5] to-[#6bb5ea]",
  },
};

export function getPokemonTone(pokemon) {
  const primaryType =
    Array.isArray(pokemon?.types) && pokemon.types.length
      ? String(pokemon.types[0]).toLowerCase()
      : "normal";

  return pokemonToneMap[primaryType] || pokemonToneMap.normal;
}

export const theme = {
  shell:
    "relative mx-auto w-[min(1440px,calc(100%-1rem))] pb-16 pt-6 text-pokedex-text md:w-[min(1440px,calc(100%-2rem))]",
  panel:
    "relative overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(242,247,252,0.94)_100%)] p-5 shadow-[0_22px_50px_rgba(86,104,126,0.14)] backdrop-blur-xl",
  heroCopy:
    "relative overflow-hidden rounded-[38px] border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.9)_0%,rgba(237,244,250,0.94)_46%,rgba(223,235,246,0.96)_100%)] p-7 shadow-[0_24px_54px_rgba(86,104,126,0.14)] backdrop-blur-xl md:p-10",
  sectionOverline:
    "mb-2 inline-block font-pixel text-lg uppercase tracking-[0.24em] text-[#6f8dab]",
  title: "font-pixel font-bold leading-[0.95] tracking-[0.14em]",
  effectTitle:
    "font-pixel font-bold tracking-[0.14em] [text-shadow:3px_3px_rgba(242,106,75,0.22)]",
  navLink:
    "inline-flex min-h-11 items-center justify-center rounded-[16px] border border-[#dce6f0] bg-white px-4 py-2 font-pixel text-[1.6rem] text-[#617187] shadow-[0_10px_24px_rgba(104,122,144,0.08)] transition hover:-translate-y-0.5 hover:bg-[#f8fbfe]",
  navLinkActive:
    "inline-flex min-h-11 items-center justify-center rounded-[16px] border border-[#6f8dab] bg-[#6f8dab] px-4 py-2 font-pixel text-[1.6rem] text-white shadow-[0_12px_32px_rgba(111,141,171,0.22)] transition -translate-y-0.5",
  buttonSolid:
    "inline-flex min-h-[48px] items-center justify-center rounded-[18px] border border-[#6f8dab] bg-[#6f8dab] px-4 py-2 font-pixel text-2xl text-white shadow-[0_14px_28px_rgba(111,141,171,0.26)] transition hover:-translate-y-0.5 hover:brightness-[1.04] disabled:cursor-not-allowed disabled:opacity-55 disabled:transform-none",
  buttonOutline:
    "inline-flex min-h-[48px] items-center justify-center rounded-[18px] border border-[#dce6f0] bg-white px-4 py-2 font-pixel text-2xl text-[#617187] shadow-[0_10px_24px_rgba(104,122,144,0.08)] transition hover:-translate-y-0.5 hover:bg-[#f8fbfe] disabled:cursor-not-allowed disabled:opacity-55 disabled:transform-none",
  buttonGhost:
    "inline-flex min-h-[48px] items-center justify-center rounded-[18px] border border-[#dce6f0] bg-[#f5f8fc] px-4 py-2 font-pixel text-2xl text-[#617187] transition hover:-translate-y-0.5 hover:bg-white",
  feedback:
    "rounded-[24px] border border-[#dce6f0] bg-[linear-gradient(135deg,rgba(255,255,255,0.86)_0%,rgba(231,240,248,0.82)_100%)] px-5 py-4 shadow-[0_16px_32px_rgba(104,122,144,0.08)]",
  warning:
    "rounded-[24px] border border-[#f1d6c6] bg-[linear-gradient(135deg,rgba(255,245,239,0.92)_0%,rgba(255,255,255,0.96)_100%)] px-5 py-4 shadow-[0_16px_32px_rgba(214,160,132,0.12)]",
  fieldLabel:
    "mb-1 inline-block text-xs font-semibold uppercase tracking-[0.22em] text-pokedex-muted",
  fieldControl:
    "w-full rounded-[18px] border border-[#dce6f0] bg-[#f9fbfd] px-4 py-3 text-[#617187] outline-none transition focus:-translate-y-0.5 focus:border-[#8ba9c4] focus:bg-white focus:shadow-[0_18px_34px_rgba(104,122,144,0.1)]",
  textarea: "min-h-[130px] resize-y",
  detailTile:
    "rounded-[24px] border border-[#dce6f0] bg-[linear-gradient(145deg,rgba(255,255,255,0.88)_0%,rgba(241,246,251,0.94)_100%)] px-5 py-5 shadow-[0_18px_34px_rgba(104,122,144,0.1)]",
  dashboardColumns:
    "grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.95fr)]",
  cartColumns:
    "grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.85fr)]",
  catalogLayout: "grid gap-5 xl:grid-cols-[minmax(280px,330px)_minmax(0,1fr)]",
  stack: "grid gap-5",
  miniList: "grid gap-4 sm:grid-cols-2 2xl:grid-cols-4",
  orderGrid: "grid gap-5 xl:grid-cols-2",
  featureList: "grid gap-4 md:grid-cols-2",
  cardGrid: "grid gap-6 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4",
  cardGridList: "grid gap-5",
  filterRail: "grid gap-4 md:gap-5",
  softPanel:
    "rounded-[24px] border border-[#dce6f0] bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(242,247,252,0.92)_100%)] p-4 shadow-[0_16px_32px_rgba(104,122,144,0.08)]",
  metricRow:
    "flex flex-col gap-1 rounded-[20px] border border-[#dce6f0] bg-white px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] xl:flex-row xl:items-center xl:justify-between",
  metricRowAccent:
    "flex flex-col gap-1 rounded-[20px] border border-[#cfe0ee] bg-[linear-gradient(135deg,rgba(234,243,250,0.92)_0%,rgba(255,255,255,0.94)_100%)] px-4 py-3 shadow-[0_12px_28px_rgba(111,141,171,0.12)] xl:flex-row xl:items-center xl:justify-between",
  fieldGroup: "grid gap-2",
  fieldHint: "text-xs leading-5 text-pokedex-muted",
  formCard:
    "rounded-[28px] border border-[#dce6f0] bg-[linear-gradient(145deg,rgba(255,255,255,0.9)_0%,rgba(241,246,251,0.95)_100%)] p-5 shadow-[0_18px_34px_rgba(104,122,144,0.1)]",
  chip: "inline-flex min-h-[46px] items-center justify-center rounded-[16px] border border-pokedex-line/12 bg-white/60 px-4 py-2 font-pixel text-2xl text-pokedex-text shadow-[0_10px_24px_rgba(20,48,56,0.08)] transition hover:-translate-y-0.5 hover:bg-white/85",
  chipActive:
    "inline-flex min-h-[46px] items-center justify-center rounded-[16px] border border-[#6f8dab] bg-[linear-gradient(135deg,rgba(111,141,171,0.94)_0%,rgba(143,177,207,0.94)_100%)] px-4 py-2 font-pixel text-2xl text-white shadow-[0_14px_28px_rgba(111,141,171,0.22)] transition hover:-translate-y-0.5",
  accentLabel:
    "inline-flex items-center rounded-full border border-pokedex-accent/20 bg-pokedex-accentSoft/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#8a432f]",
  paginationWrap:
    "mt-6 flex flex-col gap-3 rounded-[24px] border border-[#dce6f0] bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(242,247,252,0.92)_100%)] p-4 shadow-[0_16px_32px_rgba(104,122,144,0.08)] sm:flex-row sm:items-center sm:justify-between",
  paginationText: "text-sm text-pokedex-muted",
  skeletonBlock: "animate-pulse rounded-[18px] bg-white/70",
  pagePill:
    "inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-[14px] border border-[#dce6f0] bg-white px-3 font-pixel text-[1.6rem] text-[#617187] shadow-[0_8px_18px_rgba(104,122,144,0.08)] transition hover:-translate-y-0.5 hover:bg-[#f8fbfe]",
  pagePillActive:
    "inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-[14px] border border-[#6f8dab] bg-[linear-gradient(135deg,rgba(111,141,171,0.94)_0%,rgba(143,177,207,0.94)_100%)] px-3 font-pixel text-[1.6rem] text-white shadow-[0_12px_24px_rgba(111,141,171,0.2)] transition",
  imageFrame:
    "rounded-[24px] border border-[#dce6f0] bg-[linear-gradient(180deg,#f4f8fb_0%,#ffffff_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
};

export function getTheme() {
  return theme;
}

export function cx(...classes) {
  return classes.flat().filter(Boolean).join(" ");
}

export function buttonClass(variant = "outline") {
  if (variant === "solid") {
    return theme.buttonSolid;
  }

  if (variant === "ghost") {
    return theme.buttonGhost;
  }

  return theme.buttonOutline;
}
