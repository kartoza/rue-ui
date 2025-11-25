import { useCurrentProject } from '../../redux/selectors/projectSelector.ts';
import type { Project } from '../../redux/reducers/project';
import { Box } from '@chakra-ui/react';

import './style.scss';

export default function ProjectDescription() {
  const project: Project | null = useCurrentProject();
  if (!project?.uuid) {
    return;
  }
  return (
    <Box className="ProjectDescription">
      Project : <span>{project.uuid}</span>
    </Box>
  );
}
