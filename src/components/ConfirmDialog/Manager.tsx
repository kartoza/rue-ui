import { Button, Dialog as ChakraDialog, Portal } from '@chakra-ui/react';
import { type ReactNode, useCallback, useState } from 'react';
import { DialogContext } from './ConfirmDialog';

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

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showDialog = useCallback((config: Omit<DialogConfig, 'id'>) => {
    setDialog({
      id: Math.random().toString(36).substring(7),
      ...config,
    });
    setIsOpen(true);
  }, []);

  const hideDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = () => {
    dialog?.onConfirm?.();
    hideDialog();
  };

  const handleCancel = () => {
    dialog?.onCancel?.();
    hideDialog();
  };

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      {dialog && (
        <Portal>
          <ChakraDialog.Root open={isOpen} onOpenChange={({ open }) => !open && handleCancel()}>
            <ChakraDialog.Backdrop />
            <ChakraDialog.Positioner>
              <ChakraDialog.Content>
                <ChakraDialog.Header>{dialog.title}</ChakraDialog.Header>
                <ChakraDialog.CloseTrigger
                  position="absolute"
                  top="2"
                  right="2"
                  onClick={handleCancel}
                />
                <ChakraDialog.Body>{dialog.message}</ChakraDialog.Body>
                <ChakraDialog.Footer>
                  <ChakraDialog.ActionTrigger asChild>
                    <Button variant="outline" onClick={handleCancel}>
                      {dialog.cancelText || 'Cancel'}
                    </Button>
                  </ChakraDialog.ActionTrigger>
                  {/* @ts-expect-error: A custom variant*/}
                  <Button variant={dialog.variant} onClick={handleConfirm}>
                    {dialog.confirmText || 'Confirm'}
                  </Button>
                </ChakraDialog.Footer>
              </ChakraDialog.Content>
            </ChakraDialog.Positioner>
          </ChakraDialog.Root>
        </Portal>
      )}
    </DialogContext.Provider>
  );
}
