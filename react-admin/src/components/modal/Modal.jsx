import { createPortal } from "react-dom";
import "./style.css";

export default function Modal({ open, title, children, onClose, onConfirm }) {
  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
        </div>

        <div className="modal-body">{children}</div>

        <div className="modal-footer">
          <button className="modal-btn cancel" onClick={onClose}>
            Отмена
          </button>
          <button className="modal-btn confirm" onClick={onConfirm}>
            Подтвердить
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
