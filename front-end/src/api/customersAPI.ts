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
  ['Ролі']: string[]
}

export const getCustomer = async (
  token: string,
  id?: string,
  login?: string,
  role?: data,
): Promise<CustomerInterface[] | number> => {
  console.log(role);
  

  try {
    const response: AxiosResponse<CustomerInterface[]> = await axios.get(
      URL_CUSTOMERS,
      {
        params: {
          id: id,
          login: login,
          role: role?.['Ролі'],
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', 
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

export const patchCustomer = async (
  token: string,
  data: object, //проблема типизиции **** из *****
  customer_id: number,
): Promise<CustomerInterface | number> => {
  try {


    console.log(data);
    
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
  token: string,
  id: number,
): Promise<number> => {
  try {
    const response: AxiosResponse<number> = await axios.delete(
      URL_CUSTOMERS + `/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    console.log(response);
    
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
  token: string,
  data: PostCustomer,
): Promise<CustomerInterface | number> => {
  try {
    
    console.log(token);

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
    // console.log(response);
    
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
