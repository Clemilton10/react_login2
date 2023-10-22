import { createContext } from 'react';
import { User } from '../../types/User';

export type AuthContextType = {
	user_: User | null;
	signin: (user_: string, password: string) => Promise<boolean>;
	signout: () => void;
};
export const AuthContext = createContext<AuthContextType>(null!);
