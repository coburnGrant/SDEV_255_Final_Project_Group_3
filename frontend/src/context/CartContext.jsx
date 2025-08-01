import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { CartService } from '../services/CartService';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load cart when user is authenticated
    useEffect(() => {
        if (isAuthenticated && user?.role === 'student') {
            loadCart();
        } else {
            setCart(null);
        }
    }, [isAuthenticated, user]);

    const loadCart = async () => {
        try {
            setLoading(true);
            setError('');
            const cartData = await CartService.getCart();
            setCart(cartData);
        } catch (err) {
            console.error('Error loading cart:', err);
            setError('Failed to load shopping cart');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (courseId) => {
        try {
            setLoading(true);
            setError('');
            const result = await CartService.addToCart(courseId);
            
            if (result.added) {
                // Reload cart to get updated data
                await loadCart();
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to add course to cart';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (courseId) => {
        try {
            setLoading(true);
            setError('');
            const result = await CartService.removeFromCart(courseId);
            
            if (result.removed) {
                // Reload cart to get updated data
                await loadCart();
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to remove course from cart';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            setLoading(true);
            setError('');
            await CartService.clearCart();
            await loadCart();
            return { success: true, message: 'Cart cleared successfully' };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to clear cart';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const checkInCart = async (courseId) => {
        try {
            const result = await CartService.checkInCart(courseId);
            return result.inCart;
        } catch (err) {
            console.error('Error checking cart status:', err);
            return false;
        }
    };

    const getCartItemCount = () => {
        return cart?.itemCount || 0;
    };

    const getCartItems = () => {
        return cart?.items || [];
    };

    const value = {
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        clearCart,
        checkInCart,
        getCartItemCount,
        getCartItems,
        loadCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}; 