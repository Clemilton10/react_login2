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
		const id = localStorage.getItem('id');
		const data = await api.userAdd(vuser_, vpassword, Number(id));
		return data;
	};
	const userEdi = async (vid: number, vuser_: string, vpassword: string) => {
		const id = localStorage.getItem('id');
		const data = await api.userEdi(vid, vuser_, vpassword, Number(id));
		return data;
	};
	const userDel = async (vid: number) => {
		const data = await api.userDel(vid);
		return data;
	};
	const userGet = async (
		fields: string,
		search: string,
		dt_ini: string,
		dt_fin: string,
		order: string,
		meaning: string,
		limit: string
	) => {
		const data = await api.userGet(
			fields,
			search,
			dt_ini,
			dt_fin,
			order,
			meaning,
			limit
		);
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
		<AuthContext.Provider
			value={{
				user_,
				signin,
				userAdd,
				userEdi,
				userDel,
				userGet,
				signout
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
