// src/components/NavBar/NavBar.tsx
import { Box, Button, Heading, Icon } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaBug } from 'react-icons/fa';

import './style.scss';

function Navbar() {
  const errorButtonClicked = () => {
    throw new Error('error!');
  };

  return (
    <Box as="header" bg="primary.500" px={4} py={2} shadow="md">
      <Box>
        <Heading size="md">
          <Link to="/">Kartoza React Base</Link>
        </Heading>
      </Box>
      <Box>
        <Link to="/map">Map</Link>
        <Link to="/about">About</Link>
        <Button variant="outline">Login</Button>
        <Box className="bug-icon">
          <Icon
            as={FaBug}
            aria-label="Report a bug"
            data-testid="bug-icon"
            onClick={errorButtonClicked}
            cursor="pointer"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Navbar;
