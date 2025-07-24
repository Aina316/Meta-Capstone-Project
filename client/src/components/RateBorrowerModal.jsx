import { useState } from "react";
import { submitBorrowerFeedback } from "../services/feedbackService";
import { markNotificationAsRead } from "../services/notificationService";
import "../App.css";

const RateBorrowerModal = ({
  requestId,
  borrowerId,
  notificationId,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (feedback) => {
    setLoading(true);
    setError("");
    try {
      const { error } = await submitBorrowerFeedback(
        requestId,
        borrowerId,
        feedback
      );
      if (error) {
        setError("Failed to submit feedback.");
      } else {
        if (notificationId) {
          await markNotificationAsRead(notificationId);
        }
        onClose();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Rate this Borrower</h2>
        <p>Did you have a good experience with this borrower?</p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="modal-buttons">
          <button
            onClick={() => handleSubmit("like")}
            disabled={loading}
            className="upvote-btn"
          >
            👍 Yes
          </button>
          <button
            onClick={() => handleSubmit("dislike")}
            disabled={loading}
            className="downvote-btn"
          >
            👎 No
          </button>
        </div>

        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default RateBorrowerModal;
