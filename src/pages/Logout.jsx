import axios from "axios";
import { useEffect } from "react";

function Logout({ setUser }) {
  useEffect(() => {
    setUser(null);

    axios
      .post(
        "http://localhost:5001/auth/logout",
        {},
        { withCredentials: true }
      )
      .then(() => {
        console.log("Logout successful");
      })
      .catch((error) => {
        console.error("Logout Error", error);
      });
  }, [setUser]);

  return null;
}

export default Logout;
