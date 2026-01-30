import { useState } from "react";
import axios from "axios";

function Register({setUser}) {
  const [formData, setFormData] = useState({
    name:"",
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
    
    if (formData.name.length === 0) {
        newErrors.name = "Name is required";
        isValid = false;
    }


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
          name:formData.name,
          email: formData.email,
          password: formData.password, //  
        };

        const config = { withCredentials: true };

        const response = await axios.post(
          "http://localhost:5001/auth/register",
          body,
          config
        );

        console.log(response);
        setUser(response.data.user);
        setMessage("User Registered Successfully");
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
      <h3>Register</h3>

      {message && <p className="text-success">{message}</p>}
      {errors.message && <p className="text-danger">{errors.message}</p>}

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
    </div>
  );
}

export default Register;
