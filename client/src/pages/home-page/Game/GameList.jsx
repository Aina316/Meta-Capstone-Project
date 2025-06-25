import Game from "./Game";
import "./GameList.css";
const GameList = () => {
  return (
    <div className="game-list-component">
      <Game />
      <Game />
      <Game />
    </div>
  );
};
export default GameList;
