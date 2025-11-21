import { useCurrentProject } from '../../../redux/selectors/projectSelector.ts';

export default function NeighbourhoodPublicScapeAmenities() {
  const currentProject = useCurrentProject();
  const value = currentProject?.steps?.subdivision?.step?.result.amen_total_area || 0;

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
