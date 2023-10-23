import { createContext } from 'react';
import { User } from '../../types/User';

export type AuthContextType = {
	user_: User | null;
	signin: (user_: string, password: string) => Promise<boolean>;
	signout: () => void;
	userAdd: (user_: string, password: string) => Promise<any>;
	userEdi: (id: number, user_: string, password: string) => Promise<any>;
	userDel: (id: number) => Promise<any>;
	userGet: (
		fields: string,
		search: string,
		dt_ini: string,
		dt_fin: string,
		order: string,
		meaning: string,
		limit: string
	) => Promise<any>;
};
export const AuthContext = createContext<AuthContextType>(null!);
