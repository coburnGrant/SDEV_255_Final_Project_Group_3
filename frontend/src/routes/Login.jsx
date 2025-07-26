import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { ACCESS_TOKEN } from '../constants';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(formData);
            
            // Store the token
            localStorage.setItem(ACCESS_TOKEN, response.token);
            
            // Redirect to home page or dashboard
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="text-center mb-4">
                        <h2 className="h3">Sign in to your account</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="form-control"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="form-control"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-ivy-tech w-100 my-3"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>

                        <div className="text-center">
                            <p className="text-muted">
                                Don't have an account?
                                <a href="/register" className="ps-1 ivy-tech-text">
                                    Register here
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}