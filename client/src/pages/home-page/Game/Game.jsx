import { Link } from "react-router-dom";

const Game = ({ game }) => {
  return (
    <div className="game-component">
      <Link to={`/games/${game.id}`}></Link>
      <img src={game.mage} alt={game.title} className="game-image" />
      <h3>{game.title}</h3>
      <p>{game.platform}</p>
      <p>Owner: {game.owner.username}</p>
    </div>
  );
};

export default Game;
