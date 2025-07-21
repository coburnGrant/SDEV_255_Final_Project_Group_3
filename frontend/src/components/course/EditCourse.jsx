import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, use } from "react";
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

            console.log('Fetched course:', course);

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
            console.log('updating course...');

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
            {loading && <p>Loading course details...</p>}
            <p>Editing</p>

            <div className="d-flex align-items-center">
                <h2>{course?.prefix}-{course?.number} | {course?.name}</h2>

                {saving &&
                    <div class="spinner-border ivy-tech-text mx-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                }
            </div>

            <CourseForm course={course} onSubmit={updateCourse} />
        </div>
    )
}

export default EditCourse;