function UnauthorizedAccess() {
    return (
        <div className="container p-6">
            <h2 className="text-primary">Unauthorized Access</h2>
            <p className="text-muted">
                You do not have permissions to view this page.
                Contact your admin for further assistance.
            </p>

        </div>
    );
}
export default UnauthorizedAccess;