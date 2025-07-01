import "./RequestBoard.css";

const Request = ({ request, onApprove, onDecline }) => {
  return (
    <div className="request-component">
      <div className="request-info">
        <img
          className="request-avatar"
          src={request.borrower?.image || "/default_avatar.jpg"}
          alt={request.borrower?.username || "Borrower"}
        />

        <div className="request-details">
          <h4>{request.borrower?.username}</h4>
          <p>Borrower Score: {request.borrower?.borrower_score}</p>
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

      {request.status === "Pending" && (
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
