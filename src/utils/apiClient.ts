import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
    baseURL: 'http://8.130.131.123',
});

apiClient.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => Promise.reject(error)
);

const apiWithAuth = async (config: AxiosRequestConfig) => {
    const session:any= await getSession();
    
    const token = session?.token?.token ?? '';
    if(!config.params) config.params = {};
    config.params.token = token;
    return apiClient({
        ...config,
        // headers: {
            // ...config.headers,
            // Token: token
            // Authorization: `Bearer ${token}`,
        // },
    });
};

export { apiClient, apiWithAuth };
