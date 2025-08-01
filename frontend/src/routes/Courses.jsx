import ComingSoon from "../components/ComingSoon";
import { useState, useEffect } from "react";
import CourseService from '../services/CourseService.js';
import CourseListRow from "../components/course/CourseListRow.jsx";

function Courses() {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchActive, setSearchActive] = useState(false);

    const fetchCourses = async () => {
        setLoading(true);

        if (error !== null) {
            setError(null);
        }

        try {
            const courseData = await CourseService.getAllCourses();
            setCourses(courseData);
            setFilteredCourses(courseData);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to load courses. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Search and filter courses
    const handleSearch = (searchValue) => {
        setSearchTerm(searchValue);
        
        if (!searchValue.trim()) {
            setFilteredCourses(courses);
            setSearchActive(false);
            return;
        }

        setSearchActive(true);
        
        const filtered = courses.filter(course => {
            const searchLower = searchValue.toLowerCase();
            
            // Search in multiple fields
            return (
                course.name?.toLowerCase().includes(searchLower) ||
                course.prefix?.toLowerCase().includes(searchLower) ||
                course.number?.toLowerCase().includes(searchLower) ||
                course.description?.toLowerCase().includes(searchLower) ||
                course.instructor?.toLowerCase().includes(searchLower) ||
                course.level?.toLowerCase().includes(searchLower) ||
                course.program?.toLowerCase().includes(searchLower) ||
                `${course.prefix}-${course.number}`.toLowerCase().includes(searchLower)
            );
        });
        
        setFilteredCourses(filtered);
    };

    // Clear search
    const clearSearch = () => {
        setSearchTerm('');
        setFilteredCourses(courses);
        setSearchActive(false);
    };

    // Fetch courses from the backend when the component mounts
    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <div className="text-center">
                        <h1 className="display-4 mb-4">Available Courses</h1>
                        <p className="lead mb-4">
                            Browse and explore our comprehensive course catalog.
                        </p>

                        {error && <div className="alert alert-danger">{error}</div>}
                    </div>

                    {/* Search Section */}
                    <div className="my-4">
                        <div className="row justify-content-center">
                            <div className="col-md-8 col-lg-6">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search courses by name or number"
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                    {searchActive && (
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={clearSearch}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    )}
                                    <button className="btn btn-ivy-tech" type="button">
                                        <i className="bi bi-search me-1"></i>
                                        Search
                                    </button>
                                </div>
                                
                                {/* Search Results Info */}
                                {searchActive && (
                                    <div className="mt-2 text-center">
                                        <small className="text-muted">
                                            Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} 
                                            {searchTerm && ` for "${searchTerm}"`}
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className="d-flex justify-content-center m-3">
                            <div className="spinner-border ivy-tech-text" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    {/* No Search Results */}
                    {!loading && searchActive && filteredCourses.length === 0 && (
                        <div className="text-center py-5">
                            <i className="bi bi-search fs-1 text-muted mb-3"></i>
                            <h4 className="text-muted">No courses found</h4>
                            <p className="text-muted">
                                No courses match your search for "{searchTerm}"
                            </p>
                            <button
                                className="btn btn-ivy-tech"
                                onClick={clearSearch}
                            >
                                <i className="bi bi-arrow-left me-1"></i>
                                View All Courses
                            </button>
                        </div>
                    )}

                    {/* Course List */}
                    {!loading && (
                        <ul>
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map(course => (
                                    <CourseListRow key={course._id} course={course} />
                                ))
                            ) : !searchActive ? (
                                <ComingSoon text="No courses available at the moment." />
                            ) : null}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Courses;