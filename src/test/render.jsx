// src/test/render.jsx
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { render as rtlRender } from '@testing-library/react';
import { kartozaTheme } from '../theme/Theme';

export function render(ui) {
  return rtlRender(<>{ui}</>, {
    wrapper: (props) => (
      <ChakraProvider value={kartozaTheme}>
        <MemoryRouter>{props.children}</MemoryRouter>
      </ChakraProvider>
    ),
  });
}
