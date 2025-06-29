import "../style/GameDetails.css";

const GameDetails = ({ game, onClose }) => {
  if (!game) return null;

  return (
    <div className="game-details-modal-backdrop" onClick={onClose}>
      <div
        className="game-details-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>
          X
        </button>

        {game.cover_image && (
          <img
            src={game.cover_image}
            alt={game.title}
            className="game-details-cover"
          />
        )}
        <h2>{game.title}</h2>
        <p>
          <strong>Platform:</strong> {game.platform}
        </p>
        <p>
          <strong>Genre:</strong> {game.genre}
        </p>

        <button className="borrow-button">Request to Borrow</button>
      </div>
    </div>
  );
};

export default GameDetails;
