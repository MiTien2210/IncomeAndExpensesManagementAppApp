import React, {createContext, useState, ReactNode} from 'react';
// import {User} from '../types/types';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface UserContextType {
  user: FirebaseAuthTypes.User | null;
  updateUser: (user: FirebaseAuthTypes.User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  updateUser: () => {},
});

export const UserProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  

  const updateUser = (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
      }}>
      {children}
    </UserContext.Provider>
  );
};
