import { Map } from 'maplibre-gl';

interface OSMNode {
  lat: number;
  lon: number;
}

interface OSMWay {
  type: string;
  id: number;
  tags?: Record<string, string>;
  geometry?: OSMNode[];
}

interface OSMResponse {
  elements: OSMWay[];
}

/**
 * Fetch roads from OSM
 * @param map
 */
export const fetchRoads = async (map: Map): Promise<string> => {
  // Get current map bounds
  const bounds = map.getBounds();
  const bbox = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()].join(',');

  // Construct Overpass QL query for primary and secondary roads only
  const query = `
    [out:json];
    (
      way["highway"="primary"](${bbox});
      way["highway"="primary_link"](${bbox});
      way["highway"="secondary"](${bbox});
      way["highway"="secondary_link"](${bbox});
    );
    out geom;
  `;

  // Fetch from Overpass API
  const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(overpassUrl);
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const osmData: OSMResponse = await response.json();

    // Convert OSM data to GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: osmData.elements
        .filter((element: OSMWay) => element.type === 'way' && element.geometry)
        .map((way: OSMWay) => ({
          type: 'Feature',
          id: way.id,
          properties: {
            ...way.tags,
            osmId: way.id,
            osmType: way.type,
          },
          geometry: {
            type: 'LineString',
            coordinates: way.geometry!.map((node: OSMNode) => [node.lon, node.lat]),
          },
        })),
    };

    return JSON.stringify(geojson);
  } catch (error) {
    console.error('Error fetching roads from OSM:', error);
    throw error;
  }
};
