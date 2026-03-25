import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import styles from './styles.module.css';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onOpenChange, title, description, children, size = 'md' }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={`${styles.content} ${styles[size]}`}>
          <div className={styles.header}>
            <div>
              <Dialog.Title className={styles.title}>{title}</Dialog.Title>
              {description && <Dialog.Description className={styles.description}>{description}</Dialog.Description>}
            </div>
            <Dialog.Close className={styles.close}>
              <X size={18} />
            </Dialog.Close>
          </div>
          <div className={styles.body}>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
