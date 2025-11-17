// src/test/render.tsx
import type { ReactElement, PropsWithChildren } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { render as rtlRender } from '@testing-library/react';
import { kartozaTheme } from '../theme/Theme';

export function render(ui: ReactElement) {
  return rtlRender(<>{ui}</>, {
    wrapper: (props: PropsWithChildren<object>) => (
      <ChakraProvider value={kartozaTheme}>
        <MemoryRouter>{props.children}</MemoryRouter>
      </ChakraProvider>
    ),
  });
}
