import { createToaster } from '@chakra-ui/react';

export enum ToasterType {
  error = 'error',
  success = 'success',
  warning = 'warning',
  info = 'info',
  loading = 'loading',
}

export const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
});
