import UserHeader from "./UserHeader";
import Footer from "./Footer";

function UserLayout({ children }) {
    return (
        <div className="d-flex flex-column min-vh-100">
            <UserHeader />

            {/* Main content */}
            <main className="flex-grow-1">
                {children}
            </main>

            <Footer />
        </div>
    );
}

export default UserLayout;
