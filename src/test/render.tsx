// src/test/render.tsx
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { render as rtlRender } from '@testing-library/react';
import { kartozaTheme } from '../theme/Theme';

export function render(ui: React.ReactNode) {
  return rtlRender(<>{ui}</>, {
    wrapper: (props: React.PropsWithChildren) => (
      <ChakraProvider value={kartozaTheme}>
        <MemoryRouter>{props.children}</MemoryRouter>
      </ChakraProvider>
    ),
  });
}
