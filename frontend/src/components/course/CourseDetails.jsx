import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CourseService from '../../services/CourseService.js';

function CourseDetails() {
    // Grab the courseId from the URL
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCourse = async () => {
        try {
            const course = await CourseService.getCourseById(courseId);

            console.log('Fetched course:', course);

            setCourse(course);
        } catch (error) {
            console.error('Error fetching course:', error);
            setCourse(null);
        } finally {
            setLoading(false);
        }
    };

    const deleteCourse = async() => {
        const confirmation = confirm('Are you sure you want to delete this course?');

        if(!confirmation) {
            return
        }

        setLoading(true);

        try {
            await CourseService.deleteCourse(courseId);
            // Go back to list of courses
            navigate('../courses');
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    return (
        <div className="container">
            <Link to="/courses" className="btn btn-plain ivy-tech-text my-3">
                <span><i className="bi bi-arrow-left"></i> Back to Courses</span>
            </Link>

            {loading && <p>Loading course details...</p>}

            {error && <p>Error: {error}</p>}

            <div>
                <h3 className="text-muted mb-1">{course?.prefix}-{course?.number}</h3>
                <h2 className="fw-bold">{course?.name}</h2>
                <h6 className="text-secondary mb-2">{course?.program}</h6>


                {course?.dateOfLastRevision && (
                    <p className="text-sm text-gray-500">
                        <span className="font-medium">Last Revised:</span> {new Date(course.dateOfLastRevision).toLocaleDateString()}
                    </p>
                )}
            </div>

            {/* Course Description */}
            <p>
                {course?.description || 'No description available.'}
            </p>

            <hr className="my-4" />

            <div className="mb-2">
                {/* Course Pre-reqs */}
                <h6>Prerequisites:</h6>

                {course?.prerequisites?.count > 0 ? (
                    <ul className="list-disc pl-5">
                        {course.prerequisites.map((prerequisite, index) => (
                            <li key={index}>{prerequisite}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No prerequisites required.</p>
                )}

                {/* Course Credit Hours */}
                <h6>Credit hours</h6>
                <ul>
                    <li>Minimum: {course?.creditHoursMin ? course.creditHoursMin : 'No min'}</li>
                    <li>Maximum: {course?.creditHoursMax ? course.creditHoursMax : 'No max'}</li>
                </ul>
            </div>

            <hr className="my-4" />

            <h6>Course Content - Topics of Study</h6>
            {course?.topics ? (
                <ul>
                    {course.topics.map((topic, index) => (
                        <li key={index}>{topic}</li>
                    ))}
                </ul>

            ) : (
                <p>No course topics</p>
            )}

            <div className="d-flex justify-content-end">
                <Link to={'./edit'} className="btn btn-ivy-tech me-2">
                    <span>Edit<i className="bi bi-pencil ms-2"></i></span>
                </Link>

                <button className="btn btn-danger" onClick={deleteCourse}>
                    <span>Delete<i className="bi bi-trash ms-2"></i></span>
                </button>
            </div>
        </div>
    );
};

export default CourseDetails;