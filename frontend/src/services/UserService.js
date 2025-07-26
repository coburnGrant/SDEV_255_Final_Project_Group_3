import { ACCESS_TOKEN, USER_SAVE_KEY } from "../constants";
import api from "./api";

const USER_API_URL = 'user'

const UserCacher = {
    cacheUser: (data) => {
        localStorage.setItem(USER_SAVE_KEY, JSON.stringify(data));
    },

    getCachedUser: () => {
        const string = localStorage.getItem(USER_SAVE_KEY);
        return string ? JSON.parse(string) : null;
    },

    clearCachedUser: () => {
        localStorage.removeItem(USER_SAVE_KEY);
    }
}

const editableRoles = ['teacher', 'admin', 'super-admin'];
const deletableRoles = editableRoles;

export const UserService = {
    cacher: () => { return UserCacher; },

    register: async (data) => {
        const response = await api.post(`${USER_API_URL}`, data);

        const token = response.data.token;

        if (response.status === 201 || token) {
            localStorage.setItem(ACCESS_TOKEN, token);
        }

        return response.data;
    },

    getCurrent: async () => {
        const cached = UserCacher.getCachedUser();

        if (cached) {
            return cached;
        }

        try {
            const response = await api.get(`${USER_API_URL}/me`);

            const userData = response.data;

            if (userData && userData._id) {
                UserCacher.cacheUser(userData);
            }

            return userData;
        } catch {
            return null;
        }
    },

    canAddCourse: (user) => {
        if (!user) {
            return false;
        }

        const userRole = user.role;

        if (!userRole) {
            return false;
        }

        switch (user.role) {
            case 'super-admin':
            case 'admin':
            case 'teacher':
                return true;
            default:
                return false
        }
    },

    canEditAndDelete: (user) => {
        if (!user) {
            return false;
        }

        const role = user.role;
        const canEdit = editableRoles.includes(role);
        const canDelete = deletableRoles.includes(role);

        return { canEdit, canDelete }
    }
};