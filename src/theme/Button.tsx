import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      primary: {
        bg: 'primary.500',
        color: 'white',
        _hover: { bg: 'secondary.500' },
      },
      base: {
        bg: 'white',
        color: 'blackAlpha.900',
        _hover: { color: 'black' },
      },
      'primary.outline': {
        bg: 'transparent',
        color: 'primary.500',
        border: '1px solid',
        borderColor: 'primary.500',
        _hover: {
          bg: 'secondary.500',
          color: 'white',
          borderColor: 'secondary.500',
        },
      },
      success: {
        bg: 'green.500',
        color: 'white',
        border: '1px solid',
        borderColor: 'green.500',
        _hover: {
          bg: 'green.600',
          color: 'white',
        },
      },
      'success.basic': {
        bg: 'transparent',
        color: 'green.500',
        _hover: {
          color: 'green.600',
        },
      },
      danger: {
        bg: 'red.500',
        color: 'white',
        border: '1px solid',
        borderColor: 'red.500',
        _hover: {
          bg: 'red.600',
          color: 'white',
        },
      },
      'danger.basic': {
        bg: 'transparent',
        color: 'red.500',
        _hover: {
          color: 'red.600',
        },
      },
    },
  },
});
