import { useStoreActions, useStoreSnapshot } from "./store";

export function useCart() {
  const actions = useStoreActions();
  const state = useStoreSnapshot((snapshot) => ({
    sessionInfo: snapshot,
    cart: snapshot.cart,
    cartDetailed: snapshot.cartDetailed,
    cartTotals: snapshot.cartTotals,
    orders: snapshot.orders,
    stats: snapshot.stats,
  }));

  return {
    ...state,
    addToCart: actions.addToCart,
    clearCart: actions.clearCart,
    checkout: actions.checkout,
    decreaseQuantity: actions.decreaseQuantity,
    removeFromCart: actions.removeFromCart,
  };
}
