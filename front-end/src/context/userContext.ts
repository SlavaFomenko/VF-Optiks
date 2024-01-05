import React, { createContext, ReactNode, useState } from 'react';

export interface User {
  token: string;
  login: string;
  first_name: string;
  last_name: string;
  role: string;
  tel_number: string;
}

interface UserContext {
  user: User | null;
  setUser: (user: User|null) => void;
}

const UserContext = createContext<UserContext | null>(null);
export default UserContext;




