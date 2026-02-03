import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import { serverEndpoint } from "../config/appConfig";
import { SET_USER } from "../redux/user/action";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
        formData,
        { withCredentials: true }
      );

      // ✅ Redux update
      dispatch({ type: SET_USER, payload: response.data.user });

      setMessage("User authenticated");
      setErrors({});
    } catch (error) {
      setErrors({
        message:
          error.response?.data?.error ||
          "Something went wrong. Please try again"
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

      // ✅ Redux update
      dispatch({ type: SET_USER, payload: response.data.user });
    } catch (error) {
      setErrors({ message: "Unable to login with Google" });
    }
  };

  const handleGoogleFailure = () => {
    setErrors({
      message: "Something went wrong during Google sign-in"
    });
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      setErrors({ email: "Please enter email to reset password" });
      return;
    }

    try {
      await axios.post(`${serverEndpoint}/auth/reset-password`, {
        email: formData.email
      });

      setMessage("OTP sent to your email");
      setErrors({});
      navigate("/reset-password", { state: { email: formData.email } });
    } catch (error) {
      setErrors({
        message:
          error.response?.data?.msg ||
          "Unable to send reset password email"
      });
    }
  };

  return (
    <div className="container text-center">
      <h3>Login to Continue</h3>

      {message && <p className="text-success">{message}</p>}
      {errors.message && <p className="text-danger">{errors.message}</p>}

      <div className="row justify-content-center">
        <div className="col-6">
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label>Email:</label>
              <input
                className="form-control"
                type="text"
                name="email"
                onChange={handleChange}
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </div>

            <div className="mb-3">
              <label>Password:</label>
              <input
                className="form-control"
                type="password"
                name="password"
                onChange={handleChange}
              />
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              Login
            </button>

            <p className="mt-2">
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={handleResetPassword}
              >
                Forgot Password?
              </button>
            </p>
          </form>
        </div>
      </div>

      <div className="row justify-content-center mt-3">
        <div className="col-6">
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
  );
}

export default Login;
