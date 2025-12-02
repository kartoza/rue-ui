import { Box, Button, IconButton, Spinner } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MdDelete } from 'react-icons/md';
import { useCurrentProjects } from '../../redux/selectors/projectsSelector.ts';
import type { AppDispatch } from '../../redux/store.ts';
import { deleteProject, getProjects } from '../../redux/reducers/projectsSlice.ts';
import { getProject, resetProject } from '../../redux/reducers/projectSlice.ts';

import './style.scss';

interface Props {
  toDetail: () => void;
}

export default function ProjectList({ toDetail }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const projectState = useCurrentProjects();

  // Fetch projects on mount
  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  return (
    <Box className="project-list" position="relative">
      <Box flex={1} overflowY="auto" gap="1rem" display="flex" flexDirection="column">
        {projectState.loading && (
          <Box
            className="centered-container"
            position="absolute"
            top="0"
            left="0"
            zIndex={1}
            backgroundColor={projectState.projects.length ? '#DDDDDD55' : '#FFFFFF00'}
          >
            <Spinner size="xl" />
            Loading projects...
          </Box>
        )}
        {!projectState.loading && projectState.projects.length === 0 && (
          <Box className="centered-container" color="#777777">
            You don't have project yet
          </Box>
        )}
        {projectState.projects.length > 0 && (
          <>
            {projectState.projects.map((project) => (
              <Box
                key={project.uuid}
                className="project-card"
                onClick={() => {
                  if (!project.uuid || !project.name) return;
                  dispatch(
                    getProject({
                      uuid: project.uuid,
                      name: project.name,
                    })
                  );
                  toDetail();
                }}
                position="relative"
              >
                <Box className="project-name">{project.name || 'Untitled Project'}</Box>
                <Box className="project-uuid" color="#777777">
                  {project.uuid}
                </Box>
                <IconButton
                  color="red"
                  aria-label="Delete project"
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  position="absolute"
                  top="8px"
                  right="8px"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      project.uuid &&
                      window.confirm(`Delete project "${project.name || 'Untitled'}"?`)
                    ) {
                      dispatch(deleteProject(project.uuid));
                    }
                  }}
                >
                  <MdDelete />
                </IconButton>
              </Box>
            ))}
          </>
        )}
      </Box>
      <Button
        // @ts-expect-error: A custom variant
        variant="primary"
        style={{
          textAlign: 'center',
          width: '100%',
          marginTop: '1rem',
        }}
        onClick={() => {
          dispatch(resetProject());
          toDetail();
        }}
      >
        Create new project
      </Button>
    </Box>
  );
}
