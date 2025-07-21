import CourseForm from "../components/course/CourseForm";
import CourseService from "../services/CourseService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddCourse() {
    const navigate = useNavigate();
    const [lastSavedCourse, setLastSavedCourse] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const createCourse = async (data) => {
        setSaving(true);
        setLastSavedCourse(data);

        try {
            const course = await CourseService.createCourse(data);

            navigate(`../courses/${course._id}`);
        } catch (error) {
            setError(error);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <div className="text-center">
                        <div className="d-flex justify-content-center align-items-center mb-4">
                            <h1 className="display-4">Add New Course</h1>

                            {saving &&
                                <div className="spinner-border ivy-tech-text ms-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            }
                        </div>

                        <p className="lead mb-4">
                            Create a new course listing for students to enroll in.
                        </p>

                        {error && (
                            <div>{error}</div>
                        )}
                    </div>

                    <CourseForm course={lastSavedCourse} onSubmit={createCourse} />
                </div>
            </div>
        </div>
    )
}

export default AddCourse 