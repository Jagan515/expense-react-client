import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import AppLayout from "./components/AppLayout";
import UserLayout from "./components/UserLayout";
import axios from "axios";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";



function App() {

  const [userDetails, setUserDetails] = useState(null); 

  const isUserLoggedIn = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5001/auth/is-user-logged-in",
      {},
      { withCredentials: true }
    );

    setUserDetails(response.data.user);
  } catch (error) {
    const status = error.response?.status;

    if (status === 401) {
      // Expected: user not authenticated
      setUserDetails(null);
      return;
    }

    // Unexpected error (network, 500, etc.)
    console.error("Auth check failed:", error);
  }
};



  useEffect (()=>{
    isUserLoggedIn();
  },[]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <AppLayout>
              <Home />
            </AppLayout>
          )
        }
      />

      <Route
        path="/login"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <AppLayout>
              <Login setUser={setUserDetails} />
            </AppLayout>
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          userDetails ? (
            <UserLayout>
              <Dashboard user={userDetails} />
            </UserLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/logout"
        element={
          userDetails ? (
            <Logout setUser={setUserDetails} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/register"
        element={
            userDetails ? (
            <Navigate to="/dashboard" />
            ) : (
            <AppLayout>
                <Register setUser={setUserDetails} />
            </AppLayout>
            )
        }
        />

        <Route
          path="/reset-password"
          element={
            <AppLayout>
              <ResetPassword />
            </AppLayout>
          }
        />


      
    </Routes>


  
  );
}

export default App;
