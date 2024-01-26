export const openOrderDetails = (orderData?: { order_id:number;}) => ({
  type: 'OPEN_ORDER_DETAILS',
  payload: orderData,
});

export const closeOrderDetails = () => ({
  type: 'CLOSE_ORDER_DETAILS',
});
