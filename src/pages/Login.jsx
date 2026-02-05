import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import { serverEndpoint } from "../config/appConfig";
import { SET_USER } from "../redux/user/action";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;

        if (!formData.email) {
            newErrors.email = "Email is required";
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        try {
            const response = await axios.post(
                `${serverEndpoint}/auth/login`,
                {
                    email: formData.email,
                    password: formData.password,
                },
                { withCredentials: true }
            );

            dispatch({
                type: SET_USER,
                payload: response.data.user,
            });

            setMessage("User authenticated");
            setErrors({});
        } catch (error) {
            setErrors({
                message:
                    error.response?.data?.error ||
                    "Something went wrong, please try again",
            });
        }
    };

    const handleGoogleSuccess = async (authResponse) => {
        try {
            const response = await axios.post(
                `${serverEndpoint}/auth/google-auth`,
                { idToken: authResponse?.credential },
                { withCredentials: true }
            );

            dispatch({
                type: SET_USER,
                payload: response.data.user,
            });
        } catch (error) {
            setErrors({
                message: "Unable to process google sso, please try again",
            });
        }
    };

    const handleGoogleFailure = () => {
        setErrors({
            message:
                "Something went wrong while performing google single sign-on",
        });
    };

    const handleResetPassword = async () => {
        if (!formData.email) {
            setErrors({ email: "Please enter email to reset password" });
            return;
        }

        try {
            await axios.post(`${serverEndpoint}/auth/reset-password`, {
                email: formData.email,
            });

            setMessage("OTP sent to your email");
            setErrors({});
            navigate("/reset-password", {
                state: { email: formData.email },
            });
        } catch (error) {
            setErrors({
                message:
                    error.response?.data?.msg ||
                    "Unable to send reset password email",
            });
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-dark">
                                    Welcome{" "}
                                    <span className="text-primary">Back</span>
                                </h2>
                                <p className="text-muted">
                                    Login to manage your MergeMoney account
                                </p>
                            </div>

                            {(message || errors.message) && (
                                <div className="alert alert-danger py-2 small border-0 shadow-sm mb-4">
                                    {message || errors.message}
                                </div>
                            )}

                            <form onSubmit={handleFormSubmit} noValidate>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">
                                        Email Address
                                    </label>
                                    <input
                                        className={`form-control form-control-lg rounded-3 fs-6 ${
                                            errors.email ? "is-invalid" : ""
                                        }`}
                                        type="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        onChange={handleChange}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">
                                        Password
                                    </label>
                                    <input
                                        className={`form-control form-control-lg rounded-3 fs-6 ${
                                            errors.password ? "is-invalid" : ""
                                        }`}
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        onChange={handleChange}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                <div className="text-end mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-link p-0 small"
                                        onClick={handleResetPassword}
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <button className="btn btn-primary w-100 btn-md rounded-pill fw-bold shadow-sm mb-4">
                                    Sign In
                                </button>
                            </form>

                            <div className="d-flex align-items-center my-2">
                                <hr className="flex-grow-1 text-muted" />
                                <span className="mx-3 text-muted small fw-bold">
                                    OR
                                </span>
                                <hr className="flex-grow-1 text-muted" />
                            </div>

                            <div className="d-flex justify-content-center w-100">
                                <GoogleOAuthProvider
                                    clientId={
                                        import.meta.env.VITE_GOOGLE_CLIENT_ID
                                    }
                                >
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleFailure}
                                        theme="outline"
                                        shape="pill"
                                        text="signin_with"
                                        width="500"
                                    />
                                </GoogleOAuthProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
