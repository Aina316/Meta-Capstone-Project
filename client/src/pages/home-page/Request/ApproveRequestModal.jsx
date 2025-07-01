import { useState } from "react";
import "./RequestBoard.css";

const ApproveRequestModal = ({ onClose, onAccepted, initialInstructions }) => {
  const [instructions, setInstructions] = useState(initialInstructions);

  const handleApprove = () => {
    if (!instructions.trim()) {
      alert("Please enter instructions for pickup or digital sharing!");
      return;
    }
    onAccepted(instructions);
  };

  return (
    <div className="approve-modal-overlay">
      <div className="approve-modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>Approve Borrow Request</h2>
        <p>Enter instructions for the borrower:</p>
        <textarea
          placeholder="e.g. Meet at library at 5pm, or Add my Steam account: user123"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={4}
        />

        <div className="modal-actions">
          <button className="approve-btn" onClick={handleApprove}>
            Approve
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveRequestModal;
