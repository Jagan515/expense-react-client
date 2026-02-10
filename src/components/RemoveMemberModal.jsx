import axios from "axios";
import { useEffect, useState } from "react";
import { serverEndpoint } from "../config/appConfig";

function RemoveMemberModal({
    show,
    onHide,
    groupId,
    members = [],
    adminEmail,
    onSuccess,
}) {
    const [loadingEmail, setLoadingEmail] = useState(null);
    const [error, setError] = useState(null);
    const [confirmAdminEmail, setConfirmAdminEmail] = useState(null);

    // Reset modal state when group or visibility changes
    useEffect(() => {
        setConfirmAdminEmail(null);
        setError(null);
        setLoadingEmail(null);
    }, [groupId, show]);

    const handleRemove = async (email) => {
        setLoadingEmail(email);
        setError(null);

        try {
            const response = await axios.patch(
                `${serverEndpoint}/groups/members/remove`,
                {
                    groupId,
                    emails: [email],
                },
                { withCredentials: true }
            );

            onSuccess?.(response.data);
            setConfirmAdminEmail(null);
        } catch (err) {
            console.error(err);
            setError("Unable to remove member. Please try again.");
        } finally {
            setLoadingEmail(null);
        }
    };

    if (!show) return null;

    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(4px)",
            }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 rounded-4 shadow-lg p-3">

                    {/* Header */}
                    <div className="modal-header border-0 pb-0">
                        <h5 className="fw-bold mb-0 text-danger">
                            Manage Members
                        </h5>
                        <button
                            type="button"
                            className="btn-close shadow-none"
                            onClick={() => {
                                setConfirmAdminEmail(null);
                                setError(null);
                                onHide();
                            }}
                        />
                    </div>

                    {/* Body */}
                    <div className="modal-body py-4">
                        {error && (
                            <div className="alert alert-danger py-2 small border-0 mb-3">
                                {error}
                            </div>
                        )}

                        {/* Admin Warning */}
                        {confirmAdminEmail && (
                            <div className="card border-danger mb-3">
                                <div className="card-body py-3">
                                    <h5 className="fw-bold mb-2 text-danger">
                                        Remove Admin?
                                    </h5>
                                    <p className="small text-muted mb-3">
                                        This member is the admin of the group.
                                        Removing them may affect group management.
                                        Are you sure you want to continue?
                                    </p>

                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-danger btn-sm rounded-pill px-3"
                                            onClick={() =>
                                                handleRemove(confirmAdminEmail)
                                            }
                                            disabled={loadingEmail === confirmAdminEmail}
                                        >
                                            {loadingEmail === confirmAdminEmail
                                                ? "Removing..."
                                                : "Yes, Remove Admin"}
                                        </button>

                                        <button
                                            className="btn btn-light btn-sm rounded-pill px-3"
                                            onClick={() => setConfirmAdminEmail(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {members.length === 0 && (
                            <p className="text-muted small">
                                No members found.
                            </p>
                        )}

                       <div
    className={`overflow-auto ${
        confirmAdminEmail ? "d-none" : ""
    }`}
    style={{ maxHeight: "300px" }}
>

                            {members.map((member) => (
                                <div
                                    key={member}
                                    className="d-flex justify-content-between align-items-center mb-3"
                                >
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="rounded-circle bg-light border d-flex align-items-center justify-content-center me-2 fw-bold text-primary shadow-sm"
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                fontSize: "12px",
                                            }}
                                        >
                                            {member.charAt(0).toUpperCase()}
                                        </div>

                                        <span className="small text-dark">
                                            {member}
                                        </span>

                                        {member === adminEmail && (
                                            <span className="badge bg-secondary ms-2">
                                                Admin
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        className="btn btn-sm btn-danger rounded-pill px-3"
                                        onClick={() =>
                                            member === adminEmail
                                                ? setConfirmAdminEmail(member)
                                                : handleRemove(member)
                                        }
                                        disabled={
                                            loadingEmail === member ||
                                            confirmAdminEmail !== null
                                        }
                                    >
                                        {loadingEmail === member
                                            ? "Removing..."
                                            : "Remove"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer border-0 pt-0">
                        <button
                            type="button"
                            className="btn btn-light rounded-pill px-4"
                            onClick={() => {
                                setConfirmAdminEmail(null);
                                setError(null);
                                onHide();
                            }}
                        >
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default RemoveMemberModal;
