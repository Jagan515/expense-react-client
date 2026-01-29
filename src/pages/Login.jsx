import { useState } from "react";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
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

    if (formData.email.length === 0) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (formData.password.length === 0) {
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
        const body = {
          email: formData.email,
          password: formData.password, //  fixed typo
        };

        const config = { withCredentials: true };

        const response = await axios.post(
          "http://localhost:5001/auth/login",
          body,
          config
        );

        console.log(response);
        setMessage("User authenticated");
      } catch (error) {
        console.log(error);
        setErrors({
          message: "Something Went Wrong. Please Try Again"
        });
      }
    }
  };

  return (
    <div className="container text-center">
      <h3>Login to Continue</h3>

      {message && <p className="text-success">{message}</p>}
      {errors.message && <p className="text-danger">{errors.message}</p>}

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
      </form>
    </div>
  );
}

export default Login;
