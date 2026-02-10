import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function SettleGroup({ groupId, onSettled }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleSettleGroup = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await axios.post(
                `${serverEndpoint}/expenses/group/${groupId}/settle`,
                {},
                { withCredentials: true }
            );

            setSuccess("Group settled successfully");
            setShowConfirmModal(false);
            onSettled?.();
        } catch (error) {
            console.log(error);
            setError("Unable to settle group");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 text-center">
                    <h5 className="fw-bold mb-3 text-dark">
                        Settle Group
                    </h5>

                    <p className="text-muted small mb-3">
                        This will mark the group as settled and clear all balances.
                    </p>

                    {error && (
                        <div className="alert alert-danger py-1 px-2 small border-0">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success py-1 px-2 small border-0">
                            {success}
                        </div>
                    )}

                    <button
                        className="btn btn-danger rounded-pill fw-bold px-4"
                        onClick={() => setShowConfirmModal(true)}
                        disabled={loading}
                    >
                        Settle Group Expenses
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg">
                            <div className="modal-body p-4 text-center">
                                <h5 className="fw-bold text-danger mb-3">
                                    Confirm Settlement
                                </h5>

                                <p className="text-muted small mb-4">
                                    Are you sure you want to settle this group?
                                    This action cannot be undone and all balances
                                    will be reset to zero.
                                </p>

                                <div className="d-flex justify-content-center gap-2">
                                    <button
                                        className="btn btn-light rounded-pill px-4"
                                        onClick={() => setShowConfirmModal(false)}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="btn btn-danger rounded-pill px-4"
                                        onClick={handleSettleGroup}
                                        disabled={loading}
                                    >
                                        {loading ? "Settling..." : "Yes, Settle"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SettleGroup;
