import axios, { AxiosError, AxiosResponse } from 'axios'
import { URL_ORDERS } from '../config/config'

interface Order {
  id: number
  customer_id: number
  customerLogin: string
  status: string
  address: string | null
  deliveryType: string | null
  createOrderDate: string
  totalPrice: number
  cart: CartItem[]
}

interface CartItem {
  name: string
  price: number
  quantity: number
  id_product: number
}

export const addToCart = async (customer_id:number,login: string, product_id: number, quantity: number): Promise<Order[] | number> => {
  try {
    console.log(login);
    
    const { data }: AxiosResponse<Order[] | []> = await axios.get(URL_ORDERS, {
      params: {
        user: login,
        status: 'Новий',
      },
    })
    console.log(data)

    if (data.length > 0) {
      const {status}: AxiosResponse<Order[] | {}> = await axios.patch(URL_ORDERS + `/${data[0].id}`, {
        order_details: [
          {
            product_id: product_id,
            quantity: quantity,
          },
        ],
      })

    } else {
      console.log('hello');
			const {status}: AxiosResponse<Order[] | {}> = await axios.post(URL_ORDERS , {
        customer_id:customer_id,
        order_details: [
          {
            product_id: product_id,
            quantity: quantity,
          },
        ],
      })
		}

    const res = await axios.get(URL_ORDERS, {
      params: {
        user: 'admin',
        status: 'Новий',
      },
    })

    return res.data
  } catch (error: AxiosError | any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response) {
        return axiosError.response.status
      }
    }
    console.error('Error:', error)
    return 500
  }
}
export const getCart = async (login:string): Promise<Order[] | number> => {
  try {
    console.log(login);
    
    const response: AxiosResponse<Order[] | []> = await axios.get(URL_ORDERS,{params:{
      user:login,
      status:'Новий'
    }})
    
    console.log(response);

    return response.data
  } catch (error: AxiosError | any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response) {
        return axiosError.response.status
      }
    }
    console.error('Error:', error)
    return 500
  }
}
