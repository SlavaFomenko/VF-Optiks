import axios from 'axios';
import { URL_CUSTOMERS } from '../config/config';


export const getUserByLogin = async (login: string) => {
  // console.log(login);
  
  try {
    const response = await axios.get(URL_CUSTOMERS, {params: { login:login } });
    return response.data
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};
