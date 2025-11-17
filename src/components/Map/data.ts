export const sources = {
  osm: {
    type: 'raster',
    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    tileSize: 256,
  },
  drawnFeatures: {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  },
};
export const layers = [
  {
    id: 'osm-background',
    type: 'raster',
    source: 'osm',
    minzoom: 0,
    maxzoom: 19,
  },
  // === Drawn Feature Styles ===

  // Polygon fill
  {
    id: 'gl-draw-polygon-fill',
    source: 'drawnFeatures',
    type: 'fill',
    filter: ['all', ['==', ['geometry-type'], 'Polygon']],
    paint: {
      'fill-color': '#FFFF00',
      'fill-opacity': 0.4,
    },
  },
  // Polygon outline
  {
    id: 'gl-draw-polygon-stroke-active',
    source: 'drawnFeatures',
    type: 'line',
    filter: ['all', ['==', ['geometry-type'], 'Polygon']],
    paint: {
      'line-color': '#FFFF00',
      'line-width': 2,
    },
  },

  // Yellow line
  {
    id: 'gl-draw-line-yellow',
    type: 'line',
    source: 'drawnFeatures',
    filter: [
      'all',
      ['==', ['geometry-type'], 'LineString'],
      ['==', ['get', 'line_color'], 'yellow'],
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': '#eed026ff',
      'line-width': 4,
    },
  },
  // Red line
  {
    id: 'gl-draw-line-red',
    type: 'line',
    source: 'drawnFeatures',
    filter: ['all', ['==', ['geometry-type'], 'LineString'], ['==', ['get', 'line_color'], 'red']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#FF0000',
      'line-width': 4,
    },
  },
  // Labels
  {
    id: 'gl-draw-line-label-0',
    type: 'symbol',
    source: 'drawnFeatures',
    filter: ['all', ['==', ['geometry-type'], 'LineString'], ['==', ['get', 'line_number'], '0']],
    layout: {
      'symbol-placement': 'line',
      'text-field': '0',
      'text-size': 14,
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': '#000000',
    },
  },
  {
    id: 'gl-draw-line-label-50',
    type: 'symbol',
    source: 'drawnFeatures',
    filter: ['all', ['==', ['geometry-type'], 'LineString'], ['==', ['get', 'line_number'], '50']],
    layout: {
      'symbol-placement': 'line',
      'text-field': '50',
      'text-size': 14,
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': '#000000',
    },
  },
  {
    id: 'gl-draw-line-label-100',
    type: 'symbol',
    source: 'drawnFeatures',
    filter: ['all', ['==', ['geometry-type'], 'LineString'], ['==', ['get', 'line_number'], '100']],
    layout: {
      'symbol-placement': 'line',
      'text-field': '100',
      'text-size': 14,
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': '#000000',
    },
  },
];
