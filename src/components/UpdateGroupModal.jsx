import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function UpdateGroupModal({ show, onHide, group, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    // populate form when modal opens
    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name,
                description: group.description
            });
        }
    }, [group]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `${serverEndpoint}/groups/update`,
                {
                    groupId: group._id,
                    name: formData.name,
                    description: formData.description
                },
                { withCredentials: true }
            );

            onSuccess(response.data); // updated group
            onHide(); // close modal
        } catch (error) {
            console.log(error);
        }
    };

    if (!show) return null;

    return (
        <div className="modal show d-block">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header border-0">
                            <h5>Edit Group</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onHide}
                            />
                        </div>

                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label fw-bold small">
                                    Group Name
                                </label>
                                <input
                                    type="email" className="form-control"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold small">
                                    Description
                                </label>
                                <input
                                    className="form-control"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="modal-footer border-0">
                            <button
                                type="button"
                                className="btn btn-light rounded-pill"
                                onClick={onHide}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary rounded-pill px-4"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateGroupModal;
