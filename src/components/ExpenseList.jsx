import ExpenseItem from "./ExpenseItem";

function ExpenseList({ expenses }) {
    return (
        <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
                <h5 className="fw-bold mb-3 text-dark">
                    Expense History
                </h5>

                {expenses.length === 0 && (
                    <p className="text-muted mb-0">
                        No expenses added yet.
                    </p>
                )}

                {expenses.map((expense, index) => (
                    <ExpenseItem
                        key={index}
                        expense={expense}
                    />
                ))}
            </div>
        </div>
    );
}

export default ExpenseList;
