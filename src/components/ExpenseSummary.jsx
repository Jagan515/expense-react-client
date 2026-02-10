import { useEffect, useState } from "react";

function ExpenseSummary({ summary, onMemberSettled, onSplitsUpdated }) {
    const [showModal, setShowModal] = useState(false);
    const [membersState, setMembersState] = useState({});

    useEffect(() => {
        const initialState = {};
        Object.keys(summary || {}).forEach((email) => {
            initialState[email] = {
                amount: summary[email],
                isSettled: false
            };
        });
        setMembersState(initialState);
    }, [summary]);

    const members = Object.keys(membersState);

    // Admin = only positive balance
    const adminEmail = members.find(
        (email) => membersState[email].amount > 0
    );

    const handleSettleMember = async (email) => {
        await onMemberSettled?.(email);
    };

    const handleSaveSplits = () => {
        const splits = members.map((email) => ({
            memberEmail: email,
            amount: membersState[email].amount,
            isSettled: membersState[email].isSettled
        }));

        onSplitsUpdated?.(splits);
        setShowModal(false);
    };

    return (
        <>
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">

                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold mb-0">
                            Expense Summary
                        </h5>
                        {members.length > 0 && (
                            <button
                                className="btn btn-sm btn-outline-primary rounded-pill"
                                onClick={() => setShowModal(true)}
                            >
                                Adjust
                            </button>
                        )}
                    </div>

                    {/* Admin */}
                    {adminEmail && (
                        <div className="mb-4 p-3 rounded-3 bg-primary bg-opacity-10">
                            <div className="fw-bold text-primary mb-1">
                                Admin (Paid upfront)
                            </div>
                            <div className="small text-muted">
                                {adminEmail}
                            </div>
                            <div className="fw-bold text-primary mt-2">
                                ₹{membersState[adminEmail].amount} to receive
                            </div>
                        </div>
                    )}

                    {/* Members */}
                    {members
                        .filter((email) => email !== adminEmail)
                        .map((email) => {
                            const amount = membersState[email].amount;

                            return (
                                <div
                                    key={email}
                                    className="d-flex justify-content-between align-items-center mb-3"
                                >
                                    <div>
                                        <div className="small fw-bold">
                                            {email}
                                        </div>
                                        <span className="text-muted small">
                                            Owes admin
                                        </span>
                                    </div>

                                    {amount === 0 ? (
                                        <span className="badge bg-success rounded-pill">
                                            Settled
                                        </span>
                                    ) : (
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="fw-bold text-danger">
                                                ₹{Math.abs(amount)}
                                            </span>
                                            <button
                                                className="btn btn-sm btn-outline-success rounded-pill"
                                                onClick={() =>
                                                    handleSettleMember(email)
                                                }
                                            >
                                                Mark as Settled
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Adjust Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content rounded-4">
                            <div className="modal-header">
                                <h5 className="fw-bold mb-0">
                                    Adjust Expense Split
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                />
                            </div>

                            <div className="modal-body">
                                {members.map((email) => (
                                    <div
                                        key={email}
                                        className="d-flex justify-content-between align-items-center mb-3"
                                    >
                                        <span className="small fw-bold">
                                            {email}
                                        </span>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm w-25"
                                            value={membersState[email].amount}
                                            disabled={email === adminEmail}
                                            onChange={(e) =>
                                                setMembersState((prev) => ({
                                                    ...prev,
                                                    [email]: {
                                                        ...prev[email],
                                                        amount: Number(
                                                            e.target.value
                                                        )
                                                    }
                                                }))
                                            }
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-light rounded-pill"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary rounded-pill"
                                    onClick={handleSaveSplits}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ExpenseSummary;
