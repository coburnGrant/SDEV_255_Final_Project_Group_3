import api from "./api";
import { ACCESS_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";
import { UserService } from "./UserService";

const AUTH_URL = 'auth'

export const authService = {
    login: async (credentials) => {
        const response = await api.post(`${AUTH_URL}/`, credentials);
        return response.data;
    },

    status: async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (!token) {
            return false;
        }

        const res = await api.get(`${AUTH_URL}/status`);

        // Any non 200 status means authentication failed
        return res.status == 200;
    },

    clearAccessToken: () => {
        localStorage.removeItem(ACCESS_TOKEN);
    },

    logout: () => {
        this.clearAccessToken();

        UserService.clearCachedUser();
    }
};