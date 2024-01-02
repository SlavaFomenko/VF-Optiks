import axios, { AxiosResponse,AxiosError } from 'axios'
import { URL_CUSTOMERS } from '../config/config';
import { RegisterFormValues } from '../pages/registration/registration'


export const createUser = async( data: RegisterFormValues) : Promise<number>=> {

	const params = {  
		login:data.login,
		password: data.password,
		tel_number: data.tel_number,
		first_name: data.first_name,
		last_name: data.last_name,
		// confirm_password: data.confirm_password
	}

	console.log(params);
	

  try {
    const response: AxiosResponse<RegisterFormValues> = await axios.post(URL_CUSTOMERS, params);
    return response.status;
  } catch (error: AxiosError | any){
		console.error('Error:', error);
    return error.response ? error.response.status : 500;
  }
};
