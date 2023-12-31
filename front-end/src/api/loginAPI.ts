import axios, { AxiosResponse,AxiosError } from 'axios'
import { URL_LOGIN } from '../config/config';
import { UserContext } from '../context/userContext'

interface GetUser {
	login: string;
	password: string;
}

export const getUser = async({ login, password }: GetUser): Promise<UserContext| number>=> {

	const params = {
		login: login,
		password: password,
	};

  try {
    const response: AxiosResponse<UserContext> = await axios.get(URL_LOGIN, { params });
    return response.data;
  } catch (error: AxiosError | any){
		console.error('Error:', error);
    return error.response ? error.response.status : 500;
  }
};
