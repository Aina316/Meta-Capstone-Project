import "./RequestBoard.css";

const Request = ({ request }) => {
  return (
    <div className="request-component">
      <div className="request-info">
        <img
          className="request-avatar"
          src={request.avatar}
          alt={request.username}
        />
        <div className="request-details">
          <h4>{request.username}</h4>
          <p>Borrower Score: {request.borrowerScore}</p>
          <p className="request-date">{request.date}</p>
        </div>
      </div>
      <div className="request-actions">
        <button className="accept-btn">Accept</button>
        <button className="decline-btn">Decline</button>
      </div>
    </div>
  );
};

export default Request;
