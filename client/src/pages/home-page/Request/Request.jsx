import { Link } from "react-router-dom";
import "./RequestBoard.css";

const Request = ({ request, perspective, onApprove, onDecline }) => {
  const otherUser =
    perspective === "lender" ? request.borrower : request.lender;

  return (
    <div className="request-component">
      <div className="request-info">
        <Link to={`/profile/${otherUser?.id}`}>
          <img
            className="request-avatar"
            src={otherUser?.image || "/default_avatar.jpg"}
            alt={otherUser?.username || "User"}
          />
        </Link>

        <div className="request-details">
          <h4>{otherUser?.username}</h4>
          <p className="game-title">
            Game: <strong>{request.game?.title || "Unknown Game"}</strong>
          </p>

          {request.start_date && request.return_date && (
            <p>
              Borrowing: From{" "}
              {new Date(request.start_date).toLocaleDateString()} to{" "}
              {new Date(request.return_date).toLocaleDateString()}
            </p>
          )}

          {perspective === "lender" && (
            <p>Borrower Score: {otherUser?.borrower_score ?? "N/A"}</p>
          )}
          {perspective === "borrower" && (
            <p>Lender Score: {otherUser?.lender_score ?? "N/A"}</p>
          )}
          <p className="request-date">
            Requested on: {new Date(request.created_at).toLocaleDateString()}
          </p>
          <p>Status: {request.status}</p>

          {request.status === "Accepted" && request.share_instructions && (
            <div className="instructions-box">
              <strong>Instructions:</strong>
              <p>{request.share_instructions}</p>
            </div>
          )}
        </div>
      </div>

      {perspective === "lender" && request.status === "Pending" && (
        <div className="request-actions">
          <button className="accept-btn" onClick={onApprove}>
            Accept
          </button>
          <button className="decline-btn" onClick={onDecline}>
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default Request;
