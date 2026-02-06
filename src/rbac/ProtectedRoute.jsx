import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ roles, children }) {
    const user = useSelector((state) => state.userDetails);

    if (roles.includes(user?.role)) {
        return children;
    }

    return <Navigate to="/unauthorized-access" />;
}

export default ProtectedRoute;
