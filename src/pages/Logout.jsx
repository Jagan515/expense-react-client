import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { CLEAR_USER } from "../redux/user/action";
import { serverEndpoint } from "../config/appConfig";

function Logout() {
    const dispatch = useDispatch();

    const handleLogout = async () => {
        // Immediately clear user state (UI should react instantly)
        dispatch({ type: CLEAR_USER });

        try {
            await axios.post(
                `${serverEndpoint}/auth/logout`,
                {},
                { withCredentials: true }
            );

            // Clear auth cookie if present
            document.cookie =
                "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        handleLogout();
    }, []);

    // No UI needed for logout
    return null;
}

export default Logout;
