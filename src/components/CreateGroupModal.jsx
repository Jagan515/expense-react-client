import axios from "axios";
import { useState } from "react";
import { serverEndpoint } from "../config/appConfig";
import { useSelector } from "react-redux";

function CreateGroupModal({ show, onHide, onSuccess }) {
    const user = useSelector((state) => state.userDetails);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        let isValid = true;
        const newErrors = {};

        if (formData.name.trim().length < 3) {
            newErrors.name = "Group name should be at least 3 characters";
            isValid = false;
        }

        if (formData.description.trim().length < 3) {
            newErrors.description =
                "Description must be at least 3 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const onChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            const response = await axios.post(
                `${serverEndpoint}/groups/create`,
                {
                    name: formData.name,
                    description: formData.description,
                },
                { withCredentials: true }
            );

            const groupId = response.data?.groupId;

            // Support both old and new onSuccess contracts
            if (onSuccess) {
                onSuccess(
                    groupId
                        ? {
                              _id: groupId,
                              name: formData.name,
                              description: formData.description,
                              membersEmail: [user?.email],
                              adminEmail: user?.email,
                          }
                        : undefined
                );
            }

            setFormData({ name: "", description: "" });
            onHide();
        } catch (error) {
            console.error(error);
            setErrors({
                message: "Unable to add group, please try again",
            });
        } finally {
            setLoading(false);
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
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow-lg p-3">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header border-0 pb-0">
                            <h5 className="fw-bold mb-0">Create Group</h5>
                            <button
                                type="button"
                                className="btn-close shadow-none"
                                onClick={onHide}
                            />
                        </div>

                        <div className="modal-body py-4">
                            {errors.message && (
                                <div className="alert alert-danger py-2 small border-0 mb-3">
                                    {errors.message}
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="form-label small fw-bold">
                                    Group Name
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${
                                        errors.name ? "is-invalid" : ""
                                    }`}
                                    name="name"
                                    value={formData.name}
                                    onChange={onChange}
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            <div className="mb-2">
                                <label className="form-label small fw-bold">
                                    Description
                                </label>
                                <textarea
                                    rows="3"
                                    className={`form-control ${
                                        errors.description ? "is-invalid" : ""
                                    }`}
                                    name="description"
                                    value={formData.description}
                                    onChange={onChange}
                                />
                                {errors.description && (
                                    <div className="invalid-feedback">
                                        {errors.description}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer border-0 pt-0">
                            <button
                                type="button"
                                className="btn btn-light rounded-pill px-4"
                                onClick={onHide}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary rounded-pill px-5 fw-bold"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Add"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateGroupModal;
