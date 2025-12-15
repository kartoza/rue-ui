import { Box, Button, IconButton, Spinner } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MdDelete } from 'react-icons/md';
import { useCurrentProjects } from '../../redux/selectors/projectsSelector.ts';
import type { AppDispatch } from '../../redux/store.ts';
import { deleteProject, getProjects } from '../../redux/reducers/projectsSlice.ts';
import { getProject, resetProject } from '../../redux/reducers/projectSlice.ts';
import { ConfirmDialog } from '../ConfirmDialog';

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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

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
                <Box
                  color="#777777"
                  style={{
                    display: 'flex',
                    fontSize: '0.8rem',
                    justifyContent: 'space-between',
                    marginTop: 8,
                  }}
                >
                  <Box>
                    <Box>Last update:</Box>
                    <Box>{formatDateTime(project.updated_at)}</Box>
                  </Box>
                  <Box style={{ textAlign: 'right' }}>
                    <Box>Created at:</Box>
                    <Box>{formatDateTime(project.created_at)}</Box>
                  </Box>
                </Box>
                <IconButton
                  aria-label="Delete project"
                  size="sm"
                  // @ts-expect-error: A custom variant
                  variant="danger.basic"
                  position="absolute"
                  top="8px"
                  right="8px"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!project.uuid) return;

                    ConfirmDialog.danger(
                      'Delete Project',
                      `Are you sure you want to delete "${project.name || 'Untitled'}"? This action cannot be undone.`,
                      () => {
                        dispatch(deleteProject(project.uuid!));
                      }
                    );
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
