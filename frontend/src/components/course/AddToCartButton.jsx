import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AddToCartButton({ courseId, className = '' }) {
    const navigate = useNavigate();

    const { addToCart, checkInCart } = useCart();
    const { user } = useAuth();
    const [isInCart, setIsInCart] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (user?.role === 'student') {
            checkCartStatus();
        } else {
            setChecking(false);
        }
    }, [courseId, user]);

    const checkCartStatus = async () => {
        try {
            setChecking(true);
            const inCart = await checkInCart(courseId);
            setIsInCart(inCart);
        } catch (error) {
            console.error('Error checking cart status:', error);
        } finally {
            setChecking(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            // Redirect to login if not authenticated
            window.location.href = '/login';
            return;
        }

        if (user.role !== 'student') {
            alert('Only students can add courses to cart');
            return;
        }

        setLoading(true);
        const result = await addToCart(courseId);
        setLoading(false);

        if (result.success) {
            setIsInCart(true);
            // Could show a success toast here
        } else {
            // Could show an error toast here
            console.log(result.message);
        }
    };

    // Don't show button for non-students
    if (user && user.role !== 'student') {
        return null;
    }

    // Show loading state while checking cart status
    if (checking) {
        return (
            <button 
                className={`btn btn-outline-secondary ${className}`} 
                disabled
            >
                <span className="spinner-border spinner-border-sm me-1"></span>
                Checking...
            </button>
        );
    }

    // Show different states based on cart status
    if (isInCart) {
        return (
            <button 
                className={`btn btn-success ${className}`}
                onClick={() => { navigate('/cart') }}
            >
                In Cart<i className="bi bi-cart-check-fill ms-1"></i>
            </button>
        );
    }

    return (
        <button 
            className={`btn btn-ivy-tech ${className}`}
            onClick={handleAddToCart}
            disabled={loading}
        >
            {loading ? (
                <>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    Adding...
                </>
            ) : (
                <>
                    <i className="fas fa-cart-plus me-1"></i>
                    Add to Cart
                </>
            )}
        </button>
    );
} 