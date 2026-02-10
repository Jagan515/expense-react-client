import { useEffect, useState } from "react";
import axios from "axios";

import { serverEndpoint } from "../config/appConfig";
import Can from "../components/Can";
import Loading from "../components/Loading";

function ManageUsers() {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
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
            setUsers(response.data.users || []);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Unable to fetch users, please try again");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!message && !error) return;

        const timer = setTimeout(() => {
            setMessage("");
            setError("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [message, error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let isValid = true;
        let validationError = "";

        if (!formData.name) {
            validationError = "Name is required";
            isValid = false;
        } else if (!formData.email) {
            validationError = "Email is required";
            isValid = false;
        } else if (formData.role === "Select") {
            validationError = "Role is required";
            isValid = false;
        }

        if (!isValid) setError(validationError);
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
                        ...formData,
                    },
                    { withCredentials: true }
                );

                setUsers((prev) =>
                    prev.map((user) =>
                        user._id === editUserId
                            ? response.data.user
                            : user
                    )
                );

                setMessage("User updated!");
            } else {
                response = await axios.post(
                    `${serverEndpoint}/users/`,
                    formData,
                    { withCredentials: true }
                );

                setUsers((prev) => [...prev, response.data.user]);
                setMessage("User added!");
            }

            setFormData({ name: "", email: "", role: "Select" });
            setIsEditMode(false);
            setEditUserId(null);
            setError("");
        } catch (err) {
            console.error("User action failed:", err);

            if (err.response?.status === 409) {
                setError(err.response.data.message);
            } else {
                setError("Action failed, please try again");
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

            setUsers((prev) =>
                prev.filter((user) => user._id !== userId)
            );
            setMessage("User deleted!");
        } catch (err) {
            console.error("Failed to delete user:", err);
            setError("Unable to delete user");
        }
    };

    if (loading) {
        return <Loading text="Loading users..." />;
    }

    return (
        <div className="container py-5 px-4 px-md-5">
            {error && (
                <div className="alert alert-danger">{error}</div>
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
                <Can requiredPermission="canCreateUsers">
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-header">
                                <h5>
                                    {isEditMode
                                        ? "Edit Member"
                                        : "Add Member"}
                                </h5>
                            </div>

                            <div className="card-body p-2">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            name="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Role
                                        </label>
                                        <select
                                            name="role"
                                            className="form-select"
                                            value={formData.role}
                                            onChange={handleChange}
                                        >
                                            <option value="Select">
                                                Select
                                            </option>
                                            <option value="manager">
                                                Manager
                                            </option>
                                            <option value="viewer">
                                                Viewer
                                            </option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={actionLoading}
                                    >
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

                <div className="col-md-9">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h5>Team Members</h5>
                        </div>

                        <div className="card-body p-0">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th className="text-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-link text-primary"
                                                    onClick={() =>
                                                        handleEdit(user)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-link text-danger"
                                                    onClick={() =>
                                                        handleDelete(
                                                            user._id
                                                        )
                                                    }
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
