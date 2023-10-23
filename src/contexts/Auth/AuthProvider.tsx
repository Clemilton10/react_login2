import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { User } from '../../types/User';
import { useApi } from '../../hooks/useApi';

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
	const [user_, setUser_] = useState<User | null>(null);
	const api = useApi();
	const signin = async (vuser_: string, vpassword: string) => {
		const data = await api.signin(vuser_, vpassword);
		if (data && data.status_id == 1) {
			if (data.user && data.token) {
				setUser_({
					id: data.id,
					user_: vuser_,
					password: vpassword
				});
				saveLocalStorage(data.token, data.id, data.user);
			}
			return true;
		} else {
			return false;
		}
	};
	const userAdd = async (vuser_: string, vpassword: string) => {
		const data = await api.userAdd(vuser_, vpassword);
		return data;
	};
	const signout = async () => {
		await api.signout();
		clearToken();
		setUser_(null);
	};
	const saveLocalStorage = (token: string, id: number, user: string) => {
		localStorage.setItem('authToken', token);
		localStorage.setItem('id', String(id));
		localStorage.setItem('user', user);
	};
	const clearToken = () => {
		localStorage.removeItem('authToken');
		localStorage.removeItem('id');
	};
	useEffect(() => {
		const validadeToken = async () => {
			const tk = localStorage.getItem('authToken');
			if (tk) {
				const data = await api.validateToken(tk);
				if (data && data.status_id == 1 && data.user) {
					setUser_({
						id: data.id,
						user_: data.user,
						password: '***'
					});
				}
			}
			return true;
		};
		validadeToken();
	}, []);
	return (
		<AuthContext.Provider value={{ user_, signin, userAdd, signout }}>
			{children}
		</AuthContext.Provider>
	);
};
