export const sources = {
  osm: {
    type: 'raster',
    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    tileSize: 256,
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
];
