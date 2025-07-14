import ComingSoon from "../components/ComingSoon"

function Courses() {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <div className="text-center">
                        <h1 className="display-4 mb-4">Available Courses</h1>
                        <p className="lead mb-4">
                            Browse and explore our comprehensive course catalog.
                        </p>

                        <ComingSoon text="Course listings will be available here." />

                        <div className="mt-4">
                            <button className="btn btn-ivy-tech">
                                Search Courses
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Courses 