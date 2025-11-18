import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

interface PageProps {
  title: string;
  children: ReactNode;
}

function Page({ title, children }: PageProps) {
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
