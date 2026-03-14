import axios from 'axios';

const API_URL =
    process.env.REACT_APP_API_URL || // Priority 1: Environment Variable
    (process.env.NODE_ENV === 'production'
        ? 'https://e-commerce-project-2-i5rf.onrender.com/api' // Priority 2: Deployed Render Backend
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
