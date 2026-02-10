function GroupHeader({ group }) {
    return (
        <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                        <i className="bi bi-collection-fill fs-4"></i>
                    </div>

                    <span className="badge rounded-pill bg-light text-dark border fw-normal small">
                        {group.membersEmail.length} Members
                    </span>
                </div>

                <h4 className="fw-bold mb-1 text-dark">
                    {group.name}
                </h4>

                <p className="text-muted mb-0">
                    {group.description || "No description provided."}
                </p>
            </div>
        </div>
    );
}

export default GroupHeader;
