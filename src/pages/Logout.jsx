import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CLEAR_USER } from "../redux/user/action";
import { serverEndpoint } from "../config/appConfig";

function Logout() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear Redux state immediately
    dispatch({ type: CLEAR_USER });

    // Inform backend
    axios
      .post(
        `${serverEndpoint}/auth/logout`,
        {},
        { withCredentials: true }
      )
      
      .then(() => {
        console.log("Logout successful");
      })
      .catch((error) => {
        console.error("Logout Error", error);
      });
  }, [dispatch]);

  return null;
}

export default Logout;
