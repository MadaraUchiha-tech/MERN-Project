import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";

import { Toaster } from "react-hot-toast";
import { authStore } from "./store/authStore";
import { useEffect } from "react";

function App() {
  const { loggedUser, checkAuth } = authStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={loggedUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!loggedUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!loggedUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={loggedUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}
export default App;
