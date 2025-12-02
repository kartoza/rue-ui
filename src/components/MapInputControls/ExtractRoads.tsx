import { Map } from 'maplibre-gl';
import { Button, Spinner } from '@chakra-ui/react';
import { useState } from 'react';
import { fetchRoads } from '../../utils/osm.tsx';
import type { FeatureCollection, LineString } from 'geojson';
import { Toaster } from '../Toaster/toaster.ts';

interface Props {
  map: Map | null;
  setRoads: (input: FeatureCollection<LineString> | null) => void;
}

export default function ExtractRoads({ map, setRoads }: Props) {
  const [requesting, setRequesting] = useState<boolean>(false);
  if (!map) return null;

  const request = async () => {
    setRequesting(true);
    try {
      const roads = await fetchRoads(map);
      roads.features.forEach((feature) => {
        if (!feature.properties) return;

        if (['primary', 'tertiary', 'trunk', 'motorway'].includes(feature.properties.highway)) {
          feature.properties.road_type = 'road_art';
        } else {
          feature.properties.road_type = 'road_sec';
        }
        feature.properties.road_pcent = 0;
      });
      setRoads(roads);
    } catch (e) {
      Toaster.error('Failed', `${e}`);
    }
    setRequesting(false);
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '2rem',
        marginRight: '1rem',
        gap: '8px',
      }}
    >
      <Button
        // @ts-expect-error: A custom variant
        variant="primary"
        disabled={requesting}
        onClick={request}
        style={{ cursor: requesting ? 'progress ' : 'pointer' }}
      >
        Extract roads {requesting && <Spinner size="sm" />}
      </Button>
      <span style={{ opacity: 0.5, fontSize: '0.9rem' }}>
        Extract roads from OSM from current view
      </span>
    </div>
  );
}
