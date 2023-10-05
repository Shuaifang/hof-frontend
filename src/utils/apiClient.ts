import axios, { AxiosInstance, AxiosResponse } from 'axios';

const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://8.130.131.123',
});

apiClient.interceptors.request.use(
    config => {
        // Check if we are running on the client side
        if (typeof window !== 'undefined') {
            const token: string | null = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
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

export default apiClient;