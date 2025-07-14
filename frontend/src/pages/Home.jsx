import ComingSoon from "../components/ComingSoon"

function Home() {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <div className="text-center">
                        <h1 className="display-4 mb-4">Welcome to Ivy Tech Course Manager</h1>
                        <p className="lead mb-4">
                            A comprehensive course management system for students and teachers.
                        </p>

                        <ComingSoon text="This page is currently under development." />

                        <div className="mt-4">
                            <button className="btn me-3 btn-ivy-tech">
                                Browse Courses
                            </button>
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