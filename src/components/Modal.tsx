import { ReactNode } from 'react';

type ModalProps = {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
  children?: ReactNode;
};

const Modal = ({
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  children,
}: ModalProps) => (
  <div className="modal-backdrop" role="dialog" aria-modal="true">
    <div className="modal">
      <div>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {description && <p className="muted" style={{ marginTop: 6 }}>{description}</p>}
      </div>
      {children}
      <div className="footer-actions">
        <button className="secondary" onClick={onCancel} type="button">
          {cancelLabel}
        </button>
        <button
          className={tone === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          type="button"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default Modal;
