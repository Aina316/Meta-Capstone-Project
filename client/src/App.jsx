import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Landing from "./pages/landing-page/Landing";
import Login from "./pages/login-page/Login";
import Signup from "./pages/signup-page/Signup";
import NewUserPage from "./pages/new-user-page/NewUserPage";
import HomePage from "./pages/home-page/HomePage/HomePage";
import ProfilePage from "./pages/profile-page/ProfilePage";
import GameLibrary from "./pages/game-library-page/GameLibrary";
import LikedGames from "./pages/liked-games-page/LikedGames";
import UserProfilePage from "./pages/profile-page/UserProfilePage";
import UserGameLibrary from "./pages/game-library-page/UserGameLibrary";
import NotificationsPage from "./pages/notifications-page/NotificationsPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/newuser"
        element={
          <PrivateRoute>
            <NewUserPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <NotificationsPage />
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
      <Route
        path="/library"
        element={
          <PrivateRoute>
            <GameLibrary />
          </PrivateRoute>
        }
      />
      <Route
        path="/liked-games"
        element={
          <PrivateRoute>
            <LikedGames />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <PrivateRoute>
            <UserProfilePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile/:userId/library"
        element={
          <PrivateRoute>
            <UserGameLibrary />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
export default App;
