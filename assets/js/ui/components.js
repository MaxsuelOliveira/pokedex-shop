(function componentsModule() {
  const html = window.htm.bind(window.React.createElement);

  const theme = {
    shell:
      "mx-auto w-[min(1280px,calc(100%-1rem))] pb-12 pt-5 md:w-[min(1280px,calc(100%-2rem))] text-pokedex-text",
    panel:
      "rounded-[28px] border-4 border-black/10 bg-[rgba(255,255,255,0.88)] p-4 shadow-panel backdrop-blur-md",
    heroCopy:
      "rounded-[28px] border-4 border-black/10 bg-[rgba(255,255,255,0.88)] p-6 shadow-panel backdrop-blur-md md:p-10",
    sectionOverline:
      "mb-2 inline-block font-pixel text-lg uppercase tracking-[0.2em] text-pokedex-greenDark",
    title: "font-pixel font-bold tracking-[0.14em] leading-[0.95]",
    effectTitle:
      "font-pixel font-bold tracking-[0.14em] [text-shadow:5px_2px_#989696]",
    navLink:
      "inline-flex min-h-11 items-center justify-center rounded-full border-[3px] border-pokedex-line bg-white/70 px-4 py-2 font-pixel text-xl shadow-md transition hover:-translate-y-0.5 hover:bg-pokedex-accent",
    navLinkActive:
      "inline-flex min-h-11 items-center justify-center rounded-full border-[3px] border-pokedex-line bg-pokedex-accent px-4 py-2 font-pixel text-xl shadow-md transition -translate-y-0.5",
    buttonSolid:
      "inline-flex min-h-[46px] items-center justify-center rounded-2xl border-[3px] border-pokedex-line bg-pokedex-green px-4 py-2 font-pixel text-2xl transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 disabled:transform-none",
    buttonOutline:
      "inline-flex min-h-[46px] items-center justify-center rounded-2xl border-[3px] border-pokedex-line bg-white/85 px-4 py-2 font-pixel text-2xl transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 disabled:transform-none",
    buttonGhost:
      "inline-flex min-h-[46px] items-center justify-center rounded-2xl border-[3px] border-pokedex-line bg-white/85 px-4 py-2 font-pixel text-2xl transition hover:-translate-y-0.5",
    feedback:
      "rounded-[20px] border-2 border-dashed border-black/20 bg-white/75 px-4 py-4 shadow-panel",
    warning:
      "rounded-[20px] border-2 border-dashed border-black/20 bg-[#ffe8b4]/90 px-4 py-4 shadow-panel",
    fieldLabel:
      "mb-[-0.15rem] inline-block text-sm font-semibold text-pokedex-muted",
    fieldControl:
      "w-full rounded-2xl border-[3px] border-pokedex-line bg-pokedex-cardSoft px-4 py-3 text-pokedex-text outline-none transition focus:-translate-y-0.5 focus:shadow-panel",
    textarea: "min-h-[130px] resize-y",
    detailTile:
      "rounded-[22px] border-[3px] border-black/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,250,240,0.9)_100%)] px-4 py-4 shadow-panel",
    dashboardColumns:
      "grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]",
    cartColumns:
      "grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]",
    catalogLayout:
      "grid gap-4 xl:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]",
    stack: "grid gap-4",
    miniList: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
    orderGrid: "grid gap-4 xl:grid-cols-2",
    featureList: "grid gap-4",
    cardGrid: "grid gap-5 md:grid-cols-2 2xl:grid-cols-3",
    cardGridList: "grid gap-5",
  };

  function cx() {
    return Array.from(arguments).flat().filter(Boolean).join(" ");
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }

  function capitalize(label) {
    if (!label) {
      return "";
    }

    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  function useStore() {
    const [snapshot, setSnapshot] = window.React.useState(
      window.PokedexStore.getSnapshot(),
    );

    window.React.useEffect(
      () => window.PokedexStore.subscribe(setSnapshot),
      [],
    );
    return snapshot;
  }

  function getStatusLabel(status) {
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

  function getStatusClasses(status) {
    const classes = {
      approved: "bg-[#dcf8d8]",
      awaiting_admin: "bg-[#fff1a5]",
      awaiting_approval: "bg-[#fff1a5]",
      cache: "bg-[#fff1a5]",
      "cache-stale": "bg-[#fff1a5]",
      cancelled: "bg-[#ffd8d2]",
      captured: "bg-[#dcf8d8]",
      denied: "bg-[#ffd8d2]",
      delivered: "bg-[#dcf8d8]",
      fallback: "bg-[#ffd8d2]",
      pending_review: "bg-[#fff1a5]",
      rejected: "bg-[#ffd8d2]",
      remote: "bg-[#dcf8d8]",
    };

    return classes[status] || "bg-pokedex-cardSoft";
  }

  function buttonClass(variant) {
    return variant === "solid" ? theme.buttonSolid : theme.buttonOutline;
  }

  function routeHref(page) {
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

  function StatusBadge(props) {
    return html`<span
      className=${cx(
        "inline-flex items-center justify-center rounded-full border-2 border-pokedex-line px-3 py-1 font-pixel text-xl",
        getStatusClasses(props.status),
      )}
      >${getStatusLabel(props.status)}</span
    >`;
  }

  function NavigationLink(props) {
    return html`<a
      className=${props.active ? theme.navLinkActive : theme.navLink}
      href=${props.href}
      >${props.children}</a
    >`;
  }

  function SiteLayout(props) {
    const sessionInfo = props.sessionInfo || {};

    return html`
      <main className=${theme.shell}>
        <header className="mb-8 grid gap-4">
          <div
            className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
          >
            <a
              className="font-pixel text-[clamp(2.2rem,5vw,4rem)] font-bold [text-shadow:5px_2px_#989696]"
              href=${routeHref("app")}
              >Pokedex</a
            >
            <nav className="flex flex-wrap gap-3">
              <${NavigationLink}
                href=${routeHref("app")}
                active=${props.currentPage === "app"}
                >App<//
              >
              <${NavigationLink}
                href=${routeHref("shop")}
                active=${props.currentPage === "shop"}
                >Loja<//
              >
              <${NavigationLink}
                href=${routeHref("cart")}
                active=${props.currentPage === "cart"}
                >Carrinho<//
              >
              <${NavigationLink}
                href=${routeHref("profile")}
                active=${props.currentPage === "profile"}
                >Perfil<//
              >
              ${sessionInfo.isAdmin
                ? html`<${NavigationLink}
                    href=${routeHref("admin")}
                    active=${props.currentPage === "admin"}
                    >Admin<//
                  >`
                : null}
              <${NavigationLink}
                href=${routeHref("auth")}
                active=${props.currentPage === "auth"}
                >${sessionInfo.isAuthenticated ? "Conta" : "Entrar"}<//
              >
            </nav>
          </div>

          <div
            className=${cx(
              theme.panel,
              "flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between",
            )}
          >
            <div>
              <span className=${theme.sectionOverline}>Sessão</span>
              <strong className="block font-pixel text-[1.9rem]">
                ${sessionInfo.currentUser
                  ? sessionInfo.currentUser.name +
                    " • " +
                    capitalize(sessionInfo.currentUser.role)
                  : "Visitante"}
              </strong>
            </div>
            <div className="flex flex-wrap gap-3">
              ${props.catalogSource
                ? html`<${StatusBadge} status=${props.catalogSource} />`
                : null}
              ${sessionInfo.isAuthenticated && props.onLogout
                ? html`<button
                    className=${theme.buttonOutline}
                    type="button"
                    onClick=${props.onLogout}
                  >
                    Sair
                  </button>`
                : html`<a
                    className=${theme.buttonOutline}
                    href=${routeHref("auth")}
                    >Entrar</a
                  >`}
            </div>
          </div>

          <div
            className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,.95fr)]"
          >
            <div className=${theme.heroCopy}>
              <span className=${theme.sectionOverline}
                >Marketplace local-first</span
              >
              <h1
                className="mb-4 font-pixel text-[clamp(2.8rem,8vw,6rem)] font-bold leading-[0.95] tracking-[0.14em] [text-shadow:5px_2px_#989696]"
              >
                ${props.title}
              </h1>
              <p
                className="max-w-[56ch] text-base leading-7 text-pokedex-muted"
              >
                ${props.subtitle}
              </p>
              ${props.actions
                ? html`<div className="mt-6 flex flex-wrap gap-3">
                    ${props.actions}
                  </div>`
                : null}
            </div>
            <div className=${cx(theme.panel, "p-5")}>${props.aside}</div>
          </div>
        </header>

        <section className="grid gap-4">${props.children}</section>
      </main>
    `;
  }

  function StatCard(props) {
    return html`
      <article
        className="rounded-[20px] border-[3px] border-pokedex-line bg-pokedex-panel px-4 py-4 shadow-panel"
      >
        <span className="mb-1 block font-pixel text-lg text-pokedex-muted"
          >${props.label}</span
        >
        <strong className="block font-pixel text-[clamp(1.6rem,4vw,2.5rem)]"
          >${props.value}</strong
        >
        ${props.caption
          ? html`<small className="text-sm text-pokedex-muted"
              >${props.caption}</small
            >`
          : null}
      </article>
    `;
  }

  function SummaryPanel(props) {
    return html`<div className="grid gap-3 sm:grid-cols-2">
      ${props.items.map(
        (item) =>
          html`<${StatCard}
            key=${item.label}
            label=${item.label}
            value=${item.value}
            caption=${item.caption}
          />`,
      )}
    </div>`;
  }

  function DetailTile(props) {
    return html`
      <article className=${cx(theme.detailTile, props.className)}>
        <span
          className="block text-xs font-semibold uppercase tracking-[0.22em] text-pokedex-greenDark"
          >${props.label}</span
        >
        <strong className="mt-2 block font-pixel text-[2rem] leading-none"
          >${props.value}</strong
        >
        ${props.caption
          ? html`<p className="mt-2 text-sm leading-6 text-pokedex-muted">
              ${props.caption}
            </p>`
          : null}
      </article>
    `;
  }

  function SectionCard(props) {
    return html`
      <section className=${cx(theme.panel, props.className)}>
        <div
          className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"
        >
          <div>
            <span className=${theme.sectionOverline}
              >${props.overline || "Pokedex Market"}</span
            >
            <h2
              className="font-pixel text-[clamp(1.8rem,3vw,2.6rem)] leading-[0.95] tracking-[0.14em]"
            >
              ${props.title}
            </h2>
            ${props.subtitle
              ? html`<p className="mt-2 text-pokedex-muted">
                  ${props.subtitle}
                </p>`
              : null}
          </div>
          ${props.actions
            ? html`<div className="flex flex-wrap gap-3">${props.actions}</div>`
            : null}
        </div>
        ${props.children}
      </section>
    `;
  }

  function getTypeClasses(type) {
    const classes = {
      fire: "bg-[#ffe3b7]",
      electric: "bg-[#ffe3b7]",
      water: "bg-[#d8f4ff]",
      ice: "bg-[#d8f4ff]",
      psychic: "bg-[#d8f4ff]",
      grass: "bg-[#dcf8d8]",
      bug: "bg-[#dcf8d8]",
      poison: "bg-[#dcf8d8]",
      fairy: "bg-[#f3e5ff]",
      ghost: "bg-[#f3e5ff]",
      normal: "bg-[#f3e5ff]",
    };

    return classes[type] || "bg-pokedex-cardSoft";
  }

  function TypeBadge(props) {
    return html`<span
      className=${cx(
        "inline-flex items-center rounded-full border-2 border-pokedex-line px-3 py-1 font-pixel text-xl",
        getTypeClasses(props.type),
      )}
      >${capitalize(props.type)}</span
    >`;
  }

  function PokemonCard(props) {
    const pokemon = props.pokemon;
    const isFavorite = props.isFavorite;
    const isSoldOut = pokemon.stock <= 0;

    return html`
      <article
        className=${cx(
          "relative overflow-hidden border-[5px] border-pokedex-line bg-pokedex-card shadow-hard",
          props.viewMode === "list"
            ? "grid min-h-[320px] gap-0 xl:grid-cols-[minmax(250px,320px)_minmax(0,1fr)]"
            : "flex min-h-full flex-col",
        )}
      >
        <button
          className="absolute right-3 top-3 z-10 rounded-full border-[3px] border-pokedex-line bg-white/95 px-3 py-1 font-pixel text-xl transition hover:-translate-y-0.5"
          type="button"
          onClick=${() => props.onToggleFavorite(pokemon.id)}
        >
          ${isFavorite ? "Favorito" : "Salvar"}
        </button>

        <button
          className=${cx(
            "flex items-end justify-center overflow-hidden border-b-[5px] border-pokedex-line bg-[linear-gradient(180deg,#ffdd33_0%,#f6c92b_100%)] transition hover:-translate-y-0.5",
            props.viewMode === "list"
              ? "min-h-[280px] border-r-[5px] border-b-0 xl:min-h-full"
              : "min-h-[240px]",
          )}
          type="button"
          onClick=${() => props.onOpen(pokemon.id)}
        >
          <img
            className="max-h-[210px] w-[74%] translate-y-2 object-contain"
            src=${pokemon.image}
            alt=${pokemon.name}
          />
        </button>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div
            className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <span className=${theme.sectionOverline}>${pokemon.region}</span>
              <h2
                className="font-pixel text-[2.2rem] leading-[0.9] tracking-[-0.08em] text-pokedex-green"
              >
                ${pokemon.name}
              </h2>
            </div>
            <div className="font-pixel text-[2rem]">
              ${formatCurrency(pokemon.price)}
            </div>
          </div>

          <p className="min-h-[4.5rem] text-sm leading-6 text-pokedex-muted">
            ${pokemon.description}
          </p>

          <div className="grid gap-2">
            <strong className="font-pixel text-2xl">Espécie</strong>
            <div className="flex flex-wrap gap-2">
              <span
                className="rounded-full border-2 border-pokedex-line bg-pokedex-cardSoft px-3 py-1 font-pixel text-xl"
                >${pokemon.species}</span
              >
            </div>
          </div>

          <div className="grid gap-2">
            <strong className="font-pixel text-2xl">Tipo</strong>
            <div className="flex flex-wrap gap-2">
              ${pokemon.types.map(
                (type) => html`<${TypeBadge} key=${type} type=${type} />`,
              )}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div
              className="rounded-2xl border-2 border-black/10 bg-white/70 px-4 py-3"
            >
              <span className="block text-sm text-pokedex-muted">Raridade</span>
              <strong className="font-pixel text-2xl"
                >${capitalize(pokemon.rarity)}</strong
              >
            </div>
            <div
              className="rounded-2xl border-2 border-black/10 bg-white/70 px-4 py-3"
            >
              <span className="block text-sm text-pokedex-muted">Estoque</span>
              <strong className="font-pixel text-2xl">${pokemon.stock}</strong>
            </div>
          </div>

          ${props.ownedQuantity
            ? html`<div
                className="rounded-2xl border-2 border-black/10 bg-white/70 px-4 py-3"
              >
                <span className="block text-sm text-pokedex-muted"
                  >Na coleção</span
                ><strong className="font-pixel text-2xl"
                  >${props.ownedQuantity}</strong
                >
              </div>`
            : null}

          <div className="mt-auto flex flex-wrap gap-3">
            <button
              className=${theme.buttonOutline}
              type="button"
              onClick=${() => props.onOpen(pokemon.id)}
            >
              Ver detalhe
            </button>
            <button
              className=${theme.buttonSolid}
              type="button"
              disabled=${isSoldOut}
              onClick=${() => props.onAdd(pokemon.id)}
            >
              ${isSoldOut ? "Esgotado" : "Adicionar"}
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function EmptyState(props) {
    return html`
      <div
        className="rounded-[20px] border-2 border-dashed border-black/20 bg-white/75 px-6 py-8 text-center shadow-panel"
      >
        <h3 className="font-pixel text-4xl">${props.title}</h3>
        <p className="mt-3 text-pokedex-muted">${props.message}</p>
        ${props.action
          ? html`<div className="mt-6 flex flex-wrap justify-center gap-3">
              ${props.action}
            </div>`
          : null}
      </div>
    `;
  }

  function ProductModal(props) {
    const pokemon = props.pokemon;
    if (!pokemon) {
      return null;
    }

    return html`
      <div
        className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
        onClick=${props.onClose}
      >
        <div
          className=${cx(
            theme.panel,
            "max-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-auto",
          )}
          onClick=${(event) => event.stopPropagation()}
        >
          <div className="mb-4 flex justify-end">
            <button
              className=${theme.buttonOutline}
              type="button"
              onClick=${props.onClose}
            >
              Fechar
            </button>
          </div>
          <div
            className="grid gap-4 xl:grid-cols-[minmax(280px,.9fr)_minmax(0,1.1fr)]"
          >
            <div
              className="flex min-h-[360px] items-center justify-center rounded-[28px] border-4 border-pokedex-line bg-[linear-gradient(180deg,#ffdd33_0%,#fff1a5_100%)]"
            >
              <img
                className="w-[min(80%,320px)] object-contain"
                src=${pokemon.image}
                alt=${pokemon.name}
              />
            </div>
            <div className="grid gap-4">
              <span className=${theme.sectionOverline}>${pokemon.region}</span>
              <h2
                className="font-pixel text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-[0.14em]"
              >
                ${pokemon.name}
              </h2>
              <p className="text-pokedex-muted">${pokemon.description}</p>
              <div className="flex flex-wrap gap-2">
                ${pokemon.types.map(
                  (type) => html`<${TypeBadge} key=${type} type=${type} />`,
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <${StatCard} label="HP" value=${pokemon.stats.hp} />
                <${StatCard} label="ATK" value=${pokemon.stats.attack} />
                <${StatCard} label="DEF" value=${pokemon.stats.defense} />
                <${StatCard} label="SPD" value=${pokemon.stats.speed} />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  className=${theme.buttonOutline}
                  type="button"
                  onClick=${() => props.onToggleFavorite(pokemon.id)}
                >
                  ${props.isFavorite ? "Remover favorito" : "Favoritar"}
                </button>
                <button
                  className=${theme.buttonSolid}
                  type="button"
                  onClick=${() => props.onAdd(pokemon.id)}
                >
                  Comprar por ${formatCurrency(pokemon.price)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function CartRow(props) {
    const item = props.item;

    return html`
      <article
        className="grid gap-4 rounded-[20px] border-[3px] border-black/15 bg-white/80 p-4 shadow-panel xl:grid-cols-[96px_minmax(0,1fr)_auto_auto_auto] xl:items-center"
      >
        <img
          className="h-24 w-24 rounded-[18px] bg-[linear-gradient(180deg,#ffe87a_0%,#fff9df_100%)] object-contain"
          src=${item.image}
          alt=${item.name}
        />
        <div className="grid gap-2">
          <h3 className="font-pixel text-4xl">${item.name}</h3>
          <p className="text-pokedex-muted">${item.species}</p>
          <div className="flex flex-wrap gap-2">
            ${item.types.map(
              (type) => html`<${TypeBadge} key=${type} type=${type} />`,
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border-[3px] border-pokedex-line bg-white/85 font-pixel text-3xl transition hover:-translate-y-0.5"
            onClick=${() => props.onDecrease(item.id)}
          >
            -
          </button>
          <span className="font-pixel text-3xl">${item.quantity}</span>
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border-[3px] border-pokedex-line bg-white/85 font-pixel text-3xl transition hover:-translate-y-0.5"
            onClick=${() => props.onIncrease(item.id)}
          >
            +
          </button>
        </div>
        <strong className="font-pixel text-[2rem]"
          >${formatCurrency(item.lineTotal)}</strong
        >
        <button
          className=${theme.buttonGhost}
          type="button"
          onClick=${() => props.onRemove(item.id)}
        >
          Remover
        </button>
      </article>
    `;
  }

  function OrderCard(props) {
    const order = props.order;

    return html`
      <article
        className="grid gap-4 rounded-[20px] border-[3px] border-black/15 bg-white/80 p-4 shadow-panel"
      >
        <div
          className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between"
        >
          <div>
            <strong className="font-pixel text-3xl">${order.id}</strong>
            <p className="text-pokedex-muted">${formatDate(order.createdAt)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <${StatusBadge} status=${order.status} variant=${order.status} />
            ${order.paymentStatus
              ? html`<${StatusBadge}
                  status=${order.paymentStatus}
                  variant=${order.paymentStatus}
                />`
              : null}
          </div>
        </div>
        ${order.userName
          ? html`<p className="text-pokedex-muted">
              ${order.userName} • ${order.userEmail}
            </p>`
          : null}
        <div className="grid gap-2">
          ${order.items.map(
            (item) =>
              html`<div
                className="flex flex-col gap-1 rounded-2xl bg-white/70 px-4 py-3 xl:flex-row xl:items-center xl:justify-between"
                key=${order.id + "-" + item.id}
              >
                <span>${item.quantity}x ${item.name}</span
                ><strong className="font-pixel text-2xl"
                  >${formatCurrency(item.quantity * item.price)}</strong
                >
              </div>`,
          )}
        </div>
        <div
          className="flex flex-col gap-1 border-t-2 border-dashed border-black/15 pt-3 xl:flex-row xl:items-center xl:justify-between"
        >
          <span>Total</span
          ><strong className="font-pixel text-3xl"
            >${formatCurrency(order.total)}</strong
          >
        </div>
      </article>
    `;
  }

  window.PokedexTheme = theme;
  window.PokedexUI = {
    CartRow,
    DetailTile,
    EmptyState,
    OrderCard,
    PokemonCard,
    ProductModal,
    SectionCard,
    SiteLayout,
    StatCard,
    StatusBadge,
    SummaryPanel,
    TypeBadge,
    buttonClass,
    capitalize,
    cx,
    formatCurrency,
    getStatusLabel,
    html,
    routeHref,
    theme,
    useStore,
  };
})();
