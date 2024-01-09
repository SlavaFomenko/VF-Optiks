import axios, { AxiosError, AxiosResponse } from 'axios'
import { URL_CATEGORIES } from '../config/config'
import { Value } from 'sass'

export interface CategoryInterface {
  category_id: number | string
  name: string
  description: string
}

export const getCategory = async (
  id?: string,
  name?: string,
): Promise<CategoryInterface[] | number> => {
  console.log(name)

  try {
    const response: AxiosResponse<CategoryInterface[]> = await axios.get(
      URL_CATEGORIES,
      { params: { id: id, name: name } },
    )
    console.log(response.config) // Вывод информации о запросе

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

export const patchCategory = async (
  data: object, //проблема типизиции **** из *****
  category_id: number,
  token: string,
): Promise<CategoryInterface | number> => {
  try {
    const response: AxiosResponse<CategoryInterface> = await axios.patch(
      URL_CATEGORIES + `/${category_id}`,
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

export const deleteCategory = async (
  id: number,
  token: string,
): Promise<number> => {
  try {
    const response: AxiosResponse<number> = await axios.delete(
      URL_CATEGORIES + `/${id}`,
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

interface PostCategory {
  name: string
  description: string
}

export const postCategory = async (
  data: PostCategory,
  token: string,
): Promise<CategoryInterface | number> => {
  try {
    const response: AxiosResponse<CategoryInterface> = await axios.post(
      URL_CATEGORIES,
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
