import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
    baseURL: 'https://haooffer.minnzee.fun/',
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
    let localToken = sessionStorage.getItem("token");
    let token = null;
    if (localToken) {
        token = localToken;
    } else {
        const session: any = await getSession();
        token = session?.token?.token ?? '';
        sessionStorage.setItem("token", token)
    }

    if (!config.params) config.params = {};
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
