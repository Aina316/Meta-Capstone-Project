import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { createBorrowRequest, makeGameUnavailable } from "../services/requests";
import { fetchAvailableCopiesByCatalogId } from "../services/gameService";
import "../App.css";

const GameDetails = ({ catalogGame, onClose }) => {
  const { user } = useAuth();
  const [availableCopies, setAvailableCopies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCopies = async () => {
      setLoading(true);
      const { data, error } = await fetchAvailableCopiesByCatalogId(
        catalogGame.id
      );
      if (error) {
        console.error("Error fetching copies:", error);
        alert("Could not load available copies.");
      } else {
        setAvailableCopies(data);
      }
      setLoading(false);
    };

    loadCopies();
  }, [catalogGame.id]);

  const handleBorrow = async (copy) => {
    if (!user) {
      alert("You must be logged in to borrow.");
      return;
    }

    const { error: requestError } = await createBorrowRequest({
      borrowerId: user.id,
      lenderId: copy.owner_id,
      gameId: copy.id,
    });

    if (requestError) {
      console.error("Error sending request:", requestError);
      alert("Failed to send borrow request.");
      return;
    }

    const { error: updateError } = await makeGameUnavailable(copy.id);
    if (updateError) {
      console.error("Error updating availability:", updateError);
      alert("Failed to update game availability.");
      return;
    }

    alert("Borrow request sent successfully!");
    onClose();
  };

  return (
    <div className="game-details-modal-overlay">
      <div className="game-details-modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>{catalogGame.title}</h2>
        <img
          src={catalogGame.cover_image}
          alt={catalogGame.title}
          className="cover-image"
        />
        <p>
          <strong>Platform:</strong> {catalogGame.platform}
        </p>

        <h3>Available Copies</h3>
        {loading ? (
          <p>Loading...</p>
        ) : availableCopies.length === 0 ? (
          <p>No available copies at this time.</p>
        ) : (
          <div className="available-copies-list">
            {availableCopies.map((copy) => (
              <div key={copy.id} className="copy-card">
                <div className="owner-info">
                  <img
                    src={copy.owner?.image || "/default_avatar.jpg"}
                    alt={copy.owner?.username}
                    className="owner-avatar"
                  />
                  <div>
                    <p>
                      <strong>{copy.owner?.username}</strong>
                    </p>
                    <p>Borrower Score: {copy.owner?.borrower_score ?? "N/A"}</p>
                    <p>Condition: {copy.condition}</p>
                  </div>
                </div>
                <button
                  className="borrow-btn"
                  onClick={() => handleBorrow(copy)}
                >
                  Borrow Game
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDetails;
