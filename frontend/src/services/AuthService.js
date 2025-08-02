import api from "./api";
import { ACCESS_TOKEN } from "../constants";
import { UserService } from "./UserService";
import { jwtDecode } from "jwt-decode";

const AUTH_URL = 'auth'

const TokenManager = {
    getToken: () => {
        return localStorage.getItem(ACCESS_TOKEN);
    },

    setToken: (token) => {
        localStorage.setItem(ACCESS_TOKEN, token);
    },

    clearToken: () => {
        localStorage.removeItem(ACCESS_TOKEN);
    }
}

export const authService = {
    tokenManager: () => { return TokenManager; },

    login: async (credentials) => {
        const response = await api.post(`${AUTH_URL}/`, credentials);

        const { user, token } = response.data;

        if (user && token) {
            UserService.cacher().cacheUser(user);

            TokenManager.setToken(token);
        } else {
            throw new Error(response.data.error);
        }
    },

    status: async () => {
        const token = TokenManager.getToken();

        if (!token) {
            return false;
        }

        try {
            // Decode the token
            const decoded = jwtDecode(token);

            // Check if token has expired
            const now = Date.now() / 1000; // convert to seconds
            if (decoded.exp && decoded.exp < now) {
                TokenManager.clearToken();
                UserService.cacher().clearCachedUser();
                return false;
            } else {
                return true;
            }
        } catch (err) {
            console.error('error decoding access token', err);
        }

        const res = await api.get(`${AUTH_URL}/status`);

        const validToken = res.status == 200;

        if (!validToken) {
            TokenManager.clearToken();
            UserService.cacher().clearCachedUser();
        }

        // Any non 200 status means authentication failed
        return validToken;
    },

    clearAccessToken: () => {
        TokenManager.clearToken();
    },

    logout: () => {
        TokenManager.clearToken();

        UserService.cacher().clearCachedUser();
    }
};