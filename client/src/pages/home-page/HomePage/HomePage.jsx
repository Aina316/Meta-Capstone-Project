import GameList from "../Game/GameList";
import "./HomePage.css";
import Header from "../../../components/Header";
import { useAuth } from "../../../context/authContext";

const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className="home-component">
      <Header />
      <h1>Welcome to HomePage!</h1>
      <p>Logged in as: {user.email}</p>
      <main className="home-content">
        <GameList />
      </main>
    </div>
  );
};

export default HomePage;
