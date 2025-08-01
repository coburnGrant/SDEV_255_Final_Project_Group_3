import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CartIcon() {
    const { getCartItemCount } = useCart();
    const { user } = useAuth();

    // Only show cart icon for students
    if (!user || user.role !== 'student') {
        return null;
    }

    const itemCount = getCartItemCount();

    return (
        <li className="nav-item">
            <Link className="nav-link position-relative" to="/cart">
                Cart<i className="fas bi-cart ms-1"></i>
            </Link>
        </li>
    );
} 