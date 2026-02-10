import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";

const GROUPS_ROUTE = "/groups";

function Dashboard() {
    const user = useSelector((state) => state.userDetails);


    if (!user) {
        console.warn("Dashboard: user not loaded");
        console.log(user);
        return <Loading text="Loading dashboard..." />;
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4 text-center">

                            <h4 className="fw-bold text-dark mb-2">
                                Welcome, {user.name}
                            </h4>

                            <p className="text-muted mb-4">
                                Your expense-tracking companion to manage
                                group spending effortlessly.
                            </p>

                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                                <Link
                                    to={GROUPS_ROUTE}
                                    className="btn btn-primary rounded-pill fw-bold px-4"
                                >
                                    View Groups
                                </Link>

                                <Link
                                    to={GROUPS_ROUTE}
                                    className="btn btn-outline-secondary rounded-pill fw-bold px-4"
                                >
                                    Create / Manage Groups
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
