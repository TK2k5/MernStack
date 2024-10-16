import { getAccessTokenFromLS, setAccessTokenToLS } from '@/utils/auth.util';
import axios, { AxiosInstance } from 'axios';

import { AuthResponse } from '@/types/auth.type';
import path from './path.config';

class Http {
	instance: AxiosInstance;
	private accessToken: string;

	constructor() {
		this.accessToken = getAccessTokenFromLS();

		this.instance = axios.create({
			baseURL: import.meta.env.VITE_BASE_URL,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		// add request interceptors
		this.instance.interceptors.request.use(
			(response) => {
				return response;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		// add response interceptor
		this.instance.interceptors.response.use(
			(response) => {
				console.log('🚀 ~ Http ~ constructor ~ response:', response);
				const { url } = response.config;
				if (url === path.login) {
					const data = response.data as AuthResponse;
					this.accessToken = data.accessToken;
					setAccessTokenToLS(this.accessToken);
				}
				return response;
			},
			(error) => {
				return Promise.reject(error);
			}
		);
	}
}

const http = new Http().instance;

export default http;

/*
các dạng function
1. function declaration => function name() {}
2. function expression => const name = function() {}
3. arrow function => const name = () => {}
4. IIFE => (function() {})()
*/
