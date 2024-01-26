import { configureStore } from '@reduxjs/toolkit'
import {cartReducer} from '../reducers/cartReducers';
import { orderDetailsReducer } from '../reducers/orderDetails'

const store = configureStore({
	reducer:{
		cart:cartReducer,
		order_details:orderDetailsReducer
	}
});

export default store;


// {
//   order_id: 160,
//   customer_id: 78,
//   order_date: 2024-01-26T14:58:45.000Z,
//   delivery_type_id: 2,
//   address: { city: 'dfsdfdf', house: 'sdfs', street: 'sdf', zip_code: 'sdfsdf' },
//   total_price: 45,
//   customer_info: {
//     first_name: 'Admin-Name',
//     last_name: 'Admin-Surname',
//     tel_number: '+38(099)999-99-99'
//   },
//   delivery_type: 'Поштомат',
//   products: [
//     {
//       product_name: 'Серветка "Люксоптика" коричнева',
//       quantity: 1,
//       subtotal: 45
//     }
//   ]
// }