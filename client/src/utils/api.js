import axios from 'axios';

const API_URL =
    process.env.REACT_APP_API_URL || // Priority 1: Manual Override
    (process.env.NODE_ENV === 'production'
        ? '/api' // Priority 2: Relative path (best for Vercel unified deployment)
        : 'http://localhost:5000/api'); // Priority 3: Local Development

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
