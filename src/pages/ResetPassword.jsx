import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // email coming from Login page
  const email = location.state?.email || "";

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
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.otp) {
      newErrors.otp = "OTP is required";
      isValid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Change Password
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await axios.post("http://localhost:5001/auth/change-password", {
        email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      setMessage("Password changed successfully");
      setErrors({});

      // redirect to login after success
      setTimeout(() => {
        navigate("/login");
      }, 1500);

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

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);

      await axios.post("http://localhost:5001/auth/reset-password", {
        email
      });

      setMessage("OTP resent to your email");
      setErrors({});
    } catch (error) {
      setErrors({
        message: "Wait for 2 minutes to resend OTP"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-center">
      <h3>Reset Password</h3>

      {message && <p className="text-success">{message}</p>}
      {errors.message && <p className="text-danger">{errors.message}</p>}

      <div className="row justify-content-center">
        <div className="col-6">
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>Email:</label>
              <input
                className="form-control"
                type="text"
                value={email}
                disabled
              />
            </div>

            <div className="mb-3">
              <label>OTP:</label>
              <input
                className="form-control"
                type="text"
                name="otp"
                onChange={handleChange}
              />
              {errors.otp && (
                <small className="text-danger">{errors.otp}</small>
              )}
            </div>

            <div className="mb-3">
              <label>New Password:</label>
              <input
                className="form-control"
                type="password"
                name="newPassword"
                onChange={handleChange}
              />
              {errors.newPassword && (
                <small className="text-danger">
                  {errors.newPassword}
                </small>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Change Password"}
            </button>
          </form>

          <p className="mt-3">
            <button
              className="btn btn-link"
              onClick={handleResendOtp}
              disabled={loading}
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
