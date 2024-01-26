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