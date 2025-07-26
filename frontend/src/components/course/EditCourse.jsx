import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CourseService from '../../services/CourseService.js';
import CourseForm from "./CourseForm.jsx";

function EditCourse() {
    // Grab the courseId from the URL
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchCourse = async () => {
        try {
            let course = await CourseService.getCourseById(courseId);

            setCourse(course);
        } catch (error) {
            console.error('Error fetching course:', error);
            setCourse(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const updateCourse = async (data) => {
        try {
            setSaving(true);

            await CourseService.updateCourse(courseId, data);

            alert('Course updated successfully');

            // Navigate back to course details
            navigate(`/courses/${courseId}`);
        } catch (error) {
            console.error('Error updating course', error);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="container mt-3">
            <Link to="/courses" className="btn btn-plain ivy-tech-text mb-1">
                <span><i className="bi bi-arrow-left pe-1"></i>Back</span>
            </Link>

            <div className="d-flex align-items-center">
                <h3 className="text-muted mb-1">Editing</h3>
                <i className="bi bi-pencil-fill ms-2 ivy-tech-text"></i>

                {saving &&
                    <div className="spinner-border ivy-tech-text mx-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                }
            </div>

            <h2 className="fw-bold ivy-tech-text mb-2">{course?.prefix}-{course?.number} | {course?.name}</h2>

            {loading && <p>Loading course details...</p>}

            <CourseForm course={course} onSubmit={updateCourse} />
        </div>
    )
}

export default EditCourse;