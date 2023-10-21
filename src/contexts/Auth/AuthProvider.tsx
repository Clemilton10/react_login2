import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { User } from '../../types/User';
import { useApi } from '../../hooks/useApi';

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
	const [user, setUser] = useState<User | null>(null);
	const api = useApi();
	const signin = async (user_: string, password: string) => {
		const data = await api.signin(user_, password);
		if (data.user && data.token) {
			setUser(data.user);
			setToken(data.token);
			return true;
		} else {
			return false;
		}
	};
	const signout = async () => {
		await api.signout();
		clearToken();
		setUser(null);
	};
	const setToken = (token: string) => {
		localStorage.setItem('authToken', token);
	};
	const clearToken = () => {
		localStorage.removeItem('authToken');
	};
	useEffect(() => {
		const validadeToken = async () => {
			const storageData = localStorage.getItem('authToken');
			if (storageData) {
				const data = await api.validateToken(storageData);
				if (data.user) {
					setUser(data.user);
					return true;
				}
			}
		};
		validadeToken();
	}, []);
	return (
		<AuthContext.Provider value={{ user, signin, signout }}>
			{children}
		</AuthContext.Provider>
	);
};
