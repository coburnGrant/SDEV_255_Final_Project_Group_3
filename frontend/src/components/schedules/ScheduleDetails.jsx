import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import IvyTechSpinner from '../IvyTechSpinner'
import ScheduleService from "../../services/ScheduleService";

export default function ScheduleDetails() {
    const { scheduleId } = useParams();
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadSchedule = async () => {
        setLoading(true);
        try {
            const result = await ScheduleService.getScheduleById(scheduleId);
            setSchedule(result);
        } catch (err) {
            console.error(err);
            setError("Failed to load schedule.");
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (courseId) => {
        const response = confirm('Are you sure you want to drop this course?');

        if (!response) {
            return;
        }
        
        setLoading(true);

        try {
            await ScheduleService.dropCourseFromSchedule(scheduleId, courseId);
            
            await loadSchedule(); // refresh after drop
        } catch (err) {
            const errMsg = err.response.data.message;
            alert(`Error dropping course${errMsg ? `: ${errMsg}` : ''}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSchedule();
    }, [scheduleId]);

    if (loading && !schedule) return <IvyTechSpinner />;
    if (error) return <div className="alert alert-danger m-3">{error}</div>;
    if (!schedule) return null;

    return (
        <div className="container py-4">
            <h2 className="mb-4">
                {schedule.term} {schedule.year} Schedule
            </h2>

            {loading && 
                <IvyTechSpinner />
            }

            {schedule.courses.length === 0 ? (
                <p className="text-muted">No courses in this schedule.</p>
            ) : (
                <ul className="list-group">
                    {schedule.courses.map((item) => {
                        let badgeColor = "bg-secondary";
                        let badgeLabel = item.status;

                        switch (item.status) {
                            case "enrolled":
                                badgeColor = "bg-success";
                                badgeLabel = "Enrolled";
                                break;
                            case "dropped":
                                badgeColor = "bg-danger";
                                badgeLabel = "Dropped";
                                break;
                            case "waitlisted":
                                badgeColor = "bg-warning text-dark";
                                badgeLabel = "Waitlisted";
                                break;
                            default:
                                badgeColor = "bg-secondary";
                                badgeLabel = item.status;
                        }

                        return (
                            <li
                                key={item._id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <Link to={`/courses/${item.course._id}`} className="ivy-tech-text text-decoration-none">
                                        {item.course.prefix}-{item.course.number} | {item.course.name}
                                    </Link>

                                    <span className={`badge ${badgeColor} ms-2`}>{badgeLabel}</span>
                                </div>

                                {item.status !== "dropped" && (
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDrop(item.course._id)}
                                    >
                                        Drop
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}