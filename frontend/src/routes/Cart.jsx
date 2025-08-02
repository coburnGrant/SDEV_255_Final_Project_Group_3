import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ScheduleService from '../services/ScheduleService';

const TERMS = ['Spring', 'Summer', 'Fall'];
const CURRENT_YEAR = new Date().getFullYear();

export default function Cart() {
    const { cart, loading, error, removeFromCart, clearCart, getCartItems } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [removingItem, setRemovingItem] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    const [checkoutTerm, setCheckoutTerm] = useState('');
    const [checkoutYear, setCheckoutYear] = useState(CURRENT_YEAR);
    const [submitting, setSubmitting] = useState(false);

    const [schedules, setSchedules] = useState([]);
    const [selectedScheduleId, setSelectedScheduleId] = useState('');
    const [useExistingSchedule, setUseExistingSchedule] = useState(false);

    // Redirect if not a student
    if (user && user.role !== 'student') {
        navigate('/');
        return null;
    }

    const handleRemoveItem = async (courseId) => {
        setRemovingItem(courseId);
        const result = await removeFromCart(courseId);
        setRemovingItem(null);

        if (result.success) {
            // Could show a success toast here
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your shopping cart?')) {
            const result = await clearCart();
            if (result.success) {
                // Could show a success toast here
            }
        }
    };

    const loadSchedules = async () => {
        try {
            const data = await ScheduleService.getSchedules();
            setSchedules(data);
        } catch (err) {
            console.error('Failed to fetch schedules:', err);
        }
    };

    const addToSchedule = async () => {
        setSubmitting(true);

        try {
            if (useExistingSchedule && selectedScheduleId) {
                await ScheduleService.addCoursesToSchedule(selectedScheduleId);

                alert('Added to schedule successfully!');
            } else {
                if (!checkoutTerm) {
                    alert('Please select a term for the new schedule.');
                    return;
                }

                await ScheduleService.addSchedule({
                    term: checkoutTerm,
                    year: checkoutYear
                });

                alert('Schedule created successfully!');
            }

            await clearCart();

            navigate('/schedules');
        } catch (err) {
            console.error('Error checking out:', err);

            const errMessage = err.response?.data?.message;

            alert(`Failed to add schedule${errMessage ? `:\n${errMessage}` : '.'}`);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (cart) {
            setCartItems(getCartItems());
        } else {
            setCartItems([]);
        }
    }, [cart]);

    useEffect(() => {
        loadSchedules();
    }, []);

    if (!cart && loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-ivy-tech" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading your shopping cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>
                            <i className="bi bi-cart me-2"></i>
                            Shopping Cart
                        </h2>
                        {cartItems.length > 0 && (
                            <button
                                className="btn btn-outline-danger"
                                onClick={handleClearCart}
                                disabled={loading}
                            >
                                <i className="bi bi-trash me-1"></i>
                                Clear Cart
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {cartItems.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-cart fs-2 text-muted mb-3"></i>
                            <h4 className="text-muted">Your cart is empty</h4>
                            <p className="text-muted">Start shopping by browsing our courses!</p>
                            <button
                                className="btn btn-ivy-tech"
                                onClick={() => navigate('/courses')}
                            >
                                <i className="bi bi-search me-1"></i>
                                Browse Courses
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="row">
                                <div className="col-lg-8">
                                    {(loading && !removingItem) && (
                                        <div className="d-flex justify-content-center m-3">
                                            <div className="spinner-border ivy-tech-text" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    )}

                                    {cartItems.map((item) => (
                                        <div key={item.courseId._id} className="card mb-3 shadow-sm">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <h5>
                                                            <Link to={`/courses/${item.courseId._id}`} className="ivy-tech-text text-decoration-none">
                                                                {item.courseId.prefix}-{item.courseId.number} | {item.courseId.name}
                                                            </Link>
                                                        </h5>

                                                        <p className="card-text text-muted">
                                                            {item.courseId.description}
                                                        </p>

                                                        <div className="row mt-2">
                                                            <div className="col-md-6">
                                                                <small className="text-muted">
                                                                    <i className="bi bi-calendar me-1"></i>
                                                                    Added {new Date(item.addedAt).toLocaleDateString()}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 text-end">
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleRemoveItem(item.courseId._id)}
                                                            disabled={removingItem === item.courseId._id}
                                                        >
                                                            {removingItem === item.courseId._id ? (
                                                                <>
                                                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                                                    Removing...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Remove
                                                                    <i className="bi bi-trash ms-1"></i>

                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="col-lg-4">
                                    <div className="card shadow">
                                        <div className="card-header bg-ivy-tech text-white">
                                            <h5 className="pt-1 mb-0">
                                                <i className="bi bi-receipt me-2"></i>
                                                Course Summary
                                            </h5>
                                        </div>

                                        <div className="card-body">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Courses ({cartItems.length}):</span>
                                            </div>

                                            <ul>
                                                {cartItems.map((item) => (
                                                    <li key={item.courseId._id}>{item.courseId.name}</li>
                                                ))}
                                            </ul>

                                            <hr />
                                            <div className="d-flex justify-content-between mb-3">
                                                <strong>Total:</strong>
                                                <strong className="text-ivy-tech">
                                                    {cartItems.length}{cartItems.length == 1 ? ' Course' : ' Courses'}
                                                </strong>
                                            </div>

                                            {(schedules.length > 0) && (
                                                <div className="mb-3 form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={useExistingSchedule}
                                                        onChange={(e) => {
                                                            setUseExistingSchedule(e.target.checked);
                                                            if (!e.target.checked) {
                                                                setSelectedScheduleId('');
                                                            }
                                                        }}
                                                        id="useExistingSchedule"
                                                    />
                                                    <label className="form-check-label" htmlFor="useExistingSchedule">
                                                        Add to existing schedule
                                                    </label>
                                                </div>
                                            )}

                                            {useExistingSchedule ? (
                                                <div className="mb-3">
                                                    <label className="form-label">Select Existing Schedule</label>
                                                    <select
                                                        className="form-select"
                                                        value={selectedScheduleId}
                                                        onChange={(e) => setSelectedScheduleId(e.target.value)}
                                                    >
                                                        <option value="">Choose a schedule</option>
                                                        {schedules.map(s => (
                                                            <option key={s._id} value={s._id}>
                                                                {s.term} {s.year}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="mb-3">
                                                        <label className="form-label">Select Term</label>
                                                        <select
                                                            className="form-select"
                                                            value={checkoutTerm}
                                                            onChange={(e) => setCheckoutTerm(e.target.value)}
                                                        >
                                                            <option value="">Choose a Term</option>
                                                            {TERMS.map(term => (
                                                                <option key={term} value={term}>{term}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label">Year</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={checkoutYear}
                                                            min="2000"
                                                            max="2100"
                                                            onChange={(e) => setCheckoutYear(parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            <button
                                                className="btn btn-ivy-tech w-100"
                                                onClick={addToSchedule}
                                                disabled={loading || submitting}
                                            >
                                                {submitting ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-calendar me-1"></i>
                                                        Add to schedule
                                                    </>
                                                )}
                                            </button>
                                            <div className="text-center mt-3">
                                                <small className="text-muted">
                                                    Secure checkout powered by Ivy Tech
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 