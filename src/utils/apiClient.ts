import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react';

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
    (response: AxiosResponse) => response,
    (error) => Promise.reject(error)
);

const apiWithAuth = async (config: AxiosRequestConfig) => {
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
        config.params.token = token;
    } catch (error) {
        console.log(error)
    }



    config.params = convertKeysToSnakeCase(config.params)
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
