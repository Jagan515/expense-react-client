import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

import GroupCard from "../components/GroupCard";
import CreateGroupModal from "../components/CreateGroupModal";
import RemoveMemberModal from "../components/RemoveMemberModal";
import Loading from "../components/Loading";

import { usePermissions } from "../rbac/userPermissions";

function Groups() {
    const permissions = usePermissions();

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(1);
    const [sortBy, setSortBy] = useState("newest");

    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [activeGroup, setActiveGroup] = useState(null);

    const fetchGroups = async (page = 1) => {
        setLoading(true);

        try {
            const response = await axios.get(
                `${serverEndpoint}/groups/my-groups?page=${page}&limit=${limit}&sortBy=${sortBy}`,
                { withCredentials: true }
            );

            setGroups(response.data.groups || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGroupUpdateSuccess = (updatedGroup) => {
        setCurrentPage(1);
        fetchGroups(1);

        if (activeGroup && updatedGroup?._id === activeGroup._id) {
            setActiveGroup(updatedGroup);
        }
    };

    useEffect(() => {
        fetchGroups(currentPage);
    }, [currentPage, limit, sortBy]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) {
        return <Loading text="Loading groups..." />;
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Groups</h3>

                {permissions.canCreateGroups && (
                    <div className="d-flex align-items-center gap-2">
                        <select
                            className="form-select form-select-sm w-auto"
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>

                        <button
                            className="btn btn-primary btn-sm fw-bold"
                            onClick={() => setShow(true)}
                        >
                            New Group
                        </button>
                    </div>
                )}
            </div>

            {groups.length === 0 && (
                <p className="text-muted">No groups found</p>
            )}

            {groups.length > 0 && (
                <div className="row g-3">
                    {groups.map((group) => (
                        <div key={group._id} className="col-md-4">
                            <GroupCard
                                group={group}
                                onUpdate={handleGroupUpdateSuccess}
                                onShowRemove={() => {
                                    setActiveGroup(group);
                                    setShowRemoveModal(true);
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-4">
                <div>
                    <label className="me-2">Items per page:</label>
                    <select
                        value={limit}
                        className="form-select d-inline-block w-auto"
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        {[1, 3, 5, 10, 20, 50].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                {totalPages > 1 && (
                    <ul className="pagination mb-0">
                        <li
                            className={`page-item ${
                                currentPage === 1 ? "disabled" : ""
                            }`}
                        >
                            <button
                                className="page-link"
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                            >
                                &laquo;
                            </button>
                        </li>

                        {[...Array(totalPages)].map((_, index) => (
                            <li
                                key={index}
                                className={`page-item ${
                                    currentPage === index + 1 ? "active" : ""
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        handlePageChange(index + 1)
                                    }
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}

                        <li
                            className={`page-item ${
                                currentPage === totalPages ? "disabled" : ""
                            }`}
                        >
                            <button
                                className="page-link"
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                            >
                                &raquo;
                            </button>
                        </li>
                    </ul>
                )}
            </div>

            <CreateGroupModal
                show={show}
                onHide={() => setShow(false)}
                onSuccess={handleGroupUpdateSuccess}
            />

            {activeGroup && (
                <RemoveMemberModal
                    show={showRemoveModal}
                    onHide={() => setShowRemoveModal(false)}
                    groupId={activeGroup._id}
                    members={activeGroup.membersEmail}
                    adminEmail={activeGroup.adminEmail}
                    onSuccess={handleGroupUpdateSuccess}
                />
            )}
        </div>
    );
}

export default Groups;
