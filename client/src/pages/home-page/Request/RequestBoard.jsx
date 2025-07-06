import { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import {
  fetchRequestsForLender,
  fetchRequestsForBorrower,
  updateDenialStatus,
  updateApprovalStatus,
} from "../../../services/requests";
import Request from "./Request";
import ApproveRequestModal from "./ApproveRequestModal";
import "./RequestBoard.css";

const RequestBoard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [boardView, setBoardView] = useState("isIncoming"); //sets view of the request board to either incoming or outgoing requests

  const loadRequests = async () => {
    if (!user) return;
    setLoading(true);

    let data, error;
    if (boardView === "isIncoming") {
      ({ data, error } = await fetchRequestsForLender(user.id));
    } else {
      ({ data, error } = await fetchRequestsForBorrower(user.id));
    }

    if (error) {
      console.error("Error fetching requests:", error);
      alert("Failed to load requests.");
      setRequests([]);
    } else {
      setRequests(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, [user, boardView]);

  const handleDecline = async (requestId) => {
    const { error } = await updateDenialStatus(requestId, "Declined");
    if (error) {
      alert("Failed to decline request");
    } else {
      alert("Request declined.");
      loadRequests();
    }
  };

  const openApproveModal = (request) => {
    setSelectedRequest(request);
    setShowApproveModal(true);
  };

  const handleApprove = async (instructions) => {
    if (!selectedRequest) return;
    const { error } = await updateApprovalStatus(
      selectedRequest.id,
      "Accepted",
      instructions
    );
    if (error) {
      alert("Failed to approve request");
    } else {
      alert("Request approved!");
      loadRequests();
    }
    setShowApproveModal(false);
  };

  return (
    <div className="request-board-component">
      <h2>Borrow Requests Board</h2>

      <div className="view-toggle">
        <button
          className={boardView === "isIncoming" ? "active" : ""}
          onClick={() => setBoardView("isIncoming")}
        >
          Requests To Me
        </button>
        <button
          className={boardView === "isOutgoing" ? "active" : ""}
          onClick={() => setBoardView("isOutgoing")}
        >
          My Borrow Requests
        </button>
      </div>

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="no-requests">
          {boardView === "isIncoming"
            ? "No incoming borrow requests at this time."
            : "You haven't made any borrow requests yet."}
        </p>
      ) : (
        <div className="request-list">
          {requests.map((req) => (
            <Request
              key={req.id}
              request={req}
              perspective={boardView === "isIncoming" ? "lender" : "borrower"}
              onApprove={() => openApproveModal(req)}
              onDecline={() => handleDecline(req.id)}
            />
          ))}
        </div>
      )}

      {showApproveModal && selectedRequest && (
        <ApproveRequestModal
          onClose={() => setShowApproveModal(false)}
          onAccepted={handleApprove}
        />
      )}
    </div>
  );
};

export default RequestBoard;
