import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import image from "../assets/images/default_avatar.jpg";
import { createBorrowRequest, makeGameUnavailable } from "../services/requests";
import { fetchAvailableCopiesByCatalogId } from "../services/gameService";
import BorrowRequestDateModal from "./BorrowRequestDateModal";
import { getUserProfile } from "../services/profileService";
import PopupMessage from "./PopupMessage";
import { toast } from "react-toastify";
import { logEngagement } from "../services/engagementService";
import "../App.css";

const GameDetails = ({ catalogGame, onClose }) => {
  const { user } = useAuth();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");

  if (!catalogGame) return null;

  useEffect(() => {
    const loadOwners = async () => {
      setLoading(true);
      const { data, error } = await fetchAvailableCopiesByCatalogId(
        catalogGame.id
      );
      if (error) {
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
    const borrowerProfile = await getUserProfile();
    const borrowerScore = borrowerProfile?.borrower_score ?? 0;
    const lenderMinScore = selectedOwner.owner?.min_borrower_score ?? 5;
    if (borrowerScore < lenderMinScore) {
      setPopupMessage("Your borrower score is too low for this request.");
      return;
    }

    await logEngagement(
      user.id,
      selectedOwner.catalog_id ?? catalogGame.id,
      "borrow"
    );

    const { error } = await createBorrowRequest({
      lenderId: selectedOwner.owner.id,
      gameId: selectedOwner.id,
      gameTitle: catalogGame.title,
      startDate,
      returnDate,
    });

    if (error) {
      alert("Failed to send borrow request.");
    } else {
      const { error: updateError } = await makeGameUnavailable(
        selectedOwner.id
      );
      if (updateError) {
        alert("Failed to update game availability.");
        return;
      }
      toast.success("Borrow Request Sent!");
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

              {copy.owner?.id !== user?.id ? (
                <button
                  className="borrow-btn"
                  onClick={() => handleBorrow(copy)}
                >
                  Borrow
                </button>
              ) : (
                <p className="own-copy-note">Owned</p>
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
      {popupMessage && (
        <PopupMessage
          message={popupMessage}
          onClose={() => setPopupMessage("")}
        />
      )}
    </div>
  );
};

export default GameDetails;
