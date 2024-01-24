export interface CartState {
  cartIsOpen: boolean;
	cart_data?:{
		product_id:number,
		quantity:number
	}
}

const initialState: CartState = {
  cartIsOpen: false,
	cart_data:undefined
};

export const cartReducer = (state = initialState, action: any): CartState => {
  switch (action.type) {
    case 'OPEN_CART':
      return { ...state, cartIsOpen: true, cart_data: action.payload};
    case 'CLOSE_CART':
      return { ...state, cartIsOpen: false };
    default:
      return state;
  }
};

