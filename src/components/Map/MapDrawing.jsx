import { useEffect, useRef, useState } from 'react';
import MaplibreDraw from 'maplibre-gl-draw';
import { HStack, IconButton } from '@chakra-ui/react';
import { MdDelete, MdCropSquare, MdTimeline } from 'react-icons/md';
import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';
import './style.scss';

export default function MapDrawing({ map, currentDefinition }) {
  const drawRef = useRef(null);
  const drawFeaturesSource = useRef(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  // activePolylineButton: null | 'red-0' | 'red-50' | 'red-100' | 'yellow-0' | 'yellow-50' | 'yellow-100'
  const [activePolylineButton, setActivePolylineButton] = useState(null);
  // Track if a right-click is in progress
  const isRightClicking = useRef(false);

  useEffect(() => {
    if (!map) return;

    let drawControl;
    let handleKeyDown;

    if (currentDefinition === 'draw_your_own') {
      // Initialize MaplibreDraw with custom styles
      map.setLayoutProperty('gl-draw-polygon-fill', 'visibility', 'visible');
      map.setLayoutProperty('gl-draw-line-red', 'visibility', 'visible');
      map.setLayoutProperty('gl-draw-polygon-stroke-active', 'visibility', 'visible');
      map.setLayoutProperty('gl-draw-line-yellow', 'visibility', 'visible');
      map.setLayoutProperty('gl-draw-line-label-0', 'visibility', 'visible');
      map.setLayoutProperty('gl-draw-line-label-50', 'visibility', 'visible');
      map.setLayoutProperty('gl-draw-line-label-100', 'visibility', 'visible');

      drawControl = new MaplibreDraw({
        displayControlsDefault: false,
        controls: {},
        styles: [
          {
            id: 'gl-draw-polygon-fill',
            type: 'fill',
            filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
            paint: {
              'fill-color': '#FFFF00',
              'fill-opacity': 0.4,
            },
          },
          {
            id: 'gl-draw-polygon-stroke-active',
            type: 'line',
            filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
            paint: {
              'line-color': '#FFFF00',
              'line-width': 2,
            },
          },
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

      // --- Event listeners ---
      const onSelectionChange = (e) => {
        const drawnSource = map.getSource('drawnFeatures');
        if (!drawnSource || typeof drawnSource.setData !== 'function') return;
        let existingData = drawnSource._data || { type: 'FeatureCollection', features: [] };
        const selectedFeatures = drawRef.current.getSelected().features;
        const allDrawFeatures = drawRef.current.getAll().features;
        const toMoveBack = allDrawFeatures.filter(
          (f) => !selectedFeatures.some((sf) => sf.id === f.id)
        );
        if (toMoveBack.length > 0) {
          toMoveBack.forEach((feature) => {
            existingData.features.push(feature);
            drawRef.current.delete(feature.id);
          });
          drawnSource.setData(existingData);
        }
        if (selectedFeatures.length > 0) {
          selectedFeatures.forEach((feature) => {
            existingData.features = existingData.features.filter((f) => f.id !== feature.id);
            drawnSource.setData(existingData);
            if (!allDrawFeatures.some((f) => f.id === feature.id)) {
              drawRef.current.add(feature);
            }
          });
        }
        if (selectedFeatures.length === 0) {
          const allDrawFeatures = drawRef.current.getAll().features;
          if (allDrawFeatures.length > 0) {
            allDrawFeatures.forEach((feature) => {
              existingData.features.push(feature);
              drawRef.current.delete(feature.id);
            });
            drawnSource.setData(existingData);
          }
        }
      };
      map.on('draw.selectionchange', onSelectionChange);

      const onClick = (e) => {
        const mode = drawRef.current.getMode();
        if (mode === 'draw_polygon' || mode === 'draw_line_string') return;
        removeAllDrawFeatures();
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
          features.features = features.features.filter((f) => f.id !== selectedFeature.id);
          drawnSource.setData(features);
          drawRef.current.add(selectedFeature);
          drawRef.current.changeMode('simple_select', { featureIds: [selectedFeature.id] });
        }
      };
      map.on('click', onClick);

      const onContextMenu = (e) => {
        isRightClicking.current = true;
        setTimeout(() => {
          const mode = drawRef.current.getMode();
          if (mode === 'draw_polygon' || mode === 'draw_line_string') {
            isRightClicking.current = false;
            return;
          }
          e.preventDefault();
          const selectedFeatures = drawRef.current.getSelected();
          if (mode === 'direct_select') {
            if (selectedFeatures.features.length > 0) {
              const selectedFeatureId = selectedFeatures.features[0].id;
              drawRef.current.changeMode('direct_select', { featureId: selectedFeatureId });
            } else {
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
            }
          } else {
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
            if (clickedFeature) {
              features.features = features.features.filter((f) => f.id !== clickedFeature.id);
              drawnSource.setData(features);
              drawRef.current.add(clickedFeature);
              drawRef.current.changeMode('direct_select', { featureId: clickedFeature.id });
            }
          }
          isRightClicking.current = false;
        }, 0);
      };
      map.on('contextmenu', onContextMenu);

      handleKeyDown = (e) => {
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

      // Store listeners for cleanup
      drawRef.current._cleanup = () => {
        map.off('draw.selectionchange', onSelectionChange);
        map.off('click', onClick);
        map.off('contextmenu', onContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        map.removeControl(drawControl);
        drawRef.current = null;
      };
    } else {
      // If not Site, remove draw control if present
      map.setLayoutProperty('gl-draw-polygon-fill', 'visibility', 'none');
      map.setLayoutProperty('gl-draw-line-red', 'visibility', 'none');
      map.setLayoutProperty('gl-draw-polygon-stroke-active', 'visibility', 'none');
      map.setLayoutProperty('gl-draw-line-yellow', 'visibility', 'none');
      map.setLayoutProperty('gl-draw-line-label-0', 'visibility', 'none');
      map.setLayoutProperty('gl-draw-line-label-50', 'visibility', 'none');
      map.setLayoutProperty('gl-draw-line-label-100', 'visibility', 'none');
      if (drawRef.current && map.hasControl && map.hasControl(drawRef.current)) {
        map.removeControl(drawRef.current);
        if (drawRef.current._cleanup) drawRef.current._cleanup();
        drawRef.current = null;
      }
    }

    // Cleanup on unmount or when currentDefinition changes
    return () => {
      if (drawRef.current && drawRef.current._cleanup) {
        drawRef.current._cleanup();
      }
    };
  }, [map, currentDefinition]);

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

  const removeAllDrawFeatures = () => {
    const drawnSource = map.getSource('drawnFeatures');
    const allDrawFeatures = drawRef.current.getAll().features;
    let features = drawnSource?._data || { type: 'FeatureCollection', features: [] };
    if (allDrawFeatures.length > 0) {
      allDrawFeatures.forEach((feature) => {
        features.features.push(feature);
        drawRef.current.delete(feature.id);
      });
      drawnSource.setData(features);
    }
  };

  // Draw polygon button
  const handleDrawPolygon = () => {
    if (drawRef.current) {
      const newMode = !isDrawingMode;
      const drawControl = drawRef.current;

      removeAllDrawFeatures();

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
          // drawControl.changeMode('simple_select');
          // Remove listener after one use
          map.off('draw.create', onDrawCreate);
          requestAnimationFrame(() => {
            removeAllDrawFeatures(); // move this here
            drawControl.changeMode('simple_select');
            drawControl.trash(); // optional, clears any remaining selection
            setIsDrawingMode(false);
            setActivePolylineButton(null);
          });
        };

        map.on('draw.create', onDrawCreate);
        setActivePolylineButton(null);
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
    const buttonKey = `${color}-${num}`;
    const newMode = activePolylineButton !== buttonKey;

    removeAllDrawFeatures();

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
        // Clean up and exit draw mode on next frame
        requestAnimationFrame(() => {
          removeAllDrawFeatures(); // move this here
          drawControl.changeMode('simple_select');
          drawControl.trash(); // optional, clears any remaining selection
          setIsDrawingMode(false);
          setActivePolylineButton(null);
        });
      };

      map.on('draw.create', onDrawCreate);
      setActivePolylineButton(buttonKey);
    } else {
      // Stop drawing
      drawControl.changeMode('simple_select');
      setActivePolylineButton(null);
    }
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
      setActivePolylineButton(null);
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
    currentDefinition === 'draw_your_own' && (
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
          bg={isDrawingMode ? '#fdf3c0' : 'white'}
          color={isDrawingMode ? '#000' : '#cca12b'}
          border="1px solid"
          borderColor={isDrawingMode ? '#cca12b' : 'gray.300'}
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
          bg={activePolylineButton === 'red-0' ? '#cc362bff' : 'white'}
          color={activePolylineButton === 'red-0' ? '#000' : '#cc362bff'}
          border="1px solid"
          borderColor={activePolylineButton === 'red-0' ? '#cc362bff' : 'gray.300'}
          padding={2}
          aria-label="Draw polyline"
          isActive={activePolylineButton === 'red-0'}
        >
          0<MdTimeline />
        </IconButton>

        <IconButton
          onClick={() => handleDrawPolyline('red', '50')}
          size="md"
          disabled={!map}
          bg={activePolylineButton === 'red-50' ? '#cc362bff' : 'white'}
          color={activePolylineButton === 'red-50' ? '#000' : '#cc362bff'}
          border="1px solid"
          borderColor={activePolylineButton === 'red-50' ? '#cc362bff' : 'gray.300'}
          padding={2}
          aria-label="Draw polyline"
          isActive={activePolylineButton === 'red-50'}
        >
          50
          <MdTimeline />
        </IconButton>

        <IconButton
          onClick={() => handleDrawPolyline('red', '100')}
          size="md"
          disabled={!map}
          bg={activePolylineButton === 'red-100' ? '#cc362bff' : 'white'}
          color={activePolylineButton === 'red-100' ? '#000' : '#cc362bff'}
          border="1px solid"
          borderColor={activePolylineButton === 'red-100' ? '#cc362bff' : 'gray.300'}
          padding={2}
          aria-label="Draw polyline"
          isActive={activePolylineButton === 'red-100'}
        >
          100
          <MdTimeline />
        </IconButton>

        <IconButton
          onClick={() => handleDrawPolyline('yellow', '0')}
          size="md"
          disabled={!map}
          bg={activePolylineButton === 'yellow-0' ? '#fdf3c0' : 'white'}
          color={activePolylineButton === 'yellow-0' ? '#000' : '#cca12b'}
          border="1px solid"
          borderColor={activePolylineButton === 'yellow-0' ? '#cca12b' : 'gray.300'}
          padding={2}
          aria-label="Draw polyline"
          isActive={activePolylineButton === 'yellow-0'}
        >
          0<MdTimeline />
        </IconButton>

        <IconButton
          onClick={() => handleDrawPolyline('yellow', '50')}
          size="md"
          disabled={!map}
          bg={activePolylineButton === 'yellow-50' ? '#fdf3c0' : 'white'}
          color={activePolylineButton === 'yellow-50' ? '#000' : '#cca12b'}
          border="1px solid"
          borderColor={activePolylineButton === 'yellow-50' ? '#cca12b' : 'gray.300'}
          padding={2}
          aria-label="Draw polyline"
          isActive={activePolylineButton === 'yellow-50'}
        >
          50
          <MdTimeline />
        </IconButton>

        <IconButton
          onClick={() => handleDrawPolyline('yellow', '100')}
          size="md"
          disabled={!map}
          bg={activePolylineButton === 'yellow-100' ? '#fdf3c0' : 'white'}
          color={activePolylineButton === 'yellow-100' ? '#000' : '#cca12b'}
          border="1px solid"
          borderColor={activePolylineButton === 'yellow-100' ? '#cca12b' : 'gray.300'}
          padding={2}
          aria-label="Draw polyline"
          isActive={activePolylineButton === 'yellow-100'}
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
    )
  );
}
