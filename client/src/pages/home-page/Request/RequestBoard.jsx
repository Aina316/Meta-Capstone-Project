import { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { fetchRequestsForLender } from "../../../services/requests";
import Request from "./Request";
import "./RequestBoard.css";

const RequestBoard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadRequests = async () => {
      setLoading(true);
      const { data, error } = await fetchRequestsForLender(user.id);
      if (error) {
        console.error("Error fetching requests:", error);
      } else {
        setRequests(data);
      }
      setLoading(false);
    };

    loadRequests();
  }, [user]);

  return (
    <div className="request-board-component">
      <h2>Borrow Requests</h2>
      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No requests at this time.</p>
      ) : (
        <div className="request-list">
          {requests.map((req) => (
            <Request
              key={req.id}
              request={{
                date: new Date(req.created_at).toLocaleDateString(),
                username: req.borrower?.username,
                avatar: req.borrower?.image,
                borrowerScore: req.borrower?.borrower_score,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestBoard;
