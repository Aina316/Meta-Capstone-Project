import { useState } from "react";
import "../App.css";

const BorrowRequestDateModal = ({ onClose, onSubmit }) => {
  const [startDate, setStartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleConfirm = () => {
    if (!startDate || !returnDate) {
      alert("Please select both start and return dates!");
      return;
    }
    onSubmit(startDate, returnDate);
  };

  return (
    <div className="borrow-modal-overlay">
      <div className="borrow-modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>Set Borrowing Dates</h2>
        <div className="date-pickers">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            Return Date:
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </label>
        </div>
        <button className="confirm-btn" onClick={handleConfirm}>
          Confirm Request
        </button>
      </div>
    </div>
  );
};

export default BorrowRequestDateModal;
