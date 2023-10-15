import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession, signIn, signOut } from 'next-auth/react';
import { notification } from 'antd';

const CACHE_TIME = 30000; // 30 seconds

interface CacheItem {
    timestamp: number;
    response: AxiosResponse;
}

const requestCache: Record<string, CacheItem> = {};

function generateCacheKey(config: AxiosRequestConfig): string {
    return `${config.method}_${config.url}_${JSON.stringify(config.params)}_${JSON.stringify(config.data)}`;
}

function camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function convertKeysToSnakeCase(obj: Record<string, any>): Record<string, any> {
    const newObj: Record<string, any> = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[camelToSnakeCase(key)] = obj[key];
        }
    }
    return newObj;
}


const apiClient = axios.create({
    baseURL: 'https://haooffer.minnzee.fun',
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
    (response: AxiosResponse) => {
        const cacheKey = generateCacheKey(response.config);
        requestCache[cacheKey] = {
            timestamp: Date.now(),
            response
        };
        if (response?.data?.code === 10001) {
            // Login has expired, please login again

            notification.error({
                message: 'Authentication Error',
                description: 'Your session has expired. Please log in again.',
                onClose: async () => {
                    // await signOut();

                }
            });
            sessionStorage.setItem("token", '')
            setTimeout(() => {
                signIn("google", undefined, {
                    prompt: 'select_account',
                })
            }, 2000);

            throw new Error("Token has expired");
        }

        return response;
    },
    (error) => {
        // Check if it is a 401 error. If so, logout the user.
        if (error.response && error.response.status === 401) {
            notification.error({
                message: 'Authentication Error',
                description: 'Your session has expired. Please log in again.',
                onClose: () => {
                    signOut({ callbackUrl: '/login' });
                }
            });
        } else {
            notification.error({
                message: 'API Error',
                description: 'An error occurred while processing your request. Please try again.'
            });
        }
        return Promise.reject(error);
    }
);

const apiWithAuth = async (config: AxiosRequestConfig, cache = false) => {
    if (!config.params) config.params = {};

    try {
        let localToken = sessionStorage.getItem("token");
        let token = null;
        if (localToken) {
            token = localToken;
        } else {
            const session: any = await getSession();
            token = session?.token?.token ?? '';
            sessionStorage.setItem("token", token)
        }
        // if (config.method === 'get') {
            config.params.token = token;
        // }
        // if (config.method === 'post') {
        //     config.data.token = token;

        // }
        // config.headers = {
        //     ...config.headers,
        //     token
        // }
    } catch (error) {
        console.log(error)
    }

    config.params = convertKeysToSnakeCase(config.params);

    if (cache) {
        const cacheKey = generateCacheKey(config);
        const cachedResponse = requestCache[cacheKey];

        if (cachedResponse && (Date.now() - cachedResponse.timestamp) <= CACHE_TIME) {
            return Promise.resolve(cachedResponse.response);
        }
    }

    return apiClient(config);
};

export { apiClient, apiWithAuth };
