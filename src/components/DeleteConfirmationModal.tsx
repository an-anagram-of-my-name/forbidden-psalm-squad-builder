import React from 'react';
import './DeleteConfirmationModal.css';

interface DeleteConfirmationModalProps {
  squadName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  squadName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content delete-confirmation" onClick={(e) => e.stopPropagation()}>
        <h2>Delete Squad?</h2>
        <p>
          Are you sure you want to delete <strong>'{squadName}'</strong>? This action cannot be
          undone. All characters in this squad will be permanently deleted.
        </p>
        <div className="modal-buttons">
          <button className="btn-modal-cancel" onClick={onCancel}>
            NO
          </button>
          <button className="btn-modal-confirm" onClick={onConfirm}>
            YES, DELETE
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
