
export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirmer",
  onConfirm,
  onCancel,
  danger = false,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-icon ${danger ? "danger" : "normal"}`}>
          {danger ? "!" : "?"}
        </div>

        <h2>{title}</h2>
        <p>{message}</p>

        <div className="confirm-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Annuler
          </button>
          <button
            className={`confirm-btn ${danger ? "danger-btn" : ""}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
