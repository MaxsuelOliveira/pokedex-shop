# Arquitetura do sistema

## Visao geral

O projeto combina uma camada React moderna em src com uma camada de dominio e persistencia legada em assets/js. O React nao gerencia o estado principal da aplicacao diretamente; em vez disso, ele observa o store global exposto em window.PokedexStore por meio de hooks adaptadores em src/lib.

## Camadas

### 1. Bootstrap e persistencia local

- assets/js/data/pokemon-seed.js define o catalogo seed usado no bootstrap e no fallback.
- assets/js/core/storage.js cria o estado inicial e persiste a aplicacao no localStorage pela chave pokedex-marketplace-state-v1.

Responsabilidades:

- carregar ou reconstruir o estado salvo;
- definir usuarios demo;
- preparar catalogo inicial, carrinhos, favoritos, sessao e UI;
- garantir que erros de parsing limpem o estado corrompido.

### 2. Integracao de catalogo

- assets/js/core/services.js conversa com a PokeAPI.

Responsabilidades:

- buscar lista e detalhes de Pokemons;
- enriquecer o retorno remoto com preco, estoque, raridade e descricao;
- usar cache com TTL de 6 horas;
- cair para cache expirado ou seed local quando a API falha.

### 3. Store global e regras de negocio

- assets/js/core/store.js expone window.PokedexStore.

Responsabilidades:

- armazenar o estado fonte da aplicacao;
- recalcular dados derivados como visibleCatalog, cartTotals, pendingOrders e usersSummary;
- expor actions como login, register, addToCart, checkout, approveOrder e refreshCatalog;
- publicar atualizacoes para a camada React via subscribe/getSnapshot.

### 4. Adaptadores React

- src/lib/store.js usa React.useSyncExternalStore para ligar o React ao store global.
- src/lib/useAuth.js agrupa sessao, perfil e acoes de autenticacao.
- src/lib/useCart.js agrupa carrinho, totais, pedidos e acoes de checkout.
- src/lib/useCatalog.js agrupa catalogo, filtros, favoritos, metadados de sincronizacao e acoes de busca.

Esses hooks funcionam como fachada da camada React para a regra de negocio legada.

### 5. Interface React

- src/App.jsx centraliza as rotas.
- src/pages contem as telas por fluxo.
- src/components contem os blocos reutilizaveis de interface.

Padrao visual predominante:

- layout unificado via SiteLayout;
- metricas em SummaryPanel e StatCard;
- estados vazios em EmptyState;
- feedbacks operacionais em FeedbackBanner;
- cards de Pokemon, pedido e carrinho para apresentacao detalhada.

## Fluxo de inicializacao

1. index.html carrega src/main.jsx.
2. src/main.jsx importa, nesta ordem, pokemon-seed.js, storage.js, services.js e store.js.
3. O store inicializa e dispara refreshCatalog().
4. React monta App e resolve a rota atual a partir de window.location.hash.
5. Hooks observam o snapshot e reagem a cada atualizacao do store.

## Modelo de estado

Principais grupos de estado:

- catalog: catalogo ativo exibido pela loja.
- catalogCache: itens salvos, timestamp e origem da sincronizacao.
- users: contas locais com perfil, senha e inventario.
- session: usuario autenticado no momento.
- orders: historico de pedidos.
- cartsByUser: carrinho isolado por usuario.
- favoritesByUser: favoritos isolados por usuario.
- ui: busca, ordenacao, tipo selecionado e modo de visualizacao.
- meta: loading, origem e erro do catalogo.

## Paginas e responsabilidades

- AppPage: vitrine inicial, destaques, atalhos e colecao resumida.
- ShopPage: busca, filtros, alternancia de grade/lista e modal do produto.
- CartPage: ajustes de quantidade, totais e checkout.
- AuthPage: login demo e criacao de conta local.
- ProfilePage: edicao do perfil, wishlist, colecao e historico.
- AdminPage: aprovacao, rejeicao e visao administrativa do sistema.

## Decisoes tecnicas importantes

- O roteamento usa hash local sem dependencia externa para simplificar hospedagem estatica sem configuracao adicional de rewrite.
- Os imports internos de src ficaram sem extensao para desacoplar a camada React de futuras renomeacoes.
- Os modulos em assets/js permanecem em .js porque sao modulos de dominio e bootstrap, nao componentes JSX.
- O build continua estatico e compativel com Netlify.
