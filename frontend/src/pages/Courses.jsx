import ComingSoon from "../components/ComingSoon";
import { useState, useEffect } from "react";
import CourseService from '../services/CourseService.js';


function Courses() {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    const fetchCourses = async () => {
        try {
            const courseData = await CourseService.getAllCourses();

            console.log('courseData:', courseData);

            setCourses(courseData);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to load courses. Please try again later.');
        }
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

                    <div className="my-4">
                        <button className="btn btn-ivy-tech">
                            Search Courses
                        </button>
                    </div>

                    <ul>
                        {courses.length > 0 ? (
                            courses.map(course => (
                                <li key={course._id}>
                                    <h3>{course.prefix}-{course.number}</h3>
                                    <p>{course.description}</p>
                                </li>
                            ))
                        ) : (
                            <ComingSoon text="No courses available at the moment." />
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
};

export default Courses;