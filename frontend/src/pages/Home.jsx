import ComingSoon from "../components/ComingSoon"
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import CourseService from "../services/CourseService";
import TrendingCoursesCard from "../components/home/TrendingCoursesCard";

function Home() {
    const [loading, setLoading] = useState(false);
    const [trendingCourses, setTrendingCourses] = useState([]);
    const [error, setError] = useState(null);

    const fetchTrendingCourses = async () => {
        setLoading(true);

        if (error !== null) {
            setError(null);
        }

        try {
            const courses = await CourseService.getTrendingCourses();

            setTrendingCourses(courses);
        } catch {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchTrendingCourses();
    }, [])

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <div className="text-center">
                        <h1 className="display-4 mb-4">Welcome to Ivy Tech Course Manager</h1>
                        <p className="lead mb-4">
                            A comprehensive course management system for students and teachers.
                        </p>

                        <div className="col-12">
                            <TrendingCoursesCard
                                loading={loading}
                                error={error}
                                courses={trendingCourses}
                            />
                        </div>

                        <div className="mt-4">
                            <Link to='./courses' className="btn me-3 btn-ivy-tech">
                                Browse Courses
                            </Link>
                            <button className="btn btn-outline-secondary">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home 