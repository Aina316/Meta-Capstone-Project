import { useState } from "react";
import "./RequestBoard.css";
import Request from "./Request";
const RequestBoard = () => {
  const [requests, setRequests] = useState([]);

  return (
    <div className="request-board-component">
      <h2>Borrow Requests</h2>
      {requests.length == 0 ? (
        <p>No requests right now!</p>
      ) : (
        <div className="request-list">
          {setRequests.map((req) => (
            <Request key={req.id} request={req} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestBoard;
