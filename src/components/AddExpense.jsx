import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function AddExpense({ group, expenses = [], onExpenseAdded }) {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Derive unique categories from previous expenses
    const suggestedCategories = [
        ...new Set(
            expenses
                .map((e) => e.category)
                .filter((cat) => cat && cat.trim() !== "")
        )
    ];

    // Reset selected members when group changes
    useEffect(() => {
        setSelectedMembers(group?.membersEmail || []);
    }, [group]);

    if (!group) {
        console.warn("AddExpense: group not provided");
        return null;
    }

    const handleToggleMember = (email) => {
        setSelectedMembers((prev) =>
            prev.includes(email)
                ? prev.filter((m) => m !== email)
                : [...prev, email]
        );
    };

    const isValid = amount && selectedMembers.length > 0 && category.trim().length > 0;

    const splitAmount = isValid
        ? Number(amount) / selectedMembers.length
        : 0;

    const handleAddExpense = async () => {
        if (!isValid) {
            setError("Amount, category, and at least one member are required");
            return;
        }

        const splits = selectedMembers.map((email) => ({
            memberEmail: email,
            amount: splitAmount,
        }));

        try {
            setLoading(true);
            setError("");

            await axios.post(
                `${serverEndpoint}/expenses/add`,
                {
                    groupId: group._id,
                    amount: Number(amount),
                    category: category.trim(),
                    splits,
                },
                { withCredentials: true }
            );

            setAmount("");
            setCategory("");
            setSelectedMembers(group.membersEmail);
            onExpenseAdded?.();
        } catch (err) {
            console.error("Failed to add expense:", err);
            setError("Unable to add expense");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
                <h5 className="fw-bold mb-3 text-dark">
                    Add Expense
                </h5>

                <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">
                        Total Amount
                    </label>
                    <input
                        type="number"
                        className="form-control bg-light border-0 px-3"
                        placeholder="e.g. 1200"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">
                        Category
                    </label>
                    <input
                        type="text"
                        className="form-control bg-light border-0 px-3"
                        placeholder="e.g. Food, Travel (select or type)"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        list="category-suggestions"
                    />
                    <datalist id="category-suggestions">
                        {suggestedCategories.map((cat, idx) => (
                            <option key={idx} value={cat} />
                        ))}
                    </datalist>
                </div>

                <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">
                        Split Between
                    </label>

                    <div className="bg-light rounded-3 p-3">
                        {group.membersEmail.map((member) => (
                            <div
                                key={member}
                                className="form-check mb-2"
                            >
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selectedMembers.includes(member)}
                                    onChange={() =>
                                        handleToggleMember(member)
                                    }
                                    id={`member-${member}`}
                                />
                                <label
                                    className="form-check-label small"
                                    htmlFor={`member-${member}`}
                                >
                                    {member}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {isValid && (
                    <div className="alert alert-info py-2 px-3 small border-0 mb-3">
                        Each selected member pays{" "}
                        <strong>
                            ₹{splitAmount.toFixed(2)}
                        </strong>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger py-1 px-2 small border-0 mb-3">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    className="btn btn-primary rounded-pill fw-bold px-4"
                    onClick={handleAddExpense}
                    disabled={loading || !isValid}
                >
                    {loading ? "Adding..." : "Add Expense"}
                </button>
            </div>
        </div>
    );
}

export default AddExpense;
