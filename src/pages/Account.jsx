import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

import { serverEndpoint } from "../config/appConfig";
import Loading from "../components/Loading";

function Account() {
    const authUser = useSelector((state) => state.userDetails);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    `${serverEndpoint}/profile/get-user-info`,
                    { withCredentials: true }
                );

                setProfile(response.data.user);
                setNameInput(response.data.user.name);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError("Unable to load account details");
            } finally {
                setLoading(false);
            }
        };

        if (authUser) {
            fetchProfile();
        }
    }, [authUser]);

    // Auto clear messages
    useEffect(() => {
        if (!error && !success) return;

        const timer = setTimeout(() => {
            setError("");
            setSuccess("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [error, success]);

    const handleSaveName = async () => {
        if (nameInput.trim().length < 3) {
            setError("Name must be at least 3 characters");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const response = await axios.put(
                `${serverEndpoint}/profile/update-name`,
                { name: nameInput },
                { withCredentials: true }
            );

            setProfile(response.data.user);
            setSuccess("Name updated successfully");
            setIsEditingName(false);
        } catch (err) {
            console.error("Failed to update name:", err);
            setError("Unable to update name");
        } finally {
            setSaving(false);
        }
    };

    if (!authUser || loading) {
        return <Loading text="Loading account details..." />;
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4">

                            <h5 className="fw-bold mb-4 text-dark">
                                Account Settings
                            </h5>

                            {error && (
                                <div className="alert alert-danger py-2 small">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success py-2 small">
                                    {success}
                                </div>
                            )}

                            {/* Name */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">
                                    Name
                                </label>

                                <div className="d-flex gap-2">
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0"
                                        value={isEditingName ? nameInput : profile.name}
                                        disabled={!isEditingName}
                                        onChange={(e) =>
                                            setNameInput(e.target.value)
                                        }
                                    />

                                    {!isEditingName ? (
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() =>
                                                setIsEditingName(true)
                                            }
                                        >
                                            Edit
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={handleSaveName}
                                            disabled={saving}
                                        >
                                            {saving ? "Saving..." : "Save"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control bg-light border-0"
                                    value={profile.email}
                                    disabled
                                />
                            </div>

                            {/* Role */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    className="form-control bg-light border-0"
                                    value={profile.role}
                                    disabled
                                />
                            </div>

                            {/* Credits */}
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">
                                    Credits
                                </label>
                                <input
                                    type="text"
                                    className="form-control bg-light border-0 fw-bold text-primary"
                                    value={profile.credits || 0}
                                    disabled
                                />
                            </div>

                            {/* Actions */}
                            <div className="d-flex gap-3 flex-wrap">
                                <Link
                                    to="/reset-password"
                                    state={{ email: profile.email }}
                                    className="btn btn-outline-primary rounded-pill fw-bold px-4"
                                >
                                    Change Password
                                </Link>


                                <Link
                                    to="/manage-payments"
                                    className="btn btn-outline-success rounded-pill fw-bold px-4"
                                >
                                    Buy Credits
                                </Link>

                                <Link
                                    to="/logout"
                                    className="btn btn-outline-danger rounded-pill fw-bold px-4"
                                >
                                    Logout
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;
