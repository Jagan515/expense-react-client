import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function UserHeader() {
    const user = useSelector((state) => state.userDetails);

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top">
            <div className="container-fluid px-4">

                {/* Brand */}
                <Link className="navbar-brand fw-bold text-primary" to="/dashboard">
                    <span className="text-primary">Merge</span>Money
                </Link>

                {/* Mobile toggle */}
                <button
                    className="navbar-toggler shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                    {/* Left links */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-2">

                        <li className="nav-item">
                            <Link className="nav-link fw-medium" to="/dashboard">
                                Dashboard
                            </Link>
                        </li>

                        {/* Manage Credits */}
                        <li className="nav-item">
                            <Link className="nav-link fw-medium" to="/manage-payments">
                                Manage Credits
                            </Link>
                        </li>

                        {/* Manage Subscription */}
                        <li className="nav-item">
                            <Link className="nav-link fw-medium" to="/manage-subscription">
                                Manage Subscriptions
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link fw-medium" to="/groups">
                                My Groups
                            </Link>
                        </li>

                    </ul>

                    {/* Right links */}
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">

                        {/* Account */}
                        <li className="nav-item">
                            <Link
                                className="nav-link fw-semibold text-dark"
                                to="/account"
                            >
                                <i className="bi bi-person-circle me-1"></i>
                                Account
                            </Link>
                        </li>

                        {/* Admin-only */}
                        {user?.role === "admin" && (
                            <li className="nav-item">
                                <Link
                                    className="nav-link fw-medium"
                                    to="/manage-users"
                                >
                                    <i className="bi bi-person-check me-1"></i>
                                    Manage Users
                                </Link>
                            </li>
                        )}

                        {/* Logout */}
                        <li className="nav-item">
                            <Link
                                className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                to="/logout"
                            >
                                Logout
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default UserHeader;
