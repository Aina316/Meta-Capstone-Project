import { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import {
  fetchRequestsForLender,
  updateRequestStatus,
  updateRequestStatusWithInstructions,
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

  const loadRequests = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await fetchRequestsForLender(user.id);
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
  }, [user]);

  const handleDecline = async (requestId) => {
    const { error } = await updateRequestStatus(requestId, "Declined");
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

  const handleApproveWithInstructions = async (instructions) => {
    if (!selectedRequest) return;
    const { error } = await updateRequestStatusWithInstructions(
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
      <h2>Borrow Requests</h2>

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="no-requests">No borrow requests at this time.</p>
      ) : (
        <div className="request-list">
          {requests.map((req) => (
            <Request
              key={req.id}
              request={req}
              onApprove={() => openApproveModal(req)}
              onDecline={() => handleDecline(req.id)}
            />
          ))}
        </div>
      )}

      {showApproveModal && selectedRequest && (
        <ApproveRequestModal
          onClose={() => setShowApproveModal(false)}
          onAccepted={handleApproveWithInstructions}
        />
      )}
    </div>
  );
};

export default RequestBoard;
