import axios from 'axios';
import { serverEndpoint } from '../config/appConfig';
import { useEffect, useState } from 'react';
import GroupCard from './GroupCard';
import CreateGroupModal from './CreateGroupModal';
import UpdateGroupModal from './UpdateGroupModal';

function Groups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const [showEdit, setShowEdit] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const fetchGroups = async () => {
        try {
            const response = await axios.get(
                `${serverEndpoint}/groups/my-groups`,
                { withCredentials: true }
            );
            setGroups(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Used for add/remove member
    const handleAddgroupSuccess = (updatedGroup) => {
        setGroups((prevGroups) =>
            prevGroups.map((g) =>
                g._id === updatedGroup._id ? updatedGroup : g
            )
        );
    };

    // Used for update group
    const handleGroupUpdateSuccess = (updatedGroup) => {
        setGroups((prev) =>
            prev.map((g) => (g._id === updatedGroup._id ? updatedGroup : g))
        );
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    if (loading) {
        return (
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        );
    }

    return (
        <div className="container p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold">Your Groups</h2>
                    <p className="text-muted">
                        Manage your shared expenses and split expenses
                    </p>
                </div>

                <button
                    className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
                    onClick={() => setShow(true)}
                >
                    Create Group
                </button>
            </div>

            {groups.length === 0 && (
                <p>No groups found, Start by creating one!</p>
            )}

            {groups.length > 0 && (
                <div className="row g-4">
                    {groups.map((group) => (
                        <div className="col-md-6 col-lg-4" key={group._id}>
                            <GroupCard
                                group={group}
                                onUpdate={handleAddgroupSuccess}
                                onEdit={() => {
                                    setSelectedGroup(group);
                                    setShowEdit(true);
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <CreateGroupModal
                show={show}
                onHide={() => setShow(false)}
                onSuccess={fetchGroups}
            />

            <UpdateGroupModal
                show={showEdit}
                onHide={() => setShowEdit(false)}
                group={selectedGroup}
                onSuccess={handleGroupUpdateSuccess}
            />
        </div>
    );
}

export default Groups;
