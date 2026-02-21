import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

import GroupHeader from "../components/GroupHeader";
import ExpenseSummary from "../components/ExpenseSummary";
import ExpenseList from "../components/ExpenseList";
import AddExpense from "../components/AddExpense";
import SettleGroup from "../components/SettleGroup";
import Loading from "../components/Loading";

function GroupExpenses() {
    const { groupId } = useParams();

    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch group, expenses, and summary together
    const fetchExpenses = async () => {
        const res = await axios.get(
            `${serverEndpoint}/expenses/group/${groupId}`,
            { withCredentials: true }
        );

        setGroup(res.data.group || null);
        setExpenses(res.data.expenses || []);
        setSummary(res.data.summary || {});
    };

    const refreshExpenses = async () => {
        try {
            await fetchExpenses();
        } catch (error) {
            console.error("Failed to refresh expenses:", error);
        }
    };

    const handleMemberSettled = async (memberEmail) => {
        try {
            await axios.post(
                `${serverEndpoint}/expenses/group/${groupId}/settle/member`,
                { memberEmail },
                { withCredentials: true }
            );

            refreshExpenses();
        } catch (error) {
            console.error("Failed to settle member:", error);
        }
    };

    const handleSplitsUpdated = async (splits) => {
        try {
            await axios.patch(
                `${serverEndpoint}/expenses/group/${groupId}/splits`,
                { splits },
                { withCredentials: true }
            );

            refreshExpenses();
        } catch (error) {
            console.error("Failed to update splits:", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                await fetchExpenses();
            } catch (error) {
                console.error("Failed to load group expenses:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [groupId]);

    if (loading) {
        return <Loading text="Loading group expenses..." />;
    }

    if (!group) {
        return (
            <div className="container py-5 text-center">
                <p className="text-muted">Group not found</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row g-4">

                <div className="col-12">
                    <GroupHeader group={group} />
                </div>

                <div className="col-md-4">
                    <ExpenseSummary
                        summary={summary}
                        onMemberSettled={handleMemberSettled}
                        onSplitsUpdated={handleSplitsUpdated}
                    />
                </div>

                <div className="col-md-8">
                    <AddExpense
                        group={group}
                        expenses={expenses}
                        onExpenseAdded={refreshExpenses}
                    />
                </div>

                <div className="col-12">
                    <ExpenseList expenses={expenses} />
                </div>

                <div className="col-12">
                    <SettleGroup
                        groupId={groupId}
                        onSettled={refreshExpenses}
                    />
                </div>

            </div>
        </div>
    );
}

export default GroupExpenses;
