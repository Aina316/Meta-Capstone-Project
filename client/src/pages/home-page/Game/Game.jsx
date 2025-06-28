import { Link } from "react-router-dom";
import "./Game.css";
const Game = ({ game }) => {
  return (
    <div className="game-component">
      <Link to={`/games/${game.id}`}></Link>
      <img src={game.cover_image} alt={game.title} className="game-image" />
      <h3>{game.title}</h3>
      <p>{game.platform}</p>
    </div>
  );
};

export default Game;
