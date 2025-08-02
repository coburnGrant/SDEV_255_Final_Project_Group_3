import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AccountDropdown({ isDarkMode }) {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
  
    const handleLogout = () => {
        logout();
        navigate('/');
    }

    if (!isAuthenticated) {
        return (
            <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
            </li>
        );
    }

    return (
        <li className="nav-item dropdown">
        <a
            className="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >
                {user?.username || 'Account'}
        </a>
        <ul className={`dropdown-menu ${isDarkMode ? 'dropdown-menu-dark' : ''}`}>
            <li>
                <Link className="dropdown-item" to="/account">
                    Account Details
                </Link>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
                <button
                    className="dropdown-item"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </li>
        </ul>
    </li>
    );
}