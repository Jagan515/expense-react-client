import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const email =
        location.state?.email ||
        localStorage.getItem("resetEmail") ||
        "";

    const [formData, setFormData] = useState({
        otp: "",
        newPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.otp) {
            newErrors.otp = "OTP is required";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrors({ message: "Email missing. Please restart reset flow." });
            return;
        }

        if (!validate()) return;

        try {
            setLoading(true);

            await axios.post("http://localhost:5001/auth/change-password", {
                email,
                otp: formData.otp,
                newPassword: formData.newPassword
            });

            setMessage("Password updated successfully");
            setErrors({});
            localStorage.removeItem("resetEmail");

            setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            setErrors({
                message:
                    error.response?.data?.msg ||
                    "Invalid or expired OTP"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            setErrors({ message: "Email missing. Please restart reset flow." });
            return;
        }

        try {
            setLoading(true);
            await axios.post("http://localhost:5001/auth/reset-password", {
                email
            });
            setMessage("OTP resent to your email");
            setErrors({});
        } catch {
            setErrors({
                message: "Please wait 2 minutes before resending OTP"
            });
        } finally {
            setLoading(false);
        }
    };

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

                            {(message || errors.message) && (
                                <div
                                    className={`alert ${
                                        message
                                            ? "alert-success"
                                            : "alert-danger"
                                    } py-2 small border-0`}
                                >
                                    {message || errors.message}
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
                                        className={`form-control ${
                                            errors.otp ? "is-invalid" : ""
                                        }`}
                                        onChange={handleChange}
                                    />
                                    {errors.otp && (
                                        <div className="invalid-feedback">
                                            {errors.otp}
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
                                        className={`form-control ${
                                            errors.newPassword
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        onChange={handleChange}
                                    />
                                    {errors.newPassword && (
                                        <div className="invalid-feedback">
                                            {errors.newPassword}
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
