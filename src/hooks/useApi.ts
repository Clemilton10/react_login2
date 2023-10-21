import axios from 'axios';

const api = axios.create({
	baseURL: 'http://meudriver.br:99'
});
export const useApi = () => ({
	validateToken: async (token: string) => {
		api.interceptors.request.use(function (config) {
			config.headers.Authorization = token;
			return config;
		});
		const response = await api.post('/validate', { token: token });
		return response.data;
	},
	signin: async (user_: string, password: string) => {
		const response = await api.post('/signin', {
			user: user_,
			password: password
		});
		return response.data;
	},
	signout: async () => {
		return { status: true };
		const response = await api.post('/signout');
		return response.data;
	}
});
