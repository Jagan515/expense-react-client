import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import { serverEndpoint } from "../config/appConfig";
import { SET_USER } from "../redux/user/action";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const validateForm = () => {
        if (!email) {
            setError("Email is required");
            return false;
        }

        if (!password) {
            setError("Password is required");
            return false;
        }

        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!validateForm()) return;

        try {
            const res = await axios.post(
                `${serverEndpoint}/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            dispatch({
                type: SET_USER,
                payload: res.data.user,
            });

            setMessage("Login successful");
        } catch (err) {
            console.error("Login failed:", err);
            setError(
                err.response?.data?.error ||
                "Login failed. Please try again."
            );
        }
    };

    const handleGoogleSuccess = async (res) => {
        try {
            const response = await axios.post(
                `${serverEndpoint}/auth/google-auth`,
                { idToken: res.credential },
                { withCredentials: true }
            );

            dispatch({
                type: SET_USER,
                payload: response.data.user,
            });
        } catch (error) {
            console.error("Google login failed:", error);
            setError("Google login failed");
        }
    };

    const handleGoogleError = () => {
        console.error("Google OAuth error");
        setError("Google login error");
    };

    const handleResetPassword = async () => {
        if (!email) {
            setError("Enter email to reset password");
            return;
        }

        try {
            await axios.post(
                `${serverEndpoint}/auth/reset-password`,
                { email }
            );

            navigate("/reset-password", { state: { email } });
        } catch (error) {
            console.error("Reset password failed:", error);
            setError("Unable to send reset password email");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card p-4 shadow">

                        <h3 className="text-center mb-3">Login</h3>

                        {(error || message) && (
                            <div className="alert alert-danger">
                                {error || message}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <input
                                type="email"
                                className="form-control mb-3"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                type="password"
                                className="form-control mb-3"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                            >
                                Login
                            </button>
                        </form>

                        <button
                            type="button"
                            className="btn btn-link mt-2"
                            onClick={handleResetPassword}
                        >
                            Forgot Password?
                        </button>

                        <GoogleOAuthProvider
                            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                        >
                            <div className="mt-3 text-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                />
                            </div>
                        </GoogleOAuthProvider>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
