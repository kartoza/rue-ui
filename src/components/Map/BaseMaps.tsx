import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Map, type StyleSpecification } from 'maplibre-gl';
import { removeSource } from '../../utils/maplibre.tsx';

import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';
import './style.scss';

// Import VITE_MAPBOX_TOKEN from environment
const MAPBOX_TOKEN: string = import.meta.env.VITE_MAPBOX_TOKEN;

interface BaseMapsProps {
  map?: Map | null;
}

interface BasemapOption {
  label: string;
  value: StyleSpecification;
}

const BaseMaps: FC<BaseMapsProps> = ({ map }) => {
  const basemaps: BasemapOption[] = useMemo(
    () => [
      {
        label: 'Light',
        value: {
          version: 8,
          sources: {
            basemap: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
            },
          },
          layers: [
            {
              id: 'basemap',
              type: 'raster',
              source: 'basemap',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        } as StyleSpecification,
      },
      {
        label: 'Satellite',
        value: {
          version: 8,
          sources: {
            basemap: {
              type: 'raster',
              tiles: [
                `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg?access_token=${MAPBOX_TOKEN}`,
              ],
              tileSize: 256,
              attribution: '© Mapbox',
            },
          },
          layers: [
            {
              id: 'basemap',
              type: 'raster',
              source: 'basemap',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        } as StyleSpecification,
      },
      {
        label: 'Dark',
        value: {
          version: 8,
          sources: {
            basemap: {
              type: 'raster',
              tiles: [
                'https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
                'https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
                'https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
                'https://d.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
            },
          },
          layers: [
            {
              id: 'basemap',
              type: 'raster',
              source: 'basemap',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        } as StyleSpecification,
      },
    ],
    []
  );

  const [selectedBasemap, setSelectedBasemap] = useState<number>(0);

  // Set default basemap on initial mount
  useEffect(() => {
    if (!map) return;

    const applyBasemap = () => {
      const style = basemaps[selectedBasemap].value;

      // Add basemap sources
      if (style.sources) {
        Object.entries(style.sources).forEach(([id, source]) => {
          removeSource(map, id);
          map.addSource(id, source);
        });
      }

      // Add basemap layers at the bottom
      const firstLayerId = map.getStyle().layers?.[0]?.id;
      if (style.layers) {
        style.layers.forEach((layer) => {
          map.addLayer(layer, firstLayerId);
        });
      }
    };

    // Check if style is already loaded
    if (map.isStyleLoaded()) {
      applyBasemap();
    } else {
      // Wait for style to load
      const onStyleLoad = () => {
        applyBasemap();
      };

      map.once('style.load', onStyleLoad);

      return () => {
        map.off('style.load', onStyleLoad);
      };
    }
  }, [map, selectedBasemap, basemaps]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value, 10);
    setSelectedBasemap(index);
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        background: 'white',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        padding: '8px',
        zIndex: 1,
        minWidth: '150px',
      }}
    >
      <select
        value={selectedBasemap}
        onChange={handleChange}
        style={{ width: '100%', padding: '4px' }}
      >
        {basemaps.map((bm, index) => (
          <option key={index} value={index}>
            {bm.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BaseMaps;
