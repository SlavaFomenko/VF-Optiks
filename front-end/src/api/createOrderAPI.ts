import axios, { AxiosError, AxiosResponse } from 'axios'
import { URL_ORDERS } from '../config/config'

interface address {
  // дописать )
}

export const CreateOrder = async (token: string, order_id: number, delivery_type_id: number, address: address) => {
  try {
    const responce: AxiosResponse<{}> = await axios.patch(URL_ORDERS + `/${order_id}`, {
      status_id: 2,
      delivery_type_id: delivery_type_id,
      address: address,
    })

    // console.log(responce)
    return responce.data
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
