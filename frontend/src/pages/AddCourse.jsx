import ComingSoon from '../components/ComingSoon'

function AddCourse() {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <div className="text-center">
                        <h1 className="display-4 mb-4">Add New Course</h1>
                        <p className="lead mb-4">
                            Create a new course listing for students to enroll in.
                        </p>

                        <ComingSoon text="Course creation form will be available here." />

                        <div className="mt-4">
                            <button className="btn btn-ivy-tech">
                                Create Course
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddCourse 