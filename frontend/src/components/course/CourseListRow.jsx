import { Link } from "react-router-dom";

function CourseListRow({ course }) {
    const courseLink = `/courses/${course._id}`;
    
    return (
        <li className="course-list-item p-4">
            <h3>
                <Link to={courseLink} className="ivy-tech-text text-decoration-none">
                    {course.prefix}-{course.number} | {course.name}
                </Link>
            </h3>
            <p>{course.description}</p>
        </li>
    );
}

export default CourseListRow;