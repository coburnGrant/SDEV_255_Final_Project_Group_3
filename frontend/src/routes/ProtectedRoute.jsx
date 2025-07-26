import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authService } from "../services/AuthService";

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        authenticate().catch(() => {
            setIsAuthenticated(false);
        })
    })

    const authenticate = async () => {
        // Make call to backend to get auth status
        const authenticated = await authService.status();

        setIsAuthenticated(authenticated);
    }

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    } else {
        return isAuthenticated ? children : <Navigate to="/login" replace/>;
    }
}

export default ProtectedRoute;