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

import AppLayout from "./components/AppLayout";
import UserLayout from "./components/UserLayout";

import { serverEndpoint } from "./config/appConfig";
import { SET_USER, CLEAR_USER } from "./redux/user/action";

function App() {
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);
    const [loading, setLoading] = useState(true);

    const isUserLoggedIn = async () => {
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
        isUserLoggedIn();
    }, []);

    if (loading) {
        return (
            <div className="container text-center">
                <h3>Loading...</h3>
            </div>
        );
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    userDetails ? (
                        <Navigate to="/dashboard" />
                    ) : (
                        <AppLayout>
                            <Home />
                        </AppLayout>
                    )
                }
            />

            <Route
                path="/login"
                element={
                    userDetails ? (
                        <Navigate to="/dashboard" />
                    ) : (
                        <AppLayout>
                            <Login />
                        </AppLayout>
                    )
                }
            />

            <Route
                path="/dashboard"
                element={
                    userDetails ? (
                        <UserLayout>
                            <Groups />
                        </UserLayout>
                    ) : (
                        <Navigate to="/login" />
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
                        <Navigate to="/login" />
                    )
                }
            />

            <Route
                path="/groups"
                element={
                    userDetails ? (
                        <UserLayout>
                            <Groups />
                        </UserLayout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            <Route
                path="/logout"
                element={
                    userDetails ? <Logout /> : <Navigate to="/login" />
                }
            />

            <Route
                path="/register"
                element={
                    userDetails ? (
                        <Navigate to="/dashboard" />
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
        </Routes>
    );
}

export default App;
