import axios, { AxiosError, AxiosResponse } from 'axios'
import { URL_CUSTOMERS } from '../config/config'

export interface CustomerInterface {
  customer_id: number | string
  login: string
  first_name: string
  last_name: string
  tel_number: string
  role: 'user' | 'admin'
}

interface data {
  role: string[]
}

export const getCustomer = async (
  token: string,
  id?: string,
  login?: string,
  role?: data,
): Promise<CustomerInterface[] | number> => {
  const params = {
    id: id,
    login: login,
    role: role?.['role'],
  }

  try {
    const response: AxiosResponse<CustomerInterface[]> = await axios.get(
      URL_CUSTOMERS,
      {
        params: {
          id: id,
          login: login,
          role: role?.['role'],
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', 
        },
      },
    )
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

export const patchCustomer = async (
  data: object, //проблема типизиции **** из *****
  customer_id: number,
  token: string,
): Promise<CustomerInterface | number> => {
  try {
    const response: AxiosResponse<CustomerInterface> = await axios.patch(
      URL_CUSTOMERS + `/${customer_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // указание типа контента
        },
      },
    )
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

export const deleteCustomer = async (
  id: number,
  token: string,
): Promise<number> => {
  try {
    const response: AxiosResponse<number> = await axios.delete(
      URL_CUSTOMERS + `/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    
    return response.status
  } catch (error) {
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

interface PostCustomer {
  name: string
  country: string
}

export const postCustomer = async (
  data: PostCustomer,
  token: string,
): Promise<CustomerInterface | number> => {
  try {
    const response: AxiosResponse<CustomerInterface> = await axios.post(
      URL_CUSTOMERS,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // указание типа контента
        },
      },
    )
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
