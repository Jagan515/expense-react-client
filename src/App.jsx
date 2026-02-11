import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Groups from "./pages/Groups";
import GroupExpenses from "./pages/GroupExpenses";
import ManageUsers from "./pages/ManageUsers";
import Account from "./pages/Account";
import ManagePayments from "./pages/ManagePayments";

import AppLayout from "./components/AppLayout";
import UserLayout from "./components/UserLayout";
import UnauthorizedAccess from "./components/erros/UnauthorizedAccess";
import Loading from "./components/Loading";

import ProtectedRoute from "./rbac/ProtectedRoute";

import { serverEndpoint } from "./config/appConfig";
import ManageSubscription from "./pages/ManageSubscription";

import { SET_USER, CLEAR_USER } from "./redux/user/action";

const ROUTES = {
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    GROUPS: "/groups",
    ACCOUNT: "/account",
};

function App() {
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.post(
                `${serverEndpoint}/auth/is-user-logged-in`,
                {},
                { withCredentials: true }
            );

            dispatch({
                type: SET_USER,
                payload: response.data.user,
            });
        } catch (error) {
            if (error.response?.status === 401) {
                dispatch({ type: CLEAR_USER });
            } else {
                console.error("Auth check failed:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    if (loading) {
        return <Loading text="Checking authentication..." />;
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    userDetails ? (
                        <Navigate to={ROUTES.DASHBOARD} />
                    ) : (
                        <AppLayout>
                            <Home />
                        </AppLayout>
                    )
                }
            />

            <Route
                path={ROUTES.LOGIN}
                element={
                    userDetails ? (
                        <Navigate to={ROUTES.DASHBOARD} />
                    ) : (
                        <AppLayout>
                            <Login />
                        </AppLayout>
                    )
                }
            />

            <Route
                path={ROUTES.DASHBOARD}
                element={
                    userDetails ? (
                        <UserLayout>
                            <Dashboard />
                        </UserLayout>
                    ) : (
                        <Navigate to={ROUTES.LOGIN} />
                    )
                }
            />

            <Route
                path="/manage-users"
                element={
                    userDetails ? (
                        <ProtectedRoute roles={["admin"]}>
                            <UserLayout>
                                <ManageUsers />
                            </UserLayout>
                        </ProtectedRoute>
                    ) : (
                        <Navigate to={ROUTES.LOGIN} />
                    )
                }
            />

            <Route
                path={ROUTES.GROUPS}
                element={
                    userDetails ? (
                        <UserLayout>
                            <Groups />
                        </UserLayout>
                    ) : (
                        <Navigate to={ROUTES.LOGIN} />
                    )
                }
            />

            <Route
                path="/groups/:groupId"
                element={
                    userDetails ? (
                        <UserLayout>
                            <GroupExpenses />
                        </UserLayout>
                    ) : (
                        <Navigate to={ROUTES.LOGIN} />
                    )
                }
            />

            <Route
                path="/logout"
                element={
                    userDetails ? (
                        <Logout />
                    ) : (
                        <Navigate to={ROUTES.LOGIN} />
                    )
                }
            />

            <Route
                path="/register"
                element={
                    userDetails ? (
                        <Navigate to={ROUTES.DASHBOARD} />
                    ) : (
                        <AppLayout>
                            <Register />
                        </AppLayout>
                    )
                }
            />

            <Route
                path="/reset-password"
                element={
                    <AppLayout>
                        <ResetPassword />
                    </AppLayout>
                }
            />

            <Route
                path="/unauthorized-access"
                element={
                    userDetails ? (
                        <UserLayout>
                            <UnauthorizedAccess />
                        </UserLayout>
                    ) : (
                        <AppLayout>
                            <UnauthorizedAccess />
                        </AppLayout>
                    )
                }
            />

            <Route
                path={ROUTES.ACCOUNT}
                element={
                    userDetails ? (
                        <UserLayout>
                            <Account />
                        </UserLayout>
                    ) : (
                        <Navigate to={ROUTES.LOGIN} />
                    )
                }
            />

            <Route
                path="/manage-payments"
                element={
                    userDetails ? (
                        <ProtectedRoute roles={["admin"]}>
                            <UserLayout>
                                <ManagePayments />
                            </UserLayout>
                        </ProtectedRoute>
                    ) : (
                        <Navigate to={ROUTES.LOGIN} />
                    )
                }
            />
            <Route
                path="/manage-subscription"
                element={
                    userDetails ? (
                        <ProtectedRoute roles={["admin"]}>
                            <UserLayout>
                                <ManageSubscription />
                            </UserLayout>
                        </ProtectedRoute>
                    ) : (
                        <Navigate to={ROUTES.LOGIN} />
                    )
                }
            />

        </Routes>
    );
}

export default App;
