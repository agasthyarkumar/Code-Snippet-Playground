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
  buttonClass?: string;
};

const Modal = ({
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone: _tone = 'default',
  children,
  buttonClass = 'btn-ghost',
}: ModalProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur transition-all duration-200"
    role="dialog"
    aria-modal="true"
  >
    <div className="w-full max-w-md animate-scale rounded-xl border border-black bg-white p-6 text-black shadow-2xl dark:bg-black dark:text-white dark:border-white dark:shadow-2xl">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      {children}
      <div className="mt-6 flex justify-end gap-2">
        <button className={buttonClass} onClick={onCancel} type="button">
          {cancelLabel}
        </button>
        <button className={buttonClass} onClick={onConfirm} type="button">
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default Modal;
