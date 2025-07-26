import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';
const env = import.meta.env;

const local = 'http://localhost:3000';
const BACKEND_HOST = env.VITE_API_BASE_URL || local;
const API_BASE_URL = `${BACKEND_HOST}/api/`;

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers['x-auth'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;