import Header from "./Header";
import Footer from "./Footer";

// Public layout wrapper (Home, Login, Register, etc.)
function AppLayout({ children }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}

export default AppLayout;
