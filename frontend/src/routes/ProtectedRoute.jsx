import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const location = useLocation();

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (allowedRole && role !== allowedRole) {
        if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
        if (role === "faculty") return <Navigate to="/faculty/dashboard" replace />;
        if (role === "student") return <Navigate to="/student/dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;