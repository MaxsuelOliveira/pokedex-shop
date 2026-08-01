import { buttonClass, capitalize, cx, routeHref, theme } from "../lib/runtime";
import StatusBadge from "./StatusBadge";

function NavigationLink({ href, active, children }) {
  return (
    <a className={active ? theme.navLinkActive : theme.navLink} href={href}>
      {children}
    </a>
  );
}

export default function SiteLayout({
  currentPage,
  sessionInfo = {},
  catalogSource,
  onLogout,
  title,
  subtitle,
  actions,
  aside,
  children,
}) {
  return (
    <main className={theme.shell}>
      <div className="pointer-events-none absolute inset-x-8 top-0 -z-10 h-[280px] rounded-b-[56px] bg-[radial-gradient(circle_at_top,rgba(125,168,195,0.26),transparent_58%)] blur-3xl" />
      <header className="mb-10 grid gap-5">
        <div className={cx(theme.panel, "px-4 py-4 md:px-6")}>
          <div className="absolute left-6 top-0 h-24 w-24 rounded-full bg-[#d8e8f5] blur-3xl" />
          <div className="absolute right-10 top-3 h-20 w-20 rounded-full bg-[#edf5fb] blur-3xl" />
          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.36em] text-pokedex-muted">
                Pokédex Shop
              </span>
              <a
                className="font-pixel text-[clamp(2.8rem,7vw,5rem)] leading-none [text-shadow:3px_3px_rgba(242,106,75,0.2)]"
                href={routeHref("app")}
              >
                Pokédex
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {catalogSource ? <StatusBadge status={catalogSource} /> : null}
              {sessionInfo.isAuthenticated && onLogout ? (
                <button
                  className={buttonClass("outline")}
                  onClick={onLogout}
                  type="button"
                >
                  Sair
                </button>
              ) : (
                <a className={buttonClass("outline")} href={routeHref("auth")}>
                  Entrar
                </a>
              )}
            </div>
          </div>

          <nav className="relative mt-5 flex flex-nowrap gap-3 overflow-x-auto pb-1 xl:flex-wrap xl:overflow-visible">
            <NavigationLink
              active={currentPage === "app"}
              href={routeHref("app")}
            >
              App
            </NavigationLink>
            <NavigationLink
              active={currentPage === "shop"}
              href={routeHref("shop")}
            >
              Loja
            </NavigationLink>
            <NavigationLink
              active={currentPage === "cart"}
              href={routeHref("cart")}
            >
              Carrinho
            </NavigationLink>
            <NavigationLink
              active={currentPage === "profile"}
              href={routeHref("profile")}
            >
              Perfil
            </NavigationLink>
            {sessionInfo.isAdmin ? (
              <NavigationLink
                active={currentPage === "admin"}
                href={routeHref("admin")}
              >
                Admin
              </NavigationLink>
            ) : null}
            <NavigationLink
              active={currentPage === "auth"}
              href={routeHref("auth")}
            >
              {sessionInfo.isAuthenticated ? "Conta" : "Entrar"}
            </NavigationLink>
          </nav>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.95fr)]">
          <div className={theme.heroCopy}>
            <div className="absolute -right-12 -top-8 h-36 w-36 rounded-full bg-white/40 blur-3xl" />
            <div className="absolute bottom-0 left-8 h-24 w-24 rounded-full bg-pokedex-cyanSoft/70 blur-2xl" />
            <div className="relative">
              <div className="mb-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full border border-pokedex-line/10 bg-white/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-pokedex-muted">
                  Interface em coleção
                </span>
                <span className="inline-flex items-center rounded-full border border-pokedex-line/10 bg-white/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-pokedex-muted">
                  {sessionInfo.currentUser
                    ? `${sessionInfo.currentUser.name} - ${capitalize(sessionInfo.currentUser.role)}`
                    : "Visitante"}
                </span>
              </div>
              <span className={theme.sectionOverline}>
                Marketplace local-first
              </span>
              <h1 className="mb-4 font-pixel text-[clamp(3rem,8vw,6.6rem)] font-bold leading-[0.92] tracking-[0.1em] [text-shadow:3px_3px_rgba(242,106,75,0.18)]">
                {title}
              </h1>
              <p className="max-w-[58ch] text-base leading-7 text-pokedex-muted md:text-lg">
                {subtitle}
              </p>
              {actions ? (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {actions}
                </div>
              ) : null}
            </div>
          </div>
          <div className={cx(theme.panel, "p-5")}>{aside}</div>
        </div>
      </header>

      <section className="grid gap-4">{children}</section>
    </main>
  );
}
