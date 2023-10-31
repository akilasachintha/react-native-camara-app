import axios, {AxiosInstance} from 'axios';
import {useLoadingContext} from '@context/LoadingContext';
import {AuthContextType} from '@context/AuthContext';
import {useToast} from "@context/ToastContext";
const ECO_PRINT_BASE_URL = 'https://www.ecoprint.world/v1/';
export const BASE_URL = {
    ECO_PAINT: ECO_PRINT_BASE_URL,
};

const createAxiosInstance = (authHook: AuthContextType, baseURL: string): AxiosInstance => {
    const instance = axios.create({
        baseURL,
    });

    const {showLoading, hideLoading} = useLoadingContext();
    const {showToast} = useToast();

    // Request Interceptor
    instance.interceptors.request.use(
        (config) => {
            const token = authHook.token;

            if (token) {
                config.headers['token'] = `${token}`;
            }

            showLoading();

            return config;
        },
        (error) => {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            if (response.status >= 400 && response.status < 500) {
                console.error('Client Error:', response.status, response.data);
                if (response.status === 401) {
                    authHook.logout();
                    showToast(response.data);

                    return Promise.reject(response.data);
                }

            } else if (response.status >= 500) {
                console.error('Server Error:', response.status, response.data);
                hideLoading();
                showToast(response.data);
                return Promise.reject(response.data);
            }

            return response;
        },
        (error) => {
            if (error.message === 'Network Error') {
                console.error('Network Error:', error);
            } else if (error.response) {
                console.error('HTTP Error:', error.response.status, error.response.data);
            } else {
                console.error('Error:', error);
            }

            hideLoading();
            return Promise.reject(error);
        }
    );

    return instance;
};

export {createAxiosInstance, ECO_PRINT_BASE_URL};