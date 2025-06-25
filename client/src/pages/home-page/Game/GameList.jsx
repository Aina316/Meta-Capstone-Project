import Game from "./Game";
import "./GameList.css";
const GameList = ({ games, available, onGameClick, inLibrary }) => {
  if (!games || games.length === 0) {
    return <p>No games available.</p>;
  }
  return (
    <div className="gamelist-component">
      {games.map((game) => (
        <Game
          key={game.id}
          game={game}
          onGameClick={onGameClick}
          available={available}
          inLibrary={inLibrary}
        />
      ))}
    </div>
  );
};
export default GameList;
