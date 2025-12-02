import { useCurrentProject } from '../../redux/selectors/projectSelector.ts';
import type { Project } from '../../redux/reducers/project';
import { Box } from '@chakra-ui/react';
import { MdChevronLeft } from 'react-icons/md';

import './style.scss';

interface Props {
  toList: () => void;
}

export default function ProjectDescription({ toList }: Props) {
  const project: Project | null = useCurrentProject();
  return (
    <Box className="ProjectDescription">
      <MdChevronLeft
        className="svg-button"
        onClick={() => toList()}
        style={{ cursor: 'pointer' }}
      />
      {project?.uuid && <span>{project.name}</span>}
      {!project?.uuid && <span>Create new project</span>}
    </Box>
  );
}
