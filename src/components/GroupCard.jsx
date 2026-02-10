import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { serverEndpoint } from "../config/appConfig";

function GroupCard({ group, onUpdate, onEdit, onShowRemove }) {
    const [memberEmail, setMemberEmail] = useState("");
    const [errors, setErrors] = useState({});

    const isValidGmail = (email) => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return gmailRegex.test(email);
    };

    const handleAddMember = async () => {
        if (!memberEmail) {
            setErrors({ message: "Email is required" });
            return;
        }

        if (!isValidGmail(memberEmail)) {
            setErrors({ message: "Please enter a valid Gmail address" });
            return;
        }

        try {
            const response = await axios.patch(
                `${serverEndpoint}/groups/members/add`,
                {
                    groupId: group._id,
                    emails: [memberEmail],
                },
                { withCredentials: true }
            );

            onUpdate?.(response.data);
            setMemberEmail("");
            setErrors({});
        } catch (error) {
            console.log(error);
            setErrors({ message: "Unable to add member" });
        }
    };

    return (
        <div className="card h-100 border-0 shadow-sm rounded-4 transition-hover">
            <div className="card-body p-4 d-flex flex-column">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary mb-2">
                        <i className="bi bi-collection-fill fs-4"></i>
                    </div>

                    <div className="d-flex gap-2 align-items-center">
                        {group.adminEmail && (
                            <span className="badge rounded-pill bg-light text-dark border fw-normal small">
                                Admin: {group.adminEmail.split("@")[0]}
                            </span>
                        )}

                        {onEdit && (
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={onEdit}
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* Group Name */}
                <h5 className="fw-bold mb-1 text-dark text-truncate">
                    {group.name}
                </h5>

                {/* Members button */}
                <button
                    className="btn btn-sm text-primary p-0 text-start fw-medium mb-3"
                    onClick={onShowRemove}
                >
                    <i className="bi bi-people-fill me-1"></i>
                    {group.membersEmail.length} Members ▸
                </button>

                {/* Description */}
                <p className="text-muted small mb-3 flex-grow-1">
                    {group.description || "No description provided."}
                </p>

                {/* Navigate */}
                <Link
                    to={`/groups/${group._id}`}
                    className="btn btn-outline-primary btn-sm rounded-pill fw-bold mb-4 w-100 py-2"
                >
                    View & Add Expenses
                </Link>

                {errors.message && (
                    <div className="alert alert-danger py-1 px-2 small border-0 mb-3">
                        {errors.message}
                    </div>
                )}

                {/* Invite Member */}
                <div className="mt-auto pt-3 border-top">
                    <label className="form-label extra-small fw-bold text-uppercase text-muted mb-2">
                        Invite a Friend
                    </label>

                    <div className="input-group input-group-sm">
                        <input
                            type="email"
                            className="form-control bg-light border-0 px-3"
                            placeholder="email@example.com"
                            value={memberEmail}
                            onChange={(e) => setMemberEmail(e.target.value)}
                        />
                        <button
                            className="btn btn-primary px-3 fw-bold"
                            onClick={handleAddMember}
                        >
                            Add
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default GroupCard;
