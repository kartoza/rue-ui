import MaplibreDraw from 'maplibre-gl-draw';

export interface Vertex {
  coordinates: number[];
  coordPath: string;
  featureId: string;
}

export interface DraggedVertex extends Vertex {
  matchedVertices: Vertex[];
}

/**
 * Helper function to compare coordinates with a small buffer tolerance
 * @param coord1 First coordinate [lng, lat]
 * @param coord2 Second coordinate [lng, lat]
 * @param buffer Buffer distance in degrees (default: 0.000003, ~30cm)
 * @returns true if coordinates are within buffer distance
 */
export const coordsMatch = (
  coord1: number[],
  coord2: number[],
  buffer: number = 0.000003
): boolean => {
  const dx = Math.abs(coord1[0] - coord2[0]);
  const dy = Math.abs(coord1[1] - coord2[1]);
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= buffer;
};

/**
 * Find all vertices in features that match the given coordinates
 * @param drawRef MaplibreDraw instance
 * @param vertexCoords Coordinates to match [lng, lat]
 * @param vertexFeatureId Feature ID to exclude from search
 */
export const findMatchedVertices = (
  drawRef: MaplibreDraw | null,
  vertexCoords: number[],
  vertexFeatureId: number
): Vertex[] => {
  if (!drawRef) {
    return [];
  }

  const matchedVertices: Vertex[] = [];
  const allFeatures = drawRef.getAll();

  allFeatures.features.forEach((feature) => {
    if (!feature.id) return;

    // Skip the current feature if excludeFeatureId is provided
    if (feature.id.toString() === vertexFeatureId.toString()) {
      return;
    }

    if (feature.geometry.type === 'LineString') {
      // Check all coordinates in the line
      feature.geometry.coordinates.forEach((coord, coordIndex) => {
        if (coordsMatch(coord, vertexCoords)) {
          matchedVertices.push({
            coordinates: coord,
            coordPath: `${coordIndex}`,
            featureId: feature.id!.toString(),
          });
        }
      });
    } else if (feature.geometry.type === 'MultiLineString') {
      // Check all coordinates in each line of the MultiLineString
      feature.geometry.coordinates.forEach((line, lineIndex) => {
        line.forEach((coord, coordIndex) => {
          if (coordsMatch(coord, vertexCoords)) {
            matchedVertices.push({
              coordinates: coord,
              coordPath: `${lineIndex}.${coordIndex}`,
              featureId: feature.id!.toString(),
            });
          }
        });
      });
    } else if (feature.geometry.type === 'Polygon') {
      // Check all coordinates in each ring of the Polygon
      feature.geometry.coordinates.forEach((ring, ringIndex) => {
        ring.forEach((coord, coordIndex) => {
          if (coordsMatch(coord, vertexCoords)) {
            matchedVertices.push({
              coordinates: coord,
              coordPath: `${ringIndex}.${coordIndex}`,
              featureId: feature.id!.toString(),
            });
          }
        });
      });
    }
  });

  return matchedVertices;
};

/**
 * Get coordinates from a feature based on the coord path
 * @param feature The GeoJSON feature
 * @param coordPath Path to the coordinate (e.g., "0" for LineString, "0.1" for Polygon)
 * @returns The coordinates at the specified path, or null if not found
 */
export const getCoordinatesFromPath = (
  feature: GeoJSON.Feature,
  coordPath: string
): number[] | null => {
  const pathParts = coordPath.split('.');

  if (feature.geometry.type === 'LineString') {
    const coordIndex = parseInt(pathParts[0]);
    return feature.geometry.coordinates[coordIndex];
  } else if (feature.geometry.type === 'MultiLineString') {
    const lineIndex = parseInt(pathParts[0]);
    const coordIndex = parseInt(pathParts[1]);
    return feature.geometry.coordinates[lineIndex][coordIndex];
  } else if (feature.geometry.type === 'Polygon') {
    const ringIndex = parseInt(pathParts[0]);
    const coordIndex = parseInt(pathParts[1]);
    return feature.geometry.coordinates[ringIndex][coordIndex];
  }

  return null;
};

/**
 * Update coordinates in a feature based on the coord path
 * @param feature The GeoJSON feature to update
 * @param coordPath Path to the coordinate (e.g., "0" for LineString, "0.1" for Polygon)
 * @param newCoords New coordinates to set
 * @returns true if update was successful, false otherwise
 */
export const updateCoordinatesAtPath = (
  feature: GeoJSON.Feature,
  coordPath: string,
  newCoords: number[]
): boolean => {
  const pathParts = coordPath.split('.');

  if (feature.geometry.type === 'LineString') {
    const coordIndex = parseInt(pathParts[0]);
    feature.geometry.coordinates[coordIndex] = [...newCoords];
    return true;
  } else if (feature.geometry.type === 'MultiLineString') {
    const lineIndex = parseInt(pathParts[0]);
    const coordIndex = parseInt(pathParts[1]);
    feature.geometry.coordinates[lineIndex][coordIndex] = [...newCoords];
    return true;
  } else if (feature.geometry.type === 'Polygon') {
    const ringIndex = parseInt(pathParts[0]);
    const coordIndex = parseInt(pathParts[1]);
    feature.geometry.coordinates[ringIndex][coordIndex] = [...newCoords];
    return true;
  }

  return false;
};
