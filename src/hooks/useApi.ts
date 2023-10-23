import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:99'
});
export const useApi = () => ({
	validateToken: async (token: string) => {
		api.defaults.headers.common['Authorization'] = token
			? `Bearer ${token}`
			: '';
		const response = await api.post('/validate');
		api.defaults.headers.common['Authorization'] = response.data.token
			? `Bearer ${response.data.token}`
			: '';
		api.defaults.headers.common['id'] = response.data.id
			? response.data.id
			: -1;
		return response.data;
	},
	signin: async (user_: string, password: string) => {
		const response = await api.post('/signin', {
			user: user_,
			password: password
		});
		/*api.interceptors.request.use(function (config) {
			config.headers.Authorization = response.data.token
				? `Bearer ${response.data.token}`
				: '';
			return config;
		});*/
		api.defaults.headers.common['Authorization'] = response.data.token
			? `Bearer ${response.data.token}`
			: '';
		api.defaults.headers.common['id'] = response.data.id
			? response.data.id
			: -1;
		return response.data;
	},
	signout: async () => {
		const response = await api.post('/signout', {
			id: api.defaults.headers.common['id']
		});
		/*api.interceptors.request.use(function (config) {
			config.headers.Authorization = '';
			return config;
		});*/
		api.defaults.headers.common['Authorization'] = '';
		return response.data;
	},
	userAdd: async (user_: string, password: string) => {
		const response = await api.post('/user', {
			user: user_,
			password: password
		});
		/*api.interceptors.request.use(function (config) {
			config.headers.Authorization = '';
			return config;
		});*/
		return response.data;
	}
});
