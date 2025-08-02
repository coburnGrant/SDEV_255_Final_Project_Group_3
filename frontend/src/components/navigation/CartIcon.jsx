import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { UserService } from '../../services/UserService';

export default function CartIcon({ user }) {
    if (!UserService.hasCart(user)) {
        return null;
    }
    
    return (
        <li className="nav-item">
            <Link className="nav-link position-relative" to="/cart">
                Cart<i className="bi bi-cart ms-1"></i>
            </Link>
        </li>
    );
} 