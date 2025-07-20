import { Link } from "react-router-dom";

function CourseListRow({ course }) {
    const courseLink = `/courses/${course._id}`;
    
    return (
        <li className="list-group-item">
            <h3>
                <Link to={courseLink}>
                    {course.prefix}-{course.number} - {course.name}
                </Link>
            </h3>
            <p>{course.description}</p>
        </li>
    );
}

export default CourseListRow;