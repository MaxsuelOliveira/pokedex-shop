import React from "react";
import AccountStatusStrip from "../components/AccountStatusStrip";
import EmptyState from "../components/EmptyState";
import FeedbackBanner from "../components/FeedbackBanner";
import SectionCard from "../components/SectionCard";
import SiteLayout from "../components/SiteLayout";
import SummaryPanel from "../components/SummaryPanel";
import { buttonClass, theme } from "../lib/runtime";
import { useAuth } from "../lib/useAuth";

export default function AuthPage() {
  const auth = useAuth();
  const [loginState, setLoginState] = React.useState({
    email: auth.authPresets.customer.email,
    password: auth.authPresets.customer.password,
  });
  const [registerState, setRegisterState] = React.useState({
    name: "",
    email: "",
    password: "",
    city: "",
    favoriteType: "normal",
    balance: 180,
    bio: "",
  });
  const [feedback, setFeedback] = React.useState("");

  const asideStats = [
    {
      label: "Sessão",
      value: auth.isAuthenticated ? "Ativa" : "Visitante",
      caption: auth.currentUser ? auth.currentUser.email : "sem login",
    },
    {
      label: "Perfil",
      value: auth.currentUser ? auth.currentUser.role : "guest",
      caption: "cliente ou admin",
    },
    {
      label: "Pendentes",
      value: auth.stats.pendingOrderCount,
      caption: "pedidos globais",
    },
    {
      label: "Coleção",
      value: auth.stats.inventoryCount,
      caption: "do usuário atual",
    },
  ];

  const accountStrip = auth.isAuthenticated
    ? [
        {
          label: "Conta",
          value: auth.currentUser.name,
          caption: auth.currentUser.email,
        },
        {
          label: "Papel",
          value: auth.currentUser.role === "admin" ? "Admin" : "Cliente",
          caption: "sessão local ativa",
        },
        {
          label: "Saldo",
          value: auth.profile.balance,
          caption: "carteira disponível",
        },
      ]
    : [];

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginState((currentState) => ({ ...currentState, [name]: value }));
  }

  function handleRegisterChange(event) {
    const { name, value } = event.target;
    setRegisterState((currentState) => ({ ...currentState, [name]: value }));
  }

  function submitLogin(event) {
    event.preventDefault();
    const result = auth.login(loginState);
    setFeedback(result.message);
  }

  function submitRegister(event) {
    event.preventDefault();
    const result = auth.register(registerState);
    setFeedback(result.message);
  }

  return (
    <SiteLayout
      currentPage="auth"
      sessionInfo={auth.sessionInfo}
      catalogSource={auth.sessionInfo.meta?.catalogSource}
      onLogout={auth.logout}
      title="Conta e acesso"
      subtitle="Entre como cliente ou administrador, ou crie uma conta local para continuar seu fluxo de compra sem telas repetidas nem passos desnecessários."
      actions={
        <>
          <button
            className={buttonClass("outline")}
            onClick={() => setLoginState(auth.authPresets.customer)}
            type="button"
          >
            Usar cliente demo
          </button>
          <button
            className={buttonClass("solid")}
            onClick={() => setLoginState(auth.authPresets.admin)}
            type="button"
          >
            Usar admin demo
          </button>
        </>
      }
      aside={<SummaryPanel items={asideStats} />}
    >
      <FeedbackBanner message={feedback} />
      {auth.isAuthenticated ? (
        <SectionCard
          title="Conta atual"
          subtitle="Sua sessão já está pronta. Se quiser, troque rapidamente para outro perfil de teste ou ajuste seus dados no perfil."
        >
          <AccountStatusStrip items={accountStrip} />
        </SectionCard>
      ) : (
        <EmptyState
          title="Visitante"
          message="Use um dos formulários abaixo para iniciar uma sessão ou criar uma conta."
        />
      )}

      <div className={theme.dashboardColumns}>
        <SectionCard
          className="min-h-full"
          title="Entrar"
          subtitle="Use uma conta de teste ou informe suas credenciais locais."
        >
          <form className="grid gap-5" onSubmit={submitLogin}>
            <label className={theme.fieldGroup}>
              <span className={theme.fieldLabel}>E-mail</span>
              <input
                className={theme.fieldControl}
                name="email"
                onChange={handleLoginChange}
                placeholder="treinador@localhost"
                type="email"
                value={loginState.email}
              />
              <span className={theme.fieldHint}>
                Use a conta demo ou suas credenciais locais.
              </span>
            </label>
            <label className={theme.fieldGroup}>
              <span className={theme.fieldLabel}>Senha</span>
              <input
                className={theme.fieldControl}
                name="password"
                onChange={handleLoginChange}
                placeholder="Sua senha"
                type="password"
                value={loginState.password}
              />
              <span className={theme.fieldHint}>
                A sessão muda imediatamente após a autenticação.
              </span>
            </label>
            <div className={theme.formCard}>
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-pokedex-muted">
                Acessos rápidos
              </div>
              <p className="mt-2 text-sm leading-6 text-pokedex-muted">
                Cliente: {auth.authPresets.customer.email} /{" "}
                {auth.authPresets.customer.password}
              </p>
              <p className="text-sm leading-6 text-pokedex-muted">
                Admin: {auth.authPresets.admin.email} /{" "}
                {auth.authPresets.admin.password}
              </p>
            </div>
            <div className="flex justify-end">
              <button className={buttonClass("solid")} type="submit">
                Entrar
              </button>
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Criar conta"
          subtitle="O cadastro já cria um perfil local com saldo inicial, cidade e preferências básicas."
        >
          <form className="grid gap-5" onSubmit={submitRegister}>
            <div className="grid gap-5 md:grid-cols-2">
              <label className={theme.fieldGroup}>
                <span className={theme.fieldLabel}>Nome</span>
                <input
                  className={theme.fieldControl}
                  name="name"
                  onChange={handleRegisterChange}
                  placeholder="Seu nome de treinador"
                  type="text"
                  value={registerState.name}
                />
              </label>
              <label className={theme.fieldGroup}>
                <span className={theme.fieldLabel}>E-mail</span>
                <input
                  className={theme.fieldControl}
                  name="email"
                  onChange={handleRegisterChange}
                  placeholder="email@exemplo.com"
                  type="email"
                  value={registerState.email}
                />
              </label>
              <label className={theme.fieldGroup}>
                <span className={theme.fieldLabel}>Senha</span>
                <input
                  className={theme.fieldControl}
                  name="password"
                  onChange={handleRegisterChange}
                  placeholder="Defina uma senha"
                  type="password"
                  value={registerState.password}
                />
              </label>
              <label className={theme.fieldGroup}>
                <span className={theme.fieldLabel}>Cidade</span>
                <input
                  className={theme.fieldControl}
                  name="city"
                  onChange={handleRegisterChange}
                  placeholder="Sua cidade"
                  type="text"
                  value={registerState.city}
                />
              </label>
              <label className={theme.fieldGroup}>
                <span className={theme.fieldLabel}>Tipo favorito</span>
                <input
                  className={theme.fieldControl}
                  name="favoriteType"
                  onChange={handleRegisterChange}
                  placeholder="electric, fire, water..."
                  type="text"
                  value={registerState.favoriteType}
                />
              </label>
              <label className={theme.fieldGroup}>
                <span className={theme.fieldLabel}>Saldo inicial</span>
                <input
                  className={theme.fieldControl}
                  min="0"
                  name="balance"
                  onChange={handleRegisterChange}
                  step="0.01"
                  type="number"
                  value={registerState.balance}
                />
              </label>
            </div>
            <label className={theme.fieldGroup}>
              <span className={theme.fieldLabel}>Bio</span>
              <textarea
                className={`${theme.fieldControl} ${theme.textarea}`}
                name="bio"
                onChange={handleRegisterChange}
                placeholder="Conte um pouco sobre seu estilo de treinador."
                value={registerState.bio}
              />
              <span className={theme.fieldHint}>
                Esse texto fica salvo no seu perfil local.
              </span>
            </label>
            <div className="flex justify-end">
              <button className={buttonClass("solid")} type="submit">
                Criar conta
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </SiteLayout>
  );
}
