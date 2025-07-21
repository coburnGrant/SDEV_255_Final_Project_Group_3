import axios from 'axios';
const env = import.meta.env;

const local = 'http://localhost:3000';
const BACKEND_HOST = env.VITE_API_BASE_URL || local;
const API_BASE_URL = `${BACKEND_HOST}/api/`;

const api = axios.create({
    baseURL: API_BASE_URL,
});

// api.interceptors.request.use(config => {
//     // TODO: get the token from localStorage
// }, error => {
//     return Promise.reject(error);
// });

export default api;