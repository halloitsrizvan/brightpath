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

        const isForbidden = status === 403 || (typeof msg === 'string' && msg.toLowerCase().includes('forbidden'));
        const isUnauthorized = 
            status === 401 || 
            (typeof msg === 'string' && (
                msg.toLowerCase().includes('no token') ||
                msg.toLowerCase().includes('token is not valid') ||
                msg.toLowerCase().includes('jwt expired') ||
                msg.toLowerCase().includes('authorization denied') ||
                msg.toLowerCase().includes('session revoked') ||
                msg.toLowerCase().includes('identity required')
            ));

        if (status === 401 || status === 403 || isForbidden || isUnauthorized) {
            console.warn(`API ${status || 'Auth'} (${url}):`, msg);
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

        // Only redirect on actual 401 Unauthenticated sessions (never on 403 Forbidden)
        if (isUnauthorized && error.response) {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
            const isLoginPage = ['/', '/admin', '/teacher', '/student'].includes(currentPath);
            
            if (!isLoginPage) {
                const userStr = Cookies.get('user');
                let loginPath = '/admin';
                
                if (currentPath.startsWith('/teacher-dashboard')) {
                    loginPath = '/teacher';
                } else if (currentPath.startsWith('/student-dashboard')) {
                    loginPath = '/student';
                } else if (userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        if (user.role === 'student') loginPath = '/student';
                        else if (user.role === 'teacher') loginPath = '/teacher';
                    } catch (e) { }
                }

                Cookies.remove('token', { path: '/' });
                Cookies.remove('user', { path: '/' });
                
                if (typeof window !== 'undefined') {
                    // Call server logout to ensure httpOnly cookie is cleared
                    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
                        window.location.href = loginPath;
                    });
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
