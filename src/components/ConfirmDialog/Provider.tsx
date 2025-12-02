import { useEffect, type ReactNode } from 'react';
import { DialogProvider } from './Manager';
import { setDialogInstance, useDialog } from './ConfirmDialog';

function DialogInitializer({ children }: { children: ReactNode }) {
  const dialog = useDialog();

  useEffect(() => {
    setDialogInstance(dialog);
  }, [dialog]);

  return <>{children}</>;
}

export function DialogProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <DialogProvider>
      <DialogInitializer>{children}</DialogInitializer>
    </DialogProvider>
  );
}
