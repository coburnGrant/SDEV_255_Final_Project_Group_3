import api from './api';

const CART_API_URL = 'cart/';

export const CartService = {
    // Get user's shopping cart
    getCart: async () => {
        const response = await api.get(CART_API_URL);
        return response.data;
    },

    // Add course to cart
    addToCart: async (courseId) => {
        const response = await api.post(`${CART_API_URL}add/${courseId}`);
        return response.data;
    },

    // Remove course from cart
    removeFromCart: async (courseId) => {
        const response = await api.delete(`${CART_API_URL}remove/${courseId}`);
        return response.data;
    },

    // Clear entire cart
    clearCart: async () => {
        const response = await api.delete(`${CART_API_URL}clear`);
        return response.data;
    },

    // Check if course is in cart
    checkInCart: async (courseId) => {
        const response = await api.get(`${CART_API_URL}check/${courseId}`);
        return response.data;
    }
}; 