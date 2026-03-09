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
        const msg = error.response?.data?.message?.toLowerCase() || '';

        // Log all interceptor errors so we know what is triggering the disconnects
        console.error('API Interceptor caught error: ', {
            status: error.response?.status,
            message: msg,
            url: error.config?.url,
            originalError: error.message
        });
        console.dir(error);

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
        return Promise.reject(error);
    }
);

export default api;
