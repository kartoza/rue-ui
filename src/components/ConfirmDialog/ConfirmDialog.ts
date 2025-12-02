import { createContext, useContext } from 'react';

interface DialogConfig {
  id: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: 'danger' | 'info' | 'warning';
}

export interface DialogContextValue {
  showDialog: (config: Omit<DialogConfig, 'id'>) => void;
  hideDialog: () => void;
}

// Context for dialog state
export const DialogContext = createContext<DialogContextValue | undefined>(undefined);

// Hook to use dialog context
export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }
  return context;
}

// Singleton instance for imperative API
let dialogInstance: DialogContextValue | null = null;

export function setDialogInstance(instance: DialogContextValue) {
  dialogInstance = instance;
}

// Imperative API - can be called from anywhere
export const ConfirmDialog = {
  show: (config: Omit<DialogConfig, 'id'>) => {
    if (!dialogInstance) {
      console.error('ConfirmDialog not initialized. Make sure DialogProvider is mounted.');
      return;
    }
    dialogInstance.showDialog(config);
  },

  confirm: (title: string, message: string, onConfirm?: () => void, onCancel?: () => void) => {
    ConfirmDialog.show({
      title,
      message,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      onConfirm,
      onCancel,
    });
  },

  danger: (title: string, message: string, onConfirm?: () => void, onCancel?: () => void) => {
    ConfirmDialog.show({
      title,
      message,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm,
      onCancel,
    });
  },

  hide: () => {
    if (dialogInstance) {
      dialogInstance.hideDialog();
    }
  },
};
