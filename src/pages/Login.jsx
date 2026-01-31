import { useState } from "react";
import axios from "axios";
import {GoogleOAuthProvider,GoogleLogin} from '@react-oauth/google';

function Login({setUser}) {
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
        password: formData.password
      };

      const response = await axios.post(
        "http://localhost:5001/auth/login",
        body,
        { withCredentials: true }
      );

      setUser(response.data.user);
      setMessage("User authenticated");
      setErrors({});
    } catch (error) {
      console.log(error);

      // read backend message 
      setErrors({
        message:
          error.response?.data?.error ||
          "Something Went Wrong. Please Try Again"
      });
    }
  }
};


  const handleGoogleSuccess = async (authResponse) => {
  try {
    const body = {
      idToken: authResponse?.credential,
    };

    const response = await axios.post(
      "http://localhost:5001/auth/google-auth",
      body,
      { withCredentials: true }
    );

    setUser(response.data.user);
  } catch (error) {
    console.log(error);
    setErrors({ message: "Unable to login with Google" });
  }
};


  const handleGoogleFailure=(error)=>{
      console.log(error);
      setErrors({
        message:'Something went wrong while performing google single sign-on'
      });
  }

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
      </form>
      </div>
      </div>
          
          {/* <p><a href="#" class="link-primary">Primary link</a></p> */}

         <div className="row justify-content-center">
        <div className="col-6">

          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin 
          onSuccess={handleGoogleSuccess} 
          onError={handleGoogleFailure} />


          </GoogleOAuthProvider>
          </div>
        </div>

    </div>
  );
}

export default Login;
