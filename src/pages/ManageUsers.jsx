import { useEffect, useState } from "react";
import { serverEndpoint } from "../config/appConfig";
import axios from "axios";
import Can from "../components/Can";

function ManageUsers() {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Select",
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${serverEndpoint}/users/`,
        { withCredentials: true }
      );
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
      setErrors({ message: "Unable to fetch users, please try again" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (message || errors.message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setErrors({});
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, errors.message]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.name) {
      isValid = false;
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      isValid = false;
      newErrors.email = "Email is required";
    }

    if (formData.role === "Select") {
      isValid = false;
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setActionLoading(true);

    try {
      let response;

      if (isEditMode) {
        response = await axios.patch(
          `${serverEndpoint}/users/`,
          {
            userId: editUserId,
            name: formData.name,
            email: formData.email,
            role: formData.role,
          },
          { withCredentials: true }
        );

        setUsers(
          users.map((user) =>
            user._id === editUserId ? response.data.user : user
          )
        );

        setMessage("User updated!");
      } else {
        response = await axios.post(
          `${serverEndpoint}/users/`,
          {
            name: formData.name,
            email: formData.email,
            role: formData.role,
          },
          { withCredentials: true }
        );

        setUsers([...users, response.data.user]);
        setMessage("User added!");
      }

      setFormData({ name: "", email: "", role: "Select" });
      setIsEditMode(false);
      setEditUserId(null);
      setErrors({});
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ message: error.response.data.message });
      } else {
        setErrors({ message: "Action failed, please try again" });
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (user) => {
    setIsEditMode(true);
    setEditUserId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleDelete = async (userId) => {
    try {
      await axios.post(
        `${serverEndpoint}/users/delete`,
        { userId },
        { withCredentials: true }
      );

      setUsers(users.filter((user) => user._id !== userId));
      setMessage("User deleted!");
    } catch (error) {
      console.log(error);
      setErrors({ message: "Unable to delete user" });
    }
  };

  if (loading) {
    return (
      <div className="container p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 px-4 px-md-5">
      {errors.message && (
        <div className="alert alert-danger">{errors.message}</div>
      )}

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      <div className="row mb-4">
        <div className="col-md-8">
          <h2 className="fw-bold">
            Manage <span className="text-primary">Users</span>
          </h2>
        </div>
      </div>

      <div className="row">
        {/* Add / Edit form */}
        <Can requiredPermission="canCreateUsers">
          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-header">
                <h5>{isEditMode ? "Edit Member" : "Add Member"}</h5>
              </div>

              <div className="card-body p-2">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <div className="invalid-feedback ps-1">
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="text"
                      name="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback ps-1">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      name="role"
                      className={`form-select ${errors.role ? "is-invalid" : ""}`}
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="Select">Select</option>
                      <option value="manager">Manager</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    {errors.role && (
                      <div className="invalid-feedback ps-1">
                        {errors.role}
                      </div>
                    )}
                  </div>

                  <button className="btn btn-primary w-100">
                    {actionLoading
                      ? "Please wait..."
                      : isEditMode
                      ? "Update"
                      : "Add"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Can>

        {/* Users table */}
        <div className="col-md-9">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5>Team Members</h5>
            </div>

            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">Name</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">Role</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          className="btn btn-link text-primary"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-link text-danger"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
