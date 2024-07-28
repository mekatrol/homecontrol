import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { getApiBaseUrl } from './url';
import { useAppStore } from '@/stores/app';
import { REFRESH_TOKEN_URL } from './authService';

export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const userStore = useAppStore();

  // Clear Authorization bearer (if it exists)
  delete config.headers.Authorization;

  // Get the token based on whether this is a refresh request (use refresh token) or another request (user access token)
  const token = config.url === REFRESH_TOKEN_URL ? userStore.userToken?.refreshToken : userStore.userToken?.accessToken;

  // If there is a token then set the bearer token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

export const errorInterceptor = (error: AxiosError): Promise<unknown> => {
  return Promise.reject(error);
};

const apiBaseUrl = getApiBaseUrl();

const axiosApi: AxiosInstance = axios.create({ baseURL: apiBaseUrl });

// Configure interceptors
axiosApi.interceptors.request.use(requestInterceptor, errorInterceptor);
axiosApi.interceptors.response.use(responseInterceptor, errorInterceptor);

// Export configured axiosApi
export { axiosApi };
