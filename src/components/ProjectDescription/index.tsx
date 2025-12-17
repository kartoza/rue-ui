import { useCurrentProject, useCurrentProjectDone } from '../../redux/selectors/projectSelector.ts';
import type { Project } from '../../redux/reducers/project';
import { Box, Button, Dialog, IconButton, Portal, Spinner } from '@chakra-ui/react';
import { MdChevronLeft, MdModeEdit } from 'react-icons/md';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ProjectDetailEditor } from '../ProjectDetailEditor';

import { patchProject } from '../../redux/reducers/projectSlice.ts';
import type { AppDispatch } from '../../redux/store.ts';

import './style.scss';

function ProjectNameEditor({
  open,
  onOpenChange,
  project,
  isProjectDone,
}: {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  project: Project | null;
  isProjectDone: boolean;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [projectName, setProjectName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');

  const handleSave = () => {
    if (!project?.uuid) return;
    dispatch(
      patchProject({
        uuid: project.uuid,
        payload: {
          name: projectName,
          description: description,
        },
      })
    );
    onOpenChange({ open: false });
  };

  const handleCancel = () => {
    onOpenChange({ open: false });
  };

  if (!project?.uuid) {
    return null;
  }

  return (
    <Portal>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>Edit Project Detail</Dialog.Header>
            <Dialog.CloseTrigger position="absolute" top="2" right="2" onClick={handleCancel} />
            <Dialog.Body>
              <ProjectDetailEditor
                name={projectName}
                setName={setProjectName}
                description={description}
                setDescription={setDescription}
              />
            </Dialog.Body>
            {!isProjectDone && (
              <Box
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundColor: '#DDDDDD55',
                }}
              >
                <Spinner size="xl" />
              </Box>
            )}
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button onClick={handleSave}>Save</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Portal>
  );
}

interface Props {
  toList: () => void;
}

export default function ProjectDescription({ toList }: Props) {
  const project: Project | null = useCurrentProject();
  const [open, setOpen] = useState(false);
  const isProjectDone = useCurrentProjectDone();

  return (
    <Box className="ProjectDescription">
      <MdChevronLeft
        className="svg-button"
        onClick={() => toList()}
        style={{ cursor: 'pointer' }}
      />
      {project?.uuid && (
        <>
          <span>{project.name}</span>
          <IconButton
            // @ts-expect-error: A custom variant
            onClick={setOpen}
            size="md"
            title={`Edit name`}
            // @ts-expect-error: A custom variant
            variant={'base'}
          >
            <MdModeEdit />
          </IconButton>
        </>
      )}
      {!project?.uuid && <span>Create new project</span>}

      <ProjectNameEditor
        open={open}
        onOpenChange={({ open }) => setOpen(open)}
        project={project}
        isProjectDone={isProjectDone}
      />
    </Box>
  );
}
