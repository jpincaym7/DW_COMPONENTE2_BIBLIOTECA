import { Button } from './Button.jsx';
import { Modal } from './Modal.jsx';

export const ConfirmDialog = ({
  isOpen,
  title = 'Confirmar accion',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onCancel}
    title={title}
    footer={
      <>
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p>{message}</p>
  </Modal>
);
