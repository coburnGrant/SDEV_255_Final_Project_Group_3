
function ComingSoon({ text }) {
    return (
        <div className="alert alert-success">
            <h4 className="alert-heading">Coming Soon!</h4>
            <p>{text}</p>
            <p>Check back soon for updates.</p>
        </div>
    )
}

export default ComingSoon