import { useCurrentProject } from '../../../redux/selectors/projectSelector.ts';

export default function NeighbourhoodPublicScapeOpenSpace() {
  const currentProject = useCurrentProject();
  const value = currentProject?.steps?.subdivision?.step?.result.open_total_area || 0;

  return (
    <label
      style={{
        marginTop: '3px',
      }}
    >
      {(value / 10000).toFixed(2)} ha
    </label>
  );
}
