import { AlertTriangle } from "lucide-react";
import "./ConfirmDialog.css";

const ConfirmDialog = ({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel, loading = false }) => {
  if (!open) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <AlertTriangle size={24} />
        </div>
        <h3 className="confirm-title">{title || "Confirm"}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn--cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="confirm-btn confirm-btn--danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
