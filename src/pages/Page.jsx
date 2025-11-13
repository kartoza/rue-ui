import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';

function Page({ title, children }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <Box className="App" height="100%" width="100%">
      {children}
    </Box>
  );
}

export default Page;
