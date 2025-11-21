import maplibregl from 'maplibre-gl';

/** Return if layer exist or not */
export const hasLayer = (map: maplibregl.Map, id: string): boolean => {
  if (!map) {
    return false;
  }
  return typeof map.getLayer(id) !== 'undefined';
};

/** Remove layer if layer exist or not */
export const removeLayer = (map: maplibregl.Map, id: string) => {
  if (hasLayer(map, id)) {
    map.removeLayer(id);
  }
};

/**  Return if source exist or not */
export const hasSource = (map: maplibregl.Map, id: string): boolean => {
  return typeof map.getSource(id) !== 'undefined';
};

/** Remove source if source exist or not */
export const removeSource = (map: maplibregl.Map, id: string) => {
  const style = map.getStyle();
  const layers = style?.layers ?? [];
  layers
    .filter((layer) => 'source' in layer && layer.source === id)
    .forEach((layer) => {
      removeLayer(map, layer.id);
    });

  const src = map.getSource(id);
  if (src) {
    map.removeSource(id);
  }
};
