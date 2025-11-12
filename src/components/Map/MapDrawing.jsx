import { useEffect, useRef, useState } from 'react';
import MaplibreDraw from 'maplibre-gl-draw';
import { HStack, IconButton } from '@chakra-ui/react';
import { MdDelete, MdCropSquare, MdTimeline } from 'react-icons/md';

import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';
import './style.scss';

export default function MapDrawing({ map }) {
  const drawRef = useRef(null);
  const drawFeaturesSource = useRef(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isPolylineMode, setIsPolylineMode] = useState(false);

  useEffect(() => {
    if (!map || drawRef.current) return;

    //TO-DO
    // update interactions from drawControl layer to new layer

    // Initialize MaplibreDraw with custom styles
    const drawControl = new MaplibreDraw({
      displayControlsDefault: false,
      controls: {},
      styles: [
        // Polygon fill
        {
          id: 'gl-draw-polygon-fill',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          paint: {
            'fill-color': '#FFFF00',
            'fill-opacity': 0.4,
          },
        },
        // Polygon outline
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          paint: {
            'line-color': '#FFFF00',
            'line-width': 2,
          },
        },
        //line default
        {
          id: 'gl-draw-line',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': 'black',
            'line-width': 4,
          },
        },
        // Labels
        {
          id: 'gl-draw-line-label',
          type: 'symbol',
          filter: ['==', '$type', 'LineString'],
          layout: {
            'symbol-placement': 'line',
            'text-field': ['get', 'line_number'],
            'text-size': 14,
            'text-allow-overlap': true,
          },
          paint: {
            'text-color': '#000000',
          },
        },
        // Vertex points (polygon and line)
        {
          id: 'gl-draw-polygon-and-line-vertex-active',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 5,
            'circle-color': '#FFFF00',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFF',
          },
        },
        // Midpoints (for adding vertices)
        {
          id: 'gl-draw-polygon-and-line-midpoint',
          type: 'circle',
          filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
          paint: {
            'circle-radius': 6,
            'circle-color': '#00CCFF',
            'circle-opacity': 1,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFF',
          },
        },
      ],
    });

    map.addControl(drawControl);
    drawRef.current = drawControl;
    drawFeaturesSource.current = map.getSource('drawnFeatures');

    // Listen for feature selection changes
    map.on('draw.selectionchange', (e) => {
      const drawnSource = map.getSource('drawnFeatures');
      if (!drawnSource || typeof drawnSource.setData !== 'function') return;
      let existingData = drawnSource._data || { type: 'FeatureCollection', features: [] };
      // Features selected in drawRef
      const selectedFeatures = drawRef.current.getSelected().features;
      // Remove selected features from drawnFeatures source and add to drawRef
      if (selectedFeatures.length > 0) {
        selectedFeatures.forEach((feature) => {
          // Remove from drawnFeatures source
          existingData.features = existingData.features.filter((f) => f.id !== feature.id);
          drawnSource.setData(existingData);
          // Add to drawRef (already selected, so just ensure it's present)
          drawRef.current.add(feature);
        });
      }
      // If no features are selected, move all features from drawRef back to drawnFeatures source and delete from drawRef
      if (selectedFeatures.length === 0) {
        // Get all features in drawRef
        const allDrawFeatures = drawRef.current.getAll().features;
        if (allDrawFeatures.length > 0) {
          allDrawFeatures.forEach((feature) => {
            // Add back to drawnFeatures source
            existingData.features.push(feature);
            // Remove from drawRef
            drawRef.current.delete(feature.id);
          });
          drawnSource.setData(existingData);
        }
      }
    });

    // Automatically enable simple_select mode when a polygon is clicked
    map.on('click', (e) => {
      const mode = drawRef.current.getMode();
      if (mode === 'draw_polygon' || mode === 'draw_line_string') return;
      const drawnSource = map.getSource('drawnFeatures');
      let features = drawnSource?._data || { type: 'FeatureCollection', features: [] };
      const point = [e.lngLat.lng, e.lngLat.lat];
      let selectedFeature = null;
      if (features.features.length > 0) {
        for (const feature of features.features) {
          if (feature.geometry.type === 'Polygon') {
            const polygon = feature.geometry.coordinates[0];
            if (isPointInPolygon(point, polygon)) {
              selectedFeature = feature;
              break;
            }
          }
          if (feature.geometry.type === 'LineString') {
            const line = feature.geometry.coordinates;
            if (isPointNearLine(point, line, 0.2)) {
              selectedFeature = feature;
              break;
            } else {
              for (let i = 0; i < line.length; i++) {
                if (pointToVertexDistance(point, line[i]) < 0.2) {
                  selectedFeature = feature;
                  break;
                }
              }
              if (selectedFeature) break;
            }
          }
        }
      }
      if (selectedFeature) {
        // Remove from drawnFeatures source
        features.features = features.features.filter((f) => f.id !== selectedFeature.id);
        drawnSource.setData(features);
        // Add to drawRef and select
        drawRef.current.add(selectedFeature);
        drawRef.current.changeMode('simple_select', { featureIds: [selectedFeature.id] });
      } else {
        // Deselect: move all features from drawRef back to drawnFeatures source
        const allDrawFeatures = drawRef.current.getAll().features;
        if (allDrawFeatures.length > 0) {
          allDrawFeatures.forEach((feature) => {
            features.features.push(feature);
            drawRef.current.delete(feature.id);
          });
          drawnSource.setData(features);
        }
        drawRef.current.changeMode('simple_select', { featureIds: [] });
      }
    });

    // Right-click to enter direct_select mode for vertex editing (only if feature is selected)
    // or exit direct_select mode if already in edit mode
    map.on('contextmenu', (e) => {
      const mode = drawRef.current.getMode();
      if (mode === 'draw_polygon' || mode === 'draw_line_string') return;

      e.preventDefault(); // Prevent default context menu

      if (mode === 'direct_select') {
        // Exit edit mode and deselect the feature entirely
        // Move all features from drawRef back to drawnFeatures source
        const drawnSource = map.getSource('drawnFeatures');
        let features = drawnSource?._data || { type: 'FeatureCollection', features: [] };
        const allDrawFeatures = drawRef.current.getAll().features;
        if (allDrawFeatures.length > 0) {
          allDrawFeatures.forEach((feature) => {
            features.features.push(feature);
            drawRef.current.delete(feature.id);
          });
          drawnSource.setData(features);
        }
        drawRef.current.changeMode('simple_select', { featureIds: [] });
      } else {
        // First check if there's already a selected feature
        const selectedFeatures = drawRef.current.getSelected();

        if (selectedFeatures.features.length > 0) {
          // If a feature is already selected, enter edit mode for it
          const selectedFeatureId = selectedFeatures.features[0].id;
          drawRef.current.changeMode('direct_select', { featureId: selectedFeatureId });
        } else {
          // No feature selected, check if right-click is on a feature
          const drawnSource = map.getSource('drawnFeatures');
          let features = drawnSource?._data || { type: 'FeatureCollection', features: [] };
          const point = [e.lngLat.lng, e.lngLat.lat];
          let clickedFeature = null;

          if (features.features.length > 0) {
            for (const feature of features.features) {
              if (feature.geometry.type === 'Polygon') {
                const polygon = feature.geometry.coordinates[0];
                if (isPointInPolygon(point, polygon)) {
                  clickedFeature = feature;
                  break;
                }
              }
              if (feature.geometry.type === 'LineString') {
                const line = feature.geometry.coordinates;
                if (isPointNearLine(point, line, 0.2)) {
                  clickedFeature = feature;
                  break;
                } else {
                  for (let i = 0; i < line.length; i++) {
                    if (pointToVertexDistance(point, line[i]) < 0.2) {
                      clickedFeature = feature;
                      break;
                    }
                  }
                  if (clickedFeature) break;
                }
              }
            }
          }

          // Enter edit mode if a feature was clicked
          if (clickedFeature) {
            // Remove from drawnFeatures source
            features.features = features.features.filter((f) => f.id !== clickedFeature.id);
            drawnSource.setData(features);
            // Add to drawRef and select
            drawRef.current.add(clickedFeature);
            drawRef.current.changeMode('direct_select', { featureId: clickedFeature.id });
          }
        }
      }
    });

    // Handle keyboard events for vertex deletion
    const handleKeyDown = (e) => {
      const mode = drawRef.current.getMode();
      if (mode === 'direct_select' && (e.key === 'Delete' || e.key === 'Backspace')) {
        const selectedFeatures = drawRef.current.getSelected();
        if (selectedFeatures.features.length > 0) {
          const feature = selectedFeatures.features[0];
          const selectedCoordPaths = drawRef.current.getSelectedPoints();
          if (selectedCoordPaths.features.length > 0) {
            e.preventDefault();
            const coordPath = selectedCoordPaths.features[0].properties.coord_path;
            if (feature.geometry.type === 'Polygon') {
              const coords = feature.geometry.coordinates[0];
              if (coords.length > 4) {
                const pathParts = coordPath.split('.');
                const vertexIndex = parseInt(pathParts[pathParts.length - 1]);
                coords.splice(vertexIndex, 1);
                coords[coords.length - 1] = coords[0];
                feature.geometry.coordinates[0] = coords;
                drawRef.current.add(feature);
                drawRef.current.changeMode('direct_select', { featureId: feature.id });
              }
            } else if (feature.geometry.type === 'LineString') {
              const coords = feature.geometry.coordinates;
              if (coords.length > 2) {
                const pathParts = coordPath.split('.');
                const vertexIndex = parseInt(pathParts[pathParts.length - 1]);
                coords.splice(vertexIndex, 1);
                feature.geometry.coordinates = coords;
                drawRef.current.add(feature);
                drawRef.current.changeMode('direct_select', { featureId: feature.id });
              }
            }
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [map]);

  // Point-in-polygon helper
  const isPointInPolygon = (point, polygon) => {
    const x = point[0];
    const y = point[1];
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];
      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Draw polygon button
  const handleDrawPolygon = () => {
    if (drawRef.current) {
      const newMode = !isDrawingMode;
      const drawControl = drawRef.current;
      if (newMode) {
        drawControl.changeMode('draw_polygon');
        // Listen for the draw.create event
        const onDrawCreate = (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];

            // Remove the original feature and add the updated one
            drawControl.delete(feature.id);
            // Now set the data
            const drawnSource = map.getSource('drawnFeatures');
            if (drawnSource && typeof drawnSource.setData === 'function') {
              const existingData = drawnSource._data || { type: 'FeatureCollection', features: [] };
              existingData.features.push(feature);
              drawnSource.setData(existingData);
            } else {
              console.error('drawnFeatures source not found or setData not available');
            }
          }
          // Remove listener after one use
          map.off('draw.create', onDrawCreate);
        };

        map.on('draw.create', onDrawCreate);
        setIsPolylineMode(false);
      } else {
        drawRef.current.changeMode('simple_select');
      }
      setIsDrawingMode(newMode);
    }
  };

  // Draw polyline button
  const handleDrawPolyline = (color, num) => {
    if (!drawRef.current || !map) return;

    const drawControl = drawRef.current;
    const newMode = !isPolylineMode;

    if (newMode) {
      // Start drawing a line
      drawControl.changeMode('draw_line_string');

      // Listen for the draw.create event
      const onDrawCreate = (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          feature.properties = feature.properties || {};
          // Ensure line_color and line_number are only in properties
          delete feature.line_color;
          delete feature.line_number;
          feature.properties.line_color = color;
          feature.properties.line_number = String(num);

          // Remove the original feature and add the updated one
          drawControl.delete(feature.id);
          // Now set the data
          const drawnSource = map.getSource('drawnFeatures');
          if (drawnSource && typeof drawnSource.setData === 'function') {
            const existingData = drawnSource._data || { type: 'FeatureCollection', features: [] };
            existingData.features.push(feature);
            drawnSource.setData(existingData);
          } else {
            console.error('drawnFeatures source not found or setData not available');
          }
        }
        // Remove listener after one use
        map.off('draw.create', onDrawCreate);
      };

      map.on('draw.create', onDrawCreate);
    } else {
      // Stop drawing
      drawControl.changeMode('simple_select');
    }

    setIsPolylineMode(newMode);
  };

  // Delete selected features
  const handleDeleteSelected = () => {
    if (drawRef.current) {
      const selectedFeatures = drawRef.current.getSelected();
      if (selectedFeatures.features.length > 0) {
        selectedFeatures.features.forEach((feature) => {
          drawRef.current.delete(feature.id);
        });
      }
      setIsDrawingMode(false);
      setIsPolylineMode(false);
    }
  };

  // Helper: check if point is near a line segment (for line selection)
  const isPointNearLine = (point, line, tolerance = 0.2) => {
    // Simple check: if any segment is within tolerance distance
    for (let i = 0; i < line.length - 1; i++) {
      const dist = pointToSegmentDistance(point, line[i], line[i + 1]);
      if (dist < tolerance) return true;
    }
    return false;
  };

  // Helper: check if point is near a vertex
  const pointToVertexDistance = (p, v) => {
    const dx = p[0] - v[0];
    const dy = p[1] - v[1];
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Helper: distance from point to line segment
  function pointToSegmentDistance(p, v, w) {
    // p, v, w: [lng, lat]
    const lng = p[0],
      lat = p[1];
    const lng1 = v[0],
      lat1 = v[1];
    const lng2 = w[0],
      lat2 = w[1];
    const A = lng - lng1;
    const B = lat - lat1;
    const C = lng2 - lng1;
    const D = lat2 - lat1;
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;
    let xx, yy;
    if (param < 0) {
      xx = lng1;
      yy = lat1;
    } else if (param > 1) {
      xx = lng2;
      yy = lat2;
    } else {
      xx = lng1 + param * C;
      yy = lat1 + param * D;
    }
    const dx = lng - xx;
    const dy = lat - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  return (
    <HStack
      position="absolute"
      top="10px"
      right="10px"
      spacing={2}
      bg="white"
      borderRadius="md"
      boxShadow="md"
      p={2}
      zIndex={1}
    >
      <IconButton
        onClick={handleDrawPolygon}
        size="md"
        disabled={!map}
        bg="white"
        color="#cca12b"
        border="1px solid"
        borderColor="gray.300"
        padding={2}
        aria-label="Draw polygon"
        isActive={isDrawingMode}
      >
        <MdCropSquare />
      </IconButton>

      <IconButton
        onClick={() => handleDrawPolyline('red', '0')}
        size="md"
        disabled={!map}
        bg="white"
        color="red"
        border="1px solid"
        borderColor="gray.300"
        padding={2}
        aria-label="Draw polyline"
        isActive={isPolylineMode}
      >
        0<MdTimeline />
      </IconButton>

      <IconButton
        onClick={() => handleDrawPolyline('red', '50')}
        size="md"
        disabled={!map}
        bg="white"
        color="red"
        border="1px solid"
        borderColor="gray.300"
        padding={2}
        aria-label="Draw polyline"
        isActive={isPolylineMode}
      >
        50
        <MdTimeline />
      </IconButton>

      <IconButton
        onClick={() => handleDrawPolyline('red', '100')}
        size="md"
        disabled={!map}
        bg="white"
        color="red"
        border="1px solid"
        borderColor="gray.300"
        padding={2}
        aria-label="Draw polyline"
        isActive={isPolylineMode}
      >
        100
        <MdTimeline />
      </IconButton>

      <IconButton
        onClick={() => handleDrawPolyline('yellow', '0')}
        size="md"
        disabled={!map}
        bg="white"
        color="#cca12b"
        border="1px solid"
        borderColor="gray.300"
        padding={2}
        aria-label="Draw polyline"
        isActive={isPolylineMode}
      >
        0<MdTimeline />
      </IconButton>

      <IconButton
        onClick={() => handleDrawPolyline('yellow', '50')}
        size="md"
        disabled={!map}
        bg="white"
        color="#cca12b"
        border="1px solid"
        borderColor="gray.300"
        padding={2}
        aria-label="Draw polyline"
        isActive={isPolylineMode}
      >
        50
        <MdTimeline />
      </IconButton>

      <IconButton
        onClick={() => handleDrawPolyline('yellow', '100')}
        size="md"
        disabled={!map}
        bg="white"
        color="#cca12b"
        border="1px solid"
        borderColor="gray.300"
        padding={2}
        aria-label="Draw polyline"
        isActive={isPolylineMode}
      >
        100
        <MdTimeline />
      </IconButton>

      <IconButton
        aria-label="Delete selected features"
        onClick={handleDeleteSelected}
        size="md"
        disabled={!map}
        bg="white"
        color="black"
        border="1px solid"
        borderColor="gray.300"
        padding={2}
      >
        <MdDelete />
      </IconButton>
    </HStack>
  );
}
