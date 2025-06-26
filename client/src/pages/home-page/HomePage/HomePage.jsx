import GameList from "../Game/GameList";
import RequestBoard from "../Request/RequestBoard";
import "./HomePage.css";
import Header from "../../../components/Header";
const HomePage = () => {
  return (
    <div className="home-component">
      <Header />
      <main>
        <p>This is the home page</p>
      </main>
    </div>
  );
};
export default HomePage;
