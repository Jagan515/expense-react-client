import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ roles, children }) {
    const user = useSelector((state) => state.userDetails);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!roles.includes(user.role)) {
        console.log("user role is not a admin")
        return <Navigate to="/unauthorized-access" />;
    }

    return children;
}

export default ProtectedRoute;
