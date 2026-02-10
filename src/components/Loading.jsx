function Loading({ text = "Loading..." }) {
    return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div
                className="spinner-border text-primary"
                role="status"
                aria-live="polite"
            >
                <span className="visually-hidden">{text}</span>
            </div>
        </div>
    );
}

export default Loading;
