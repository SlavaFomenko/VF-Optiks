export const openCart = (cartData?: { product_id: number; quantity: number }) => ({
  type: 'OPEN_CART',
  payload: cartData,
});

export const closeCart = () => ({
  type: 'CLOSE_CART',
});
