import GameList from "../Game/GameList";
import "./HomePage.css";
import Header from "../../../components/Header";
import RequestBoard from "../Request/RequestBoard";
import { useAuth } from "../../../context/authContext";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-component">
      <Header />
      <h1>Welcome to the Den!</h1>
      <p>Logged in as: {user.email}</p>
      <main className="home-content">
        <div className="game-list-section">
          <GameList />
        </div>
        <div className="requests-section">
          <RequestBoard />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
