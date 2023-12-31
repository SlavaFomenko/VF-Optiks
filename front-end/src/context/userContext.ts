import React, { createContext } from 'react';

// Определение типа контекста
export interface UserContext {
  token: string;
	first_name:string;
	last_name:string
}


// {token:'im token',first_name:"slava",last_name:'fomenko'}
// Создание контекста
const UserContext = createContext<UserContext | null>(null);

export default UserContext