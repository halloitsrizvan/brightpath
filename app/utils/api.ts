import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const msg = error.response?.data?.message || error.message || 'An unexpected error occurred';
        const status = error.response?.status;
        const url = error.config?.url;

        if (status === 401 || status === 403) {
            console.warn(`API ${status} (${url}):`, msg);
        } else {
            const errorData = {
                status,
                message: msg,
                url,
                method: error.config?.method,
                data: error.response?.data,
            };
            console.error('API Interceptor caught error:', msg);
            console.error('Full Error Details:', errorData);
        }

        if (
            error.response &&
            (error.response.status === 401 ||
                (error.response.status === 500 && (
                    msg.includes('token') ||
                    msg.includes('jwt') ||
                    msg.includes('signature') ||
                    msg.includes('authorization denied')
                )))
        ) {
            // Don't redirect if we're already on a login page
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
            const isLoginPage = ['/', '/admin', '/teacher', '/student'].includes(currentPath);
            
            if (!isLoginPage) {
                const userStr = Cookies.get('user');
                let loginPath = '/admin';
                if (userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        if (user.role === 'student') loginPath = '/student';
                        else if (user.role === 'teacher') loginPath = '/teacher';
                    } catch (e) { }
                }

                Cookies.remove('token');
                Cookies.remove('user');
                if (typeof window !== 'undefined') {
                    window.location.href = loginPath;
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
