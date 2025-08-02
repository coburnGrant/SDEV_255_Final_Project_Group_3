import { Link, useNavigate } from "react-router-dom";
import IvyTechSpinner from "../components/IvyTechSpinner";
import ScheduleService from "../services/ScheduleService";
import { useEffect, useState } from "react";


const TERMS = ["Spring", "Summer", "Fall"];
const CURRENT_YEAR = new Date().getFullYear();

export default function Schedules() {

    const navigate = useNavigate();

    const [schedules, setSchedules] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [term, setTerm] = useState('');
    const [year, setYear] = useState(CURRENT_YEAR);

    const loadSchedules = async () => {
        setLoading(true);

        try {
            const currentSchedules = await ScheduleService.getSchedules(term, year);

            console.log('schedules', currentSchedules);
            if (currentSchedules) {
                setSchedules(currentSchedules);
            } else {
                setSchedules([]);
            }
        } catch(error) {
            const errMsg = error.response.data.message
            setError(`Failed to get schedules${errMsg ? `: ${errMsg}` : ''}`)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSchedules();
    }, []);

    const handleSearch = () => {
        loadSchedules();
    };

    return <div className="container">

        <div className="mb-4 d-flex gap-3 align-items-end flex-wrap">
            <div>
                <label className="form-label">Year</label>
                <input
                    type="number"
                    className="form-control"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    min="2000"
                    max="2100"
                />
            </div>

            <div>
                <label className="form-label">Term</label>
                <select
                    className="form-select"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                >
                    <option value="">All Terms</option>
                    {TERMS.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>

            <button className="btn btn-ivy-tech" onClick={handleSearch}>
                <i className="bi bi-search me-1"></i> Search Schedules
            </button>
        </div>

        {loading &&
            <IvyTechSpinner />
        }

        {error && (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        )}

        {schedules.length === 0 ? (
            <div className="text-center py-5">
                <i className="bi bi-calendar fs-2 text-muted mb-3"></i>
                <h4 className="text-muted">You have no existing schedules.</h4>
                <p className="text-muted">Check your search or start shopping by browsing our courses or adding your courses in your cart to a new schedule!</p>
                <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                    <button className="btn btn-ivy-tech" onClick={() => navigate('/courses')}>
                        <i className="bi bi-search me-1"></i> Browse Courses
                    </button>
                    <button className="btn btn-ivy-tech" onClick={() => navigate('/cart')}>
                        <i className="bi bi-cart me-1"></i> Go to Cart
                    </button>
                </div>
            </div>
        ) : (
            <div>
                <h5 className="mb-4">Schedules Found: {schedules.length}</h5>
                <div className="row g-3">
                    {schedules.map((s, idx) => (
                        <div className="col-md-6 col-lg-6" key={s._id || idx}>
                            <Link to={`${s._id}`} className="text-decoration-none text-dark">
                                <div className="card h-100 shadow-sm border-0 hover-shadow">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-calendar text-muted me-2 fs-5"></i>
                                            <h4 className="card-title ivy-tech-text fw-bold mb-0">
                                                {s.term} {s.year}
                                            </h4>
                                        </div>

                                        <p className="card-text text-muted mb-1">
                                            📚 {s.courses.length} course{s.courses.length !== 1 ? 's' : ''}
                                        </p>

                                        <small className="text-muted">
                                            Last updated: {new Date(s.updatedAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </small>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
}