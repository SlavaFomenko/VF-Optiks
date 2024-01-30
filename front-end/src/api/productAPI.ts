import axios, { AxiosError, AxiosResponse } from 'axios'
import {URL_PRODUCTS } from '../config/config'

interface Image {
  image_id: number
  image_url: string
}

type Gender = 'Чоловічі' | 'Жіночі' | 'Унісекс'

interface Product {
  id: number
  name: string
  category: string
  gender: Gender
  manufacturer: string
  country: string
  price: number
  quantity: number
  images: Image[] | [] // Массив изображений, который может быть пустым
}

export const getProduct = async (
	page:number,
	limit:number,
	token?:string,
  id?: number,
  name?: string,
  category?: string[],
  gender?: Gender[],
  manufacturer?: string[],
  country?: string[],
	priceFrom?:number,
	priceTo?:number,
	priceInDescendingOrder?:boolean,
): Promise<Product[] | number> => {


  try {
    const response: AxiosResponse<Product[]> = await axios.get(URL_PRODUCTS, {
      params: {
        id: id,
				page:page,
				pageSize:limit,
        name: name,
        category: category,
        gender: gender,
        manufacturer: manufacturer,
        country: country,
        priceFrom:priceFrom,
				priceTo:priceTo,
				priceInDescendingOrder:priceInDescendingOrder
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    // console.log(response);
    
		// console.log(response.data);
		
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

// export const patchCustomer = async (
//   token: string,
//   data: object, //проблема типизиции **** из *****
//   customer_id: number,
// ): Promise<CustomerInterface | number> => {
//   try {
//     console.log(data)

//     const response: AxiosResponse<CustomerInterface> = await axios.patch(
//       URL_CUSTOMERS + `/${customer_id}`,
//       data,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json', // указание типа контента
//         },
//       },
//     )
//     return response.data
//   } catch (error: AxiosError | any) {
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError
//       if (axiosError.response) {
//         return axiosError.response.status
//       }
//     }
//     console.error('Error:', error)
//     return 500
//   }
// }

// export const deleteCustomer = async (
//   token: string,
//   id: number,
// ): Promise<number> => {
//   try {
//     const response: AxiosResponse<number> = await axios.delete(
//       URL_CUSTOMERS + `/${id}`,
//       { headers: { Authorization: `Bearer ${token}` } },
//     )
//     console.log(response)

//     return response.status
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError
//       if (axiosError.response) {
//         return axiosError.response.status
//       }
//     }
//     console.error('Error:', error)
//     return 500
//   }
// }

// interface PostCustomer {
//   name: string
//   country: string
// }

// export const postCustomer = async (
//   token: string,
//   data: PostCustomer,
// ): Promise<CustomerInterface | number> => {
//   try {
//     console.log(token)

//     const response: AxiosResponse<CustomerInterface> = await axios.post(
//       URL_CUSTOMERS,
//       data,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json', // указание типа контента
//         },
//       },
//     )
//     // console.log(response);

//     return response.data
//   } catch (error: AxiosError | any) {
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError
//       if (axiosError.response) {
//         return axiosError.response.status
//       }
//     }
//     console.error('Error:', error)
//     return 500
//   }
// }
