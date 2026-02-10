import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";


import { serverEndpoint } from "../config/appConfig";

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const email =
        location.state?.email ||
        localStorage.getItem("resetEmail") ||
        "";

    const [formData, setFormData] = useState({
        otp: "",
        newPassword: "",
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validate = () => {
        let errors = {};

        if (!formData.otp) {
            errors.otp = "OTP is required";
        }

        if (!formData.newPassword) {
            errors.newPassword = "New password is required";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Email missing. Please restart reset flow.");
            return;
        }

        if (!validate()) return;

        try {
            setLoading(true);

            await axios.post(
                `${serverEndpoint}/auth/change-password`,
                {
                    email,
                    otp: formData.otp,
                    newPassword: formData.newPassword,
                }
            );

            setMessage("Password updated successfully");
            localStorage.removeItem("resetEmail");

            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            console.error("Change password failed:", err);
            setError(
                err.response?.data?.msg || "Invalid or expired OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError("");
        setMessage("");

        if (!email) {
            setError("Email missing. Please restart reset flow.");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                `${serverEndpoint}/auth/reset-password`,
                { email }
            );

            setMessage("OTP resent to your email");
        } catch (err) {
            console.error("Resend OTP failed:", err);
            setError("Please wait 2 minutes before resending OTP");
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
    if (!email) return;

    const sendOtp = async () => {
        try {
            await axios.post(
                `${serverEndpoint}/auth/reset-password`,
                { email },
                { withCredentials: true }
            );

            setMessage("OTP sent to your email");
            localStorage.setItem("resetEmail", email);
        } catch (err) {
            console.error("Auto OTP send failed:", err);
        }
    };

    sendOtp();
}, [email]);


    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold">Reset Password</h3>
                                <p className="text-muted small">
                                    Enter the OTP sent to your email
                                </p>
                            </div>

                            {(message || error) && (
                                <div
                                    className={`alert ${
                                        message
                                            ? "alert-success"
                                            : "alert-danger"
                                    } py-2 small border-0`}
                                >
                                    {message || error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control bg-light"
                                        value={email}
                                        disabled
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold">
                                        OTP
                                    </label>
                                    <input
                                        type="text"
                                        name="otp"
                                        value={formData.otp}
                                        className={`form-control ${
                                            fieldErrors.otp
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        onChange={handleChange}
                                    />
                                    {fieldErrors.otp && (
                                        <div className="invalid-feedback">
                                            {fieldErrors.otp}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        className={`form-control ${
                                            fieldErrors.newPassword
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        onChange={handleChange}
                                    />
                                    {fieldErrors.newPassword && (
                                        <div className="invalid-feedback">
                                            {fieldErrors.newPassword}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 rounded-pill fw-bold"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Please wait..."
                                        : "Change Password"}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <button
                                    type="button"
                                    className="btn btn-link small"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
