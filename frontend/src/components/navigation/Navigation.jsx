import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import ivyTechLogo from '../../images/ivy-tech-logo.png'
import AccountDropdown from './AccountDropdown'
import { useAuth } from '../../context/AuthContext';
import { UserService } from '../../services/UserService';

function Navigation() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${isDarkMode ? 'navbar-dark bg-dark shadow' : 'navbar-light bg-light shadow'}`}>
      <div className="container my-1">
        <div className="navbar-brand d-flex align-items-center">
          <img src={ivyTechLogo} height={30} width={30} className="me-2" alt="Ivy Tech Logo" />
          <Link to="/" className="text-decoration-none">
            <span className={isDarkMode ? 'text-white' : 'text-dark'}>
              Ivy Tech Course Manager
            </span>
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/courses">Courses</Link>
            </li>
            
            {UserService.canAddCourse(user) &&
              <li className="nav-item">
                <Link className="nav-link" to="/add-course">Add Course</Link>
              </li>
            }

            <AccountDropdown isDarkMode={isDarkMode} />

            <li className="nav-item d-flex align-items-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                />

                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                  {isDarkMode ? '☀️' : '🌙'}
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 