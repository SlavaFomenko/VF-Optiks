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
	last_name:string
}
export const getUser = async({ login, password }: GetUser): Promise<UserData | number>=> {

	const params = {
		login: login,
		password: password,
	};

  try {
    const response: AxiosResponse<UserData> = await axios.get(URL_LOGIN, { params });
		return response.data;
  } catch (error: AxiosError | any){
		console.error('Error:', error);
    return error.response ? error.response.status : 500;
  }
};
