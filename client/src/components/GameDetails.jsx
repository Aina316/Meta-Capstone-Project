import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import image from "../assets/images/default_avatar.jpg";
import { createBorrowRequest, makeGameUnavailable } from "../services/requests";
import { fetchAvailableCopiesByCatalogId } from "../services/gameService";
import BorrowRequestDateModal from "./BorrowRequestDateModal";
import "../App.css";

const GameDetails = ({ catalogGame, onClose }) => {
  const { user } = useAuth();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState(null);

  if (!catalogGame) return null;

  useEffect(() => {
    const loadOwners = async () => {
      setLoading(true);
      const { data, error } = await fetchAvailableCopiesByCatalogId(
        catalogGame.id
      );
      if (error) {
        console.error("Error loading owners:", error);
        setOwners([]);
      } else {
        setOwners(data);
      }
      setLoading(false);
    };

    loadOwners();
  }, [catalogGame]);

  const handleBorrow = (ownerCopy) => {
    setSelectedOwner(ownerCopy);
  };

  const handleConfirmRequest = async (startDate, returnDate) => {
    if (!user || !selectedOwner) return;

    const { error } = await createBorrowRequest({
      lenderId: selectedOwner.owner.id,
      gameId: selectedOwner.id,
      gameTitle: catalogGame.title,
      startDate,
      returnDate,
    });

    if (error) {
      console.error("Borrow request failed:", error);
      alert("Failed to send borrow request.");
    } else {
      const { error: updateError } = await makeGameUnavailable(
        selectedOwner.id
      );
      if (updateError) {
        console.error("Error updating availability:", updateError);
        alert("Failed to update game availability.");
        return;
      }
      alert("Borrow request sent!");
      onClose();
    }

    setSelectedOwner(null);
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
          <strong>Genre:</strong> {catalogGame.genre}
        </p>
        <p>
          <strong>Platform:</strong> {catalogGame.platform}
        </p>

        <hr />

        <h3>Available Copies:</h3>
        {loading && <p>Loading available owners...</p>}
        {!loading && owners.length === 0 && <p>No available copies yet.</p>}

        <div className="owners-list">
          {owners.map((copy) => (
            <div key={copy.id} className="owner-card">
              <img
                src={copy.owner?.image || image}
                alt={copy.owner?.username}
                className="owner-avatar"
              />
              <div className="owner-info">
                <h4>{copy.owner?.username}</h4>
                <p>Borrower Score: {copy.owner?.borrower_score ?? "N/A"}</p>
                <p>Lender Score: {copy.owner?.lender_score ?? "N/A"}</p>
                <p>Condition: {copy.condition}</p>
              </div>

              {user.id !== copy.owner.id && (
                <button
                  className="borrow-btn"
                  onClick={() => handleBorrow(copy)}
                >
                  Borrow
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedOwner && (
        <BorrowRequestDateModal
          onClose={() => setSelectedOwner(null)}
          onSubmit={handleConfirmRequest}
        />
      )}
    </div>
  );
};

export default GameDetails;
