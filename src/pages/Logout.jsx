import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CLEAR_USER } from "../redux/user/action";
import { serverEndpoint } from "../config/appConfig";

function Logout() {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleLogout = async () => {
            // Clear Redux state immediately
            dispatch({ type: CLEAR_USER });

            try {
                await axios.post(
                    `${serverEndpoint}/auth/logout`,
                    {},
                    { withCredentials: true }
                );

                // Clear cookie if present
                document.cookie =
                    "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            } catch (error) {
                console.error("Logout Error", error);
            }
        };

        handleLogout();
    }, [dispatch]);

    return null;
}

export default Logout;
