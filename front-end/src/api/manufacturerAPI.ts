import axios, { AxiosError, AxiosResponse } from 'axios'
import { URL_MANUFACTURERS } from '../config/config'

export interface ManufacturerInterface {
  manufacturer_id: number | string
  name: string
  country: string
}

interface data {"Країни":string[]}
export const getManufacturer = async (
  token:string,
  id?: string,
  name?:string, 
  data?: data,
): Promise<ManufacturerInterface[] | number> => {


  const params = {
    id:id,
    name:name,
    country:data?.["Країни"]
  }
  
  try {
    const response: AxiosResponse<ManufacturerInterface[]> = await axios.get(
      URL_MANUFACTURERS,
      { params: {id:id,
        name:name,
        country:data?.["Країни"]} }
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

export const patchManufacturer = async (
  data: object, //проблема типизиции **** из *****
  manufacturer_id: number,
  token: string,
): Promise<ManufacturerInterface | number> => {
  try {
    const response: AxiosResponse<ManufacturerInterface> = await axios.patch(
      URL_MANUFACTURERS + `/${manufacturer_id}`,
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

export const deleteManufacturer = async (
  id: number,
  token: string,
): Promise<number> => {
  try {
    const response: AxiosResponse<number> = await axios.delete(
      URL_MANUFACTURERS + `/${id}`,
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

interface PostManufacturer {
  name: string
  country: string
}

export const postManufacturer = async (
  data: PostManufacturer,
  token: string,
): Promise<ManufacturerInterface | number> => {
  try {
    const response: AxiosResponse<ManufacturerInterface> = await axios.post(
      URL_MANUFACTURERS,
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
