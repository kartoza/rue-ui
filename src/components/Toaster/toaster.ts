import { createToaster } from '@chakra-ui/react';

export const ToasterType = {
  error: 'error',
  success: 'success',
  warning: 'warning',
  info: 'info',
  loading: 'loading',
} as const;

export type ToasterType = (typeof ToasterType)[keyof typeof ToasterType];

export const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
});
