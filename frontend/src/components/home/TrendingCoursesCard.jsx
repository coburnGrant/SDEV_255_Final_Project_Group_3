import React from 'react';
import { Link } from 'react-router-dom';

const TrendingCoursesCard = ({ loading, error, courses }) => {
    return (
        <div className="card shadow-sm mb-5">
            <div className="card-body">
                <h3 className="card-title text-center mb-4">Trending Courses 🔥 📈</h3>

                {loading && (
                    <div className="d-flex justify-content-center m-3">
                        <div className="spinner-border ivy-tech-text" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="text-center text-danger">{error}</p>
                )}

                {!loading && !error && courses.length > 0 && (
                    <ol className="list-group list-group-numbered">
                        {courses.map(course => (
                            <li
                                key={course._id}
                                className="list-group-item d-flex justify-content-between align-items-start course-list-item"
                            >
                                <div className="ms-2 me-auto">
                                    <Link
                                        to={`/courses/${course._id}`}
                                        className="fw-semibold text-decoration-none ivy-tech-text"
                                    >
                                        {course.prefix}-{course.number} | {course.name}
                                    </Link>
                                </div>
                                <span className="badge bg-secondary rounded-pill">
                                    {course.clickCount} views
                                </span>
                            </li>
                        ))}
                    </ol>
                )}

                {!loading && !error && courses.length === 0 && (
                    <p className="text-center text-muted">No trending courses found.</p>
                )}
            </div>
        </div>
    );
};

export default TrendingCoursesCard;