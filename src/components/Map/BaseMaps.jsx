import { useState, useEffect } from 'react';

import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';
import './style.scss';

export default function BaseMaps({ map }) {
  const basemaps = [
    {
      label: 'Light',
      value: 'https://api.maptiler.com/maps/bright/style.json?key=UX8NBCf53PxSRrfgezxL',
    },
    {
      label: 'Satellite',
      value: 'https://api.maptiler.com/maps/hybrid/style.json?key=UX8NBCf53PxSRrfgezxL',
    },
    {
      label: 'Dark',
      value: 'https://api.maptiler.com/maps/dataviz-dark/style.json?key=UX8NBCf53PxSRrfgezxL',
    },
  ];

  const [selectedBasemap, setSelectedBasemap] = useState(basemaps[0].value);

  // Set default basemap on initial mount
  useEffect(() => {
    if (map && map.setStyle) {
      map.setStyle(basemaps[0].value);
    }
  }, [map]);

  const handleChange = (e) => {
    const styleUrl = e.target.value;
    setSelectedBasemap(styleUrl);
    if (map && map.setStyle) {
      map.setStyle(styleUrl);
    }
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
        {basemaps.map((bm) => (
          <option key={bm.value} value={bm.value}>
            {bm.label}
          </option>
        ))}
      </select>
    </div>
  );
}
