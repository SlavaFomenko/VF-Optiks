export interface CartState {
  orderDetailsIsOpen: boolean;
	order_details?:{
		order_id:number,
	}
}

const initialState: CartState = {
  orderDetailsIsOpen: false,
	order_details:undefined
};

export const orderDetailsReducer = (state = initialState, action: any): CartState => {
  switch (action.type) {
    case 'OPEN_ORDER_DETAILS':
      return { ...state,orderDetailsIsOpen: true, order_details: action.payload};
    case 'CLOSE_ORDER_DETAILS':
      return { ...state, orderDetailsIsOpen: false };
    default:
      return state;
  }
};

