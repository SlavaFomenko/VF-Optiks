import axios, { AxiosResponse,AxiosError } from 'axios'
import { URL_LOGIN } from '../config/config';
// import {  } from '../context/userContext'

interface GetUser {
	login: string;
	password: string;
}
interface UserData {
  token: string,
	login:string,
	first_name:string,
	last_name:string,
	role:string,
	tel_number:string,
	customer_id:number
}
export const getUser = async({ login, password }: GetUser): Promise<UserData | number>=> {

	
	const params = {
		login: login,
		password: password,
	};

  try {
		const response: AxiosResponse<UserData> = await axios.get(URL_LOGIN, { params });
		console.log(response.data);
		
		return response.data;

  } catch (error: AxiosError | any){
		console.error('Error:', error);
    return error.response ? error.response.status : 500;
  }
};
