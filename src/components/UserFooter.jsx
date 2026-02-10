function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="container-fluid bg-light border-top text-center py-3 mt-auto">
            <span className="text-muted small">
                © {currentYear} ExpenseApp. All rights reserved.
            </span>
        </footer>
    );
}

export default Footer;
