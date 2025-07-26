import api from "./api";
import { ACCESS_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";
import { UserService } from "./UserService";

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
    login: async (credentials) => {
        const response = await api.post(`${AUTH_URL}/`, credentials);

        const {userId, token } = response.data;

        if(userId && token) {
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

        const res = await api.get(`${AUTH_URL}/status`);

        // Any non 200 status means authentication failed
        return res.status == 200;
    },

    clearAccessToken: () => {
        TokenManager.clearToken();
    },

    logout: () => {
        TokenManager.clearToken();

        UserService.cacher().clearCachedUser();
    }
};