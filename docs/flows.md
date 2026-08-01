# Fluxos do sistema

## Catalogo remoto com fallback

1. src/main.jsx carrega os modulos legados em assets/js antes de montar o React.
2. assets/js/data/pokemon-seed.js define o catalogo de bootstrap em window.PokedexSeed.
3. assets/js/core/storage.js cria o estado inicial e persiste tudo no localStorage.
4. assets/js/core/services.js tenta buscar dados da PokeAPI, usa cache quando possivel e cai para fallback quando necessario.
5. assets/js/core/store.js normaliza a resposta e expoe o snapshot reativo em window.PokedexStore.
6. src/lib/useCatalog.js consome esse snapshot e alimenta as paginas AppPage e ShopPage.

Prioridade de origem do catalogo:

- remote: chamada atual da PokeAPI.
- cache: cache fresco do localStorage.
- cache-stale: cache expirado usado como contingencia.
- fallback: seed local quando nao existe resposta remota valida.
- bootstrap: seed inicial carregado antes da primeira sincronizacao.

## Autenticacao e papeis

Credenciais locais padrao:

- Cliente: treinador@localhost / pikachu123
- Admin: admin@localhost / master123

Fluxo:

1. AuthPage envia credenciais para useAuth().
2. useAuth() chama actions.login do store.
3. O store localiza o usuario em state.users e define session.currentUserId.
4. O snapshot passa a expor currentUser, isAuthenticated, isAdmin e profile.
5. Cada usuario autenticado possui carrinho, favoritos e inventario proprios.

Registro local:

1. AuthPage envia o formulario para actions.register.
2. O store valida nome, email e senha e impede email duplicado.
3. Um novo usuario customer e criado com saldo inicial local.
4. O novo usuario passa a ser a sessao ativa.

## Carrinho e checkout

Fluxo do carrinho:

1. PokemonCard e ProductModal chamam addToCart.
2. O store valida existencia do item, estoque e limite por quantidade.
3. O item entra em cartsByUser[currentUserId].
4. CartPage exibe cartDetailed e cartTotals derivados do snapshot.

Fluxo do checkout:

1. CartPage chama checkout().
2. O store bloqueia visitantes e carrinho vazio.
3. O store valida se as quantidades nao excedem o estoque atual.
4. Um pedido e criado com status pending_review, paymentStatus awaiting_admin e fulfillmentStatus awaiting_approval.
5. O carrinho do usuario e limpo apos a criacao do pedido.

## Aprovacao administrativa

1. AdminPage lista apenas pedidos com status pending_review.
2. approveOrder valida permissao admin, existencia do pedido, saldo do cliente e estoque disponivel.
3. Quando aprovado, o saldo do cliente e debitado, o estoque e consumido e o inventario do usuario recebe os Pokemons.
4. O pedido muda para approved, paymentStatus captured e fulfillmentStatus delivered.
5. rejectOrder apenas marca o pedido como rejected, denied e cancelled.

## Perfil e inventario

1. ProfilePage consome useAuth(), useCatalog() e useStoreSnapshot().
2. O formulario atualiza name, email, city, favoriteType, balance e bio do usuario atual.
3. A wishlist e derivada de favoritesByUser.
4. O inventario mostra apenas os Pokemons entregues por pedidos aprovados.
5. O historico filtra orders pelo usuario autenticado.

## Favoritos e filtros

Favoritos:

1. PokemonCard e ProductModal chamam toggleFavorite.
2. O store adiciona ou remove o id em favoritesByUser[currentUserId].
3. ProfilePage e paginas de catalogo refletem a mudanca imediatamente.

Filtros do catalogo:

1. ShopPage atualiza search, selectedType, sortBy e viewMode.
2. O store recalcula visibleCatalog em tempo real.
3. Os cards podem alternar entre visualizacao em grade e lista.
