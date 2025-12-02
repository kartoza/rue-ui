import { Map } from 'maplibre-gl';
import { useDispatch } from 'react-redux';
import { Box } from '@chakra-ui/react';
import ExtractRoads from '../ExtractRoads.tsx';
import type { AppDispatch } from '../../../redux/store.ts';
import { updateRoads } from '../../../redux/reducers/projectInputSlice.ts';

interface Props {
  map: Map | null;
}

export default function DrawYourOwn({ map }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  if (!map) return null;
  return (
    <Box marginTop="1rem">
      <ExtractRoads
        map={map}
        setRoads={(roads) => {
          dispatch(updateRoads(roads));
        }}
      />
    </Box>
  );
}
