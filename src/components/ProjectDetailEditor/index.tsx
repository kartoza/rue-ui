import { Box } from '@chakra-ui/react';
import './style.scss';

interface Props {
  name: string;
  description: string;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
}

export function ProjectDetailEditor({ name, setName, description, setDescription }: Props) {
  return (
    <Box className="project-info-inputs">
      <Box className="input-field">
        <label htmlFor="project-name">Project Name</label>
        <input
          id="project-name"
          type="text"
          className="form-control"
          placeholder="Enter project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Box>
      <Box className="input-field">
        <label htmlFor="project-description">Description</label>
        <textarea
          id="project-description"
          className="form-control"
          placeholder="Enter project description"
          rows={3}
          value={description || ''}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Box>
    </Box>
  );
}
