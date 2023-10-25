import { createContext } from 'react';
import { User } from '../../types/User';

export type AuthContextType = {
	user_: User | null;
	signin: (user_: string, password: string) => Promise<object>;
	signout: () => void;
	userAdd: (user_: string, password: string) => Promise<object>;
	userEdi: (id: number, user_: string, password: string) => Promise<object>;
	userDel: (id: number) => Promise<object>;
	userGet: (
		fields: string,
		search: string,
		dt_ini: string,
		dt_fin: string,
		order: string,
		meaning: string,
		limit: string
	) => Promise<object>;
	startToken: () => Promise<boolean>;
};
export const AuthContext = createContext<AuthContextType>(null!);
