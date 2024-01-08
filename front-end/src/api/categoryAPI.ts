import { number } from 'yup';
import axios, { AxiosError, AxiosResponse } from 'axios'
import { URL_CATEGORIES } from '../config/config'

// import {  } from '../context/userContext'

export interface CategoryInterface {
  category_id: number | string
  name: string
  description: string
}

export const getCategory = async (
  id?: string,
): Promise<CategoryInterface[] | number> => {
  try {
    const response: AxiosResponse<CategoryInterface[]> = await axios.get(
      URL_CATEGORIES,
      { params: { id: id } },
    )
    return response.data
  } catch (error: AxiosError | any) {
    console.error('Error:', error)
    return error.response ? error.response.status : 500
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
    console.error('Error:', error)
    return error.response ? error.response.status : 500
  }
}

export const deleteCategory = async (id:number,token:string):Promise<number> => {

	try{
		const response:AxiosResponse<number> = await axios.delete(URL_CATEGORIES+`/${id}`,{headers:{Authorization: `Bearer ${token}`}})
		return response.status
	}catch(error){
		console.error('Error:', error)
    return 500
	}
}
