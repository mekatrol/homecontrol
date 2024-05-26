// import { useUserStore } from '@/stores/user';
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { getApiBaseUrl } from './http';

export function requestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  // const userStore = useUserStore();
  // const token = userStore.accessToken;

  // if (token != null) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }

  return config;
}

export function responseInterceptor(response: AxiosResponse): AxiosResponse {
  return response;
}

export function errorInterceptor(error: AxiosError): Promise<unknown> {
  return Promise.reject(error);
}

const apiBaseUrl = getApiBaseUrl();

const axiosApi: AxiosInstance = axios.create({ baseURL: apiBaseUrl });

axiosApi.interceptors.request.use(requestInterceptor, errorInterceptor);
axiosApi.interceptors.response.use(responseInterceptor, errorInterceptor);

// Interceptors

export { axiosApi };
