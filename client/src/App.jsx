import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Landing from "./pages/landing-page/Landing";
import Login from "./pages/login-page/Login";
import Signup from "./pages/signup-page/Signup";
import HomePage from "./pages/home-page/HomePage/HomePage";
import ProfilePage from "./pages/profile-page/ProfilePage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
export default App;
