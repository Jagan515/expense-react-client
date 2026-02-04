import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function GroupCard({ group, onUpdate, onEdit }) {
    const [showMembers, setShowMembers] = useState(false);
    const [memberEmail, setMemberEmail] = useState("");
    const [errors, setErrors] = useState({});

    const handleShowMember = () => {
        setShowMembers(!showMembers);
    };

    const handleAddMember = async () => {
        if (!memberEmail) return;

        try {
            const response = await axios.patch(
                `${serverEndpoint}/groups/members/add`,
                {
                    groupId: group._id,
                    emails: [memberEmail]
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

    const handleRemoveMember = async (email) => {
        try {
            const response = await axios.patch(
                `${serverEndpoint}/groups/members/remove`,
                {
                    groupId: group._id,
                    emails: [email]
                },
                { withCredentials: true }
            );

            onUpdate?.(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="card h-100 border-0 shadow-sm rounded-4 position-relative">
            <div className="card-body p-4">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>{group.name}</h5>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={onEdit}
                    >
                        Edit
                    </button>
                </div>

                <button
                    className="btn btn-sm btn-link p-0 mb-2"
                    onClick={handleShowMember}
                >
                    {group.membersEmail.length} | Show Members
                </button>

                <p>{group.description}</p>

                {/* Members */}
                {showMembers && (
                    <div className="rounded-3 p-3 mb-3 border">
                        <h6>Members in this Group</h6>
                        {group.membersEmail.map((member, index) => (
                            <div
                                key={index}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <span>{index + 1}. {member}</span>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleRemoveMember(member)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Member */}
                <div className="mb-3">
                    <label className="form-label extra-small fw-bold text-secondary">
                        Add Member
                    </label>
                    <div className="input-group input-group-sm">
                        <input
                            type="email"
                            className="form-control border-end-0"
                            value={memberEmail}
                            onChange={(e) => setMemberEmail(e.target.value)}
                        />
                        <button
                            type="button"
                            className="btn btn-primary px-3"
                            onClick={handleAddMember}
                        >
                            Add
                        </button>
                    </div>

                    {errors.message && (
                        <div className="text-danger small mt-1">
                            {errors.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GroupCard;
