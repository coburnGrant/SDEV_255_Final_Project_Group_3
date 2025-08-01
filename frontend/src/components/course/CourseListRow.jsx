import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";

function CourseListRow({ course }) {
    const courseLink = `/courses/${course._id}`;

    const presentableDescription = () => {
        const desc = course.description || '';
        const charLimit = 200;

        if (desc.length <= charLimit) {
            return desc;
        }

        // Find the last space within the character limit to avoid cutting words
        const trimmed = desc.substring(0, charLimit);
        const lastSpaceIndex = trimmed.lastIndexOf(' ');
        
        if (lastSpaceIndex > 0) {
            return trimmed.substring(0, lastSpaceIndex) + '...';
        }
    }
    
    return (
        <li className="course-list-item p-4">
            <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1 me-3">
                    <h3 className="mb-2">
                        <Link to={courseLink} className="ivy-tech-text text-decoration-none">
                            {course.prefix}-{course.number} | {course.name}
                        </Link>
                    </h3>

                    <p className="text-muted mb-3">{presentableDescription()}</p>
                </div>
                
                <div className="flex-shrink-0 align-self-center">
                    <AddToCartButton courseId={course._id} />
                </div>
            </div>
        </li>
    );
}

export default CourseListRow;