import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/action";

function Register() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.name) {
      newErrors.name = "Name is required";
      isValid = false;
    }

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

    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:5001/auth/register",
          formData,
          { withCredentials: true }
        );

        // ✅ Update Redux
        dispatch({ type: SET_USER, payload: response.data.user });
        setMessage("User Registered Successfully");
      } catch (error) {
        console.error(error);
        setErrors({ message: "Something went wrong. Please try again." });
      }
    }
  };

  const handleGoogleSuccess = async (authResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/auth/google-auth",
        { idToken: authResponse?.credential },
        { withCredentials: true }
      );

      // ✅ Update Redux
      dispatch({ type: SET_USER, payload: response.data.user });
    } catch (error) {
      console.error(error);
      setErrors({ message: "Unable to login with Google" });
    }
  };

  const handleGoogleFailure = () => {
    setErrors({
      message: "Something went wrong while performing Google sign-in"
    });
  };

  return (
    <div className="container text-center">
      <h3>Register</h3>

      {message && <p className="text-success">{message}</p>}
      {errors.message && <p className="text-danger">{errors.message}</p>}

      <div className="row justify-content-center">
        <div className="col-6">
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label>Name:</label>
              <input
                className="form-control"
                type="text"
                name="name"
                onChange={handleChange}
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </div>

            <div className="mb-3">
              <label>Email:</label>
              <input
                className="form-control"
                type="email"
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
