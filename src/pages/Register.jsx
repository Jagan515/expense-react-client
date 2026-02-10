import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { SET_USER } from "../redux/user/action";
import { serverEndpoint } from "../config/appConfig";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let errors = {};
        let isValid = true;

        if (!formData.name) {
            errors.name = "Name is required";
            isValid = false;
        }

        if (!formData.email) {
            errors.email = "Email is required";
            isValid = false;
        }

        if (!formData.password) {
            errors.password = "Password is required";
            isValid = false;
        }

        setFieldErrors(errors);
        return isValid;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!validate()) return;

        try {
            await axios.post(
                `${serverEndpoint}/auth/register`,
                formData,
                { withCredentials: true }
            );

            setMessage("User registered successfully");

            // redirect to login page after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {
            console.error("Registration failed:", error);
            setError("Something went wrong. Please try again.");
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
        } catch (err) {
            console.error("Google signup failed:", err);
            setError("Unable to login with Google");
        }
    };

    const handleGoogleFailure = () => {
        console.error("Google OAuth error");
        setError("Something went wrong while performing Google sign-in");
    };

    return (
        <div className="container text-center py-5">
            <h3>Register</h3>

            {message && <p className="text-success">{message}</p>}
            {error && <p className="text-danger">{error}</p>}

            <div className="row justify-content-center">
                <div className="col-6">
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-3 text-start">
                            <label>Name</label>
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {fieldErrors.name && (
                                <small className="text-danger">
                                    {fieldErrors.name}
                                </small>
                            )}
                        </div>

                        <div className="mb-3 text-start">
                            <label>Email</label>
                            <input
                                className="form-control"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {fieldErrors.email && (
                                <small className="text-danger">
                                    {fieldErrors.email}
                                </small>
                            )}
                        </div>

                        <div className="mb-3 text-start">
                            <label>Password</label>
                            <input
                                className="form-control"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {fieldErrors.password && (
                                <small className="text-danger">
                                    {fieldErrors.password}
                                </small>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                        >
                            Register
                        </button>
                    </form>

                    <div className="mt-4">
                        <GoogleOAuthProvider
                            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                        >
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleFailure}
                            />
                        </GoogleOAuthProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
