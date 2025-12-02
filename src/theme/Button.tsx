import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      primary: {
        bg: 'primary.500',
        color: 'white',
        _hover: { bg: 'secondary.500' },
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
