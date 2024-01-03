import React, { createContext } from 'react';

// Определение типа контекста
interface UserContext {
  token: string;
	login:string;
	first_name:string;
	last_name:string;
}
//! {token:'im token',first_name:"slava",last_name:'fomenko'}
const UserContext = createContext<UserContext | null>(null);

export default UserContext