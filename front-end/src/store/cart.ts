import { configureStore } from '@reduxjs/toolkit'
import {cartReducer} from '../reducers/cartReducers';

const store = configureStore({
	reducer:{
		cart:cartReducer
	}
});

export default store;