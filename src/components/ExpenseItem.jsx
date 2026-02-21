function ExpenseItem({ expense }) {
    const memberCount = expense.splits?.length || 0;

    return (
        <div className="card border-0 shadow-sm rounded-4 mb-3">
            <div className="card-body p-3">

                {/* Top row */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <div className="small text-muted">
                            Paid by
                        </div>
                        <div className="fw-bold text-dark">
                            {expense.paidBy}
                        </div>
                    </div>

                    <div className="text-end">
                        <div className="fw-bold text-primary fs-5">
                            ₹{expense.amount}
                        </div>
                        {expense.category && (
                            <span className="badge bg-secondary rounded-pill mt-1 opacity-75">
                                {expense.category}
                            </span>
                        )}
                    </div>
                </div>

                {/* Meta row */}
                <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">
                        Split among {memberCount} member
                        {memberCount !== 1 ? "s" : ""}
                    </span>

                    {expense.createdAt && (
                        <span className="text-muted small">
                            {new Date(expense.createdAt).toLocaleDateString()}
                        </span>
                    )}
                </div>

            </div>
        </div>
    );
}

export default ExpenseItem;
