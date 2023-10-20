import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.REACT_APP_API
});
export const useApi = () => ({
	validateToken: async (token: string) => {
		// resposta falsa
		return {
			user: { id: 3, name: 'Clemas', email: 'clemas.web@icloud.com' }
		};
		//resposta que seria depois de ir na API verdadeira
		const response = await api.post('/validate', { token });
		return response.data;
	},
	signin: async (email: string, password: string) => {
		// resposta falsa
		return {
			user: { id: 3, name: 'Clemas', email: 'clemas.web@icloud.com' },
			token: '123456789'
		};
		//resposta que seria depois de ir na API verdadeira
		const response = await api.post('/signin', { email, password });
		return response.data;
	},
	signout: async () => {
		return { status: true };
		const response = await api.post('/signout');
		return response.data;
	}
});
