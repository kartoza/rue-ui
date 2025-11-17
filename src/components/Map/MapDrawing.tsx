import { useEffect, useRef, useState } from 'react';
import type { GeoJSONSource, MapMouseEvent } from 'maplibre-gl';
import type { Feature, FeatureCollection, Position, Polygon, LineString } from 'geojson';
import MaplibreDraw from 'maplibre-gl-draw';
import type { Map as MaplibreMap } from 'maplibre-gl';
import { HStack, IconButton } from '@chakra-ui/react';
import { MdDelete, MdCropSquare, MdTimeline } from 'react-icons/md';
import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';
import './style.scss';

export default function MapDrawing({
  map,
  currentDefinition,
}: {
  map: MaplibreMap | null;
  currentDefinition: string;
}) {
  const drawRef = useRef<MaplibreDraw | null>(null);
  const drawFeaturesSource = useRef<GeoJSONSource | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [activePolylineButton, setActivePolylineButton] = useState<string | null>(null);
  const isRightClicking = useRef<boolean>(false);

  useEffect(() => {
    if (!map) return;

    let drawControl: MaplibreDraw;
    let handleKeyDown: (e: KeyboardEvent) => void;

    if (currentDefinition === 'draw_your_own') {
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
            paint: { 'fill-color': '#FFFF00', 'fill-opacity': 0.4 },
          },
          {
            id: 'gl-draw-polygon-stroke-active',
            type: 'line',
            filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
            paint: { 'line-color': '#FFFF00', 'line-width': 2 },
          },
          {
            id: 'gl-draw-line',
            type: 'line',
            filter: ['all', ['==', '$type', 'LineString']],
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': 'black', 'line-width': 4 },
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
            paint: { 'text-color': '#000000' },
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

      map.addControl(drawControl as unknown as maplibregl.IControl);
      drawRef.current = drawControl;
      drawFeaturesSource.current = map.getSource('drawnFeatures') as GeoJSONSource | null;

      const onSelectionChange = () => {
        const drawnSource = map.getSource('drawnFeatures') as GeoJSONSource | undefined;
        if (!drawnSource || typeof drawnSource.setData !== 'function') return;

        const existingData: FeatureCollection = (
          drawnSource as GeoJSONSource & { _data?: FeatureCollection }
        )._data || { type: 'FeatureCollection', features: [] };
        const selected = drawRef.current!.getSelected().features as Feature[];
        const all = drawRef.current!.getAll().features as Feature[];

        const toMoveBack = all.filter((f) => !selected.some((sf) => sf.id === f.id));
        if (toMoveBack.length > 0) {
          toMoveBack.forEach((f) => {
            existingData.features.push(f);
            if (f.id !== undefined) drawRef.current!.delete(f.id as string);
          });
          drawnSource.setData(existingData);
        }

        if (selected.length > 0) {
          selected.forEach((f) => {
            existingData.features = existingData.features.filter((x) => x.id !== f.id);
            drawnSource.setData(existingData);
            if (!all.some((x) => x.id === f.id) && f) {
              drawRef.current!.add(f);
            }
          });
        }

        if (selected.length === 0) {
          const all = drawRef.current!.getAll().features as Feature[];
          if (all.length > 0) {
            all.forEach((f) => {
              existingData.features.push(f);
              if (f.id !== undefined) drawRef.current!.delete(f.id as string);
            });
            drawnSource.setData(existingData);
          }
        }
      };

      map.on('draw.selectionchange', onSelectionChange);

      const onClick = (e: MapMouseEvent) => {
        const mode = drawRef.current?.getMode();
        if (mode === 'draw_polygon' || mode === 'draw_line_string') return;
        removeAllDrawFeatures();

        const drawnSource = map.getSource('drawnFeatures') as GeoJSONSource | undefined;
        const features: FeatureCollection = (
          drawnSource as GeoJSONSource & { _data?: FeatureCollection }
        )?._data || { type: 'FeatureCollection', features: [] };

        const point: Position = [e.lngLat.lng, e.lngLat.lat];
        let selectedFeature: Feature | null = null;

        for (const f of features.features) {
          if (f.geometry.type === 'Polygon') {
            const poly = (f.geometry as Polygon).coordinates[0] as Position[];
            if (isPointInPolygon(point, poly)) {
              selectedFeature = f;
              break;
            }
          }
          if (f.geometry.type === 'LineString') {
            const line = (f.geometry as LineString).coordinates as Position[];
            if (isPointNearLine(point, line, 0.2)) {
              selectedFeature = f;
              break;
            }
            for (let i = 0; i < line.length; i++) {
              if (pointToVertexDistance(point, line[i] as Position) < 0.2) {
                selectedFeature = f;
                break;
              }
            }
            if (selectedFeature) break;
          }
        }

        if (selectedFeature) {
          features.features = features.features.filter((x) => x.id !== selectedFeature!.id);
          drawnSource?.setData(features);
          drawRef.current!.add(selectedFeature);
          if (selectedFeature.id !== undefined) {
            drawRef.current!.changeMode('simple_select', { featureIds: [selectedFeature.id] });
          }
        }
      };

      map.on('click', onClick);

      const onContextMenu = (e: MapMouseEvent) => {
        isRightClicking.current = true;
        setTimeout(() => {
          const mode = drawRef.current?.getMode();
          if (mode === 'draw_polygon' || mode === 'draw_line_string') {
            isRightClicking.current = false;
            return;
          }

          e.preventDefault();

          const selected = drawRef.current!.getSelected();
          if (mode === 'direct_select') {
            if (selected.features.length > 0) {
              const id = selected.features[0].id;
              drawRef.current?.changeMode('direct_select', { featureId: id });
            } else {
              const drawnSource = map.getSource('drawnFeatures') as GeoJSONSource | undefined;
              const features: FeatureCollection = (
                drawnSource as GeoJSONSource & { _data?: FeatureCollection }
              )?._data || { type: 'FeatureCollection', features: [] };
              const all = drawRef.current!.getAll().features as Feature[];
              all.forEach((f) => {
                features.features.push(f);
                if (f.id !== undefined) drawRef.current!.delete(f.id as string);
              });
              drawnSource?.setData(features);
              drawRef.current!.changeMode('simple_select', { featureIds: [] });
            }
          } else {
            const drawnSource = map.getSource('drawnFeatures') as GeoJSONSource | undefined;
            const features: FeatureCollection = (
              drawnSource as GeoJSONSource & { _data?: FeatureCollection }
            )?._data || { type: 'FeatureCollection', features: [] };
            const point: Position = [e.lngLat.lng, e.lngLat.lat];
            let cf: Feature | null = null;

            for (const f of features.features) {
              if (f.geometry.type === 'Polygon') {
                if (isPointInPolygon(point, (f.geometry as Polygon).coordinates[0] as Position[])) {
                  cf = f;
                  break;
                }
              }
              if (f.geometry.type === 'LineString') {
                const line = (f.geometry as LineString).coordinates as Position[];
                if (isPointNearLine(point, line, 0.2)) {
                  cf = f;
                  break;
                }
                for (let i = 0; i < line.length; i++) {
                  if (pointToVertexDistance(point, line[i] as Position) < 0.2) {
                    cf = f;
                    break;
                  }
                }
                if (cf) break;
              }
            }

            if (cf) {
              features.features = features.features.filter((x) => x.id !== cf!.id);
              drawnSource?.setData(features);
              drawRef.current!.add(cf);
              if (cf.id !== undefined) {
                drawRef.current!.changeMode('direct_select', { featureId: cf.id });
              }
            }
          }

          isRightClicking.current = false;
        }, 0);
      };

      map.on('contextmenu', onContextMenu);

      handleKeyDown = (e: KeyboardEvent) => {
        const mode = drawRef.current?.getMode();
        if (mode === 'direct_select' && (e.key === 'Delete' || e.key === 'Backspace')) {
          const selected = drawRef.current!.getSelected();
          if (selected.features.length > 0) {
            const feature = selected.features[0];
            const selectedCoordPaths = drawRef.current!.getSelectedPoints();
            if (selectedCoordPaths.features.length > 0) {
              e.preventDefault();

              const coordPath = selectedCoordPaths?.features[0]?.properties?.coord_path as string;
              const pathParts = coordPath.split('.');
              const index = parseInt(pathParts[pathParts.length - 1]);

              if (feature.geometry.type === 'Polygon') {
                const coords = (feature.geometry as GeoJSON.Polygon).coordinates[0];
                if (coords.length > 4) {
                  coords.splice(index, 1);
                  coords[coords.length - 1] = coords[0];
                  (feature.geometry as GeoJSON.Polygon).coordinates[0] = coords;
                  drawRef.current!.add(feature);
                  drawRef.current!.changeMode('direct_select', { featureId: feature.id });
                }
              }

              if (feature.geometry.type === 'LineString') {
                const coords = (feature.geometry as GeoJSON.LineString).coordinates;
                if (coords.length > 2) {
                  coords.splice(index, 1);
                  (feature.geometry as GeoJSON.LineString).coordinates = coords;
                  drawRef.current!.add(feature);
                  drawRef.current!.changeMode('direct_select', { featureId: feature.id });
                }
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      const cleanup = () => {
        map.off('draw.selectionchange', onSelectionChange);
        map.off('click', onClick);
        map.off('contextmenu', onContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        map.removeControl(drawControl as unknown as maplibregl.IControl);
        drawRef.current = null;
      };
      (drawRef.current as MaplibreDraw & { cleanup?: () => void }).cleanup = cleanup;
    } else {
      try {
        map.setLayoutProperty('gl-draw-polygon-fill', 'visibility', 'none');
        map.setLayoutProperty('gl-draw-line-red', 'visibility', 'none');
        map.setLayoutProperty('gl-draw-polygon-stroke-active', 'visibility', 'none');
        map.setLayoutProperty('gl-draw-line-yellow', 'visibility', 'none');
        map.setLayoutProperty('gl-draw-line-label-0', 'visibility', 'none');
        map.setLayoutProperty('gl-draw-line-label-50', 'visibility', 'none');
        map.setLayoutProperty('gl-draw-line-label-100', 'visibility', 'none');

        if (
          drawRef.current &&
          'hasControl' in map &&
          typeof (map as MaplibreMap & { hasControl?: (control: maplibregl.IControl) => boolean })
            .hasControl === 'function' &&
          (
            map as MaplibreMap & { hasControl?: (control: maplibregl.IControl) => boolean }
          ).hasControl(drawRef.current as unknown as maplibregl.IControl)
        ) {
          map.removeControl(drawRef.current as unknown as maplibregl.IControl);
          const cleanupFn = (drawRef.current as MaplibreDraw & { cleanup?: () => void }).cleanup;
          if (typeof cleanupFn === 'function') cleanupFn();
          drawRef.current = null;
        }
      } catch (err) {
        console.log('Error hiding draw controls:', err);
      }
    }

    return () => {
      if (drawRef.current) {
        const cleanupFn = (drawRef.current as MaplibreDraw & { cleanup?: () => void }).cleanup;
        if (typeof cleanupFn === 'function') cleanupFn();
      }
    };
  }, [map, currentDefinition]);

  const isPointInPolygon = (point: Position, polygon: Position[]) => {
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
    const drawnSource = map?.getSource('drawnFeatures') as maplibregl.GeoJSONSource | undefined;
    const all = (drawRef.current?.getAll()?.features as GeoJSON.Feature[]) || [];
    const features: GeoJSON.FeatureCollection = (
      drawnSource as maplibregl.GeoJSONSource & { _data?: GeoJSON.FeatureCollection }
    )?._data || { type: 'FeatureCollection', features: [] };

    all.forEach((f) => {
      features.features.push(f);
      if (f.id !== undefined && typeof f.id === 'string') drawRef.current!.delete(f.id);
    });

    drawnSource?.setData(features);
  };

  const handleDrawPolygon = () => {
    if (!drawRef.current) return;

    const newMode = !isDrawingMode;
    const drawControl = drawRef.current!;

    removeAllDrawFeatures();

    if (newMode) {
      drawControl.changeMode('draw_polygon');

      const onDrawCreate = (e: { features: GeoJSON.Feature[] }) => {
        if (e.features?.length > 0) {
          const feature = e.features[0];
          if (feature.id !== undefined && typeof feature.id === 'string')
            drawControl.delete(feature.id);

          const drawnSource = map?.getSource('drawnFeatures') as
            | maplibregl.GeoJSONSource
            | undefined;
          if (drawnSource?.setData) {
            const existing: GeoJSON.FeatureCollection = (
              drawnSource as maplibregl.GeoJSONSource & { _data?: GeoJSON.FeatureCollection }
            )._data || { type: 'FeatureCollection', features: [] };
            existing.features.push(feature);
            drawnSource.setData(existing);
          }
        }

        map?.off('draw.create', onDrawCreate);
        requestAnimationFrame(() => {
          removeAllDrawFeatures();
          drawControl.changeMode('simple_select');
          drawControl.trash();
          setIsDrawingMode(false);
          setActivePolylineButton(null);
        });
      };

      map?.on('draw.create', onDrawCreate);
      setActivePolylineButton(null);
    } else {
      drawRef.current!.changeMode('simple_select');
    }

    setIsDrawingMode(newMode);
  };

  const handleDrawPolyline = (color: string, num: string) => {
    if (!drawRef.current || !map) return;

    const drawControl = drawRef.current!;
    const key = `${color}-${num}`;
    const newMode = activePolylineButton !== key;

    removeAllDrawFeatures();

    if (newMode) {
      drawControl.changeMode('draw_line_string');

      const onDrawCreate = (e: { features: GeoJSON.Feature[] }) => {
        if (e.features?.length > 0) {
          const f = e.features[0];
          f.properties = f.properties || {};
          f.properties.line_color = color;
          f.properties.line_number = String(num);

          if (f.id !== undefined && typeof f.id === 'string') drawControl.delete(f.id);

          const drawnSource = map.getSource('drawnFeatures') as
            | maplibregl.GeoJSONSource
            | undefined;
          if (drawnSource?.setData) {
            const existing: GeoJSON.FeatureCollection = (
              drawnSource as maplibregl.GeoJSONSource & { _data?: GeoJSON.FeatureCollection }
            )._data || { type: 'FeatureCollection', features: [] };
            existing.features.push(f);
            drawnSource.setData(existing);
          }
        }

        map.off('draw.create', onDrawCreate);
        requestAnimationFrame(() => {
          removeAllDrawFeatures();
          drawControl.changeMode('simple_select');
          drawControl.trash();
          setIsDrawingMode(false);
          setActivePolylineButton(null);
        });
      };

      map.on('draw.create', onDrawCreate);
      setActivePolylineButton(key);
    } else {
      drawControl.changeMode('simple_select');
      setActivePolylineButton(null);
    }
  };

  const handleDeleteSelected = () => {
    if (!drawRef.current) return;

    const sel = drawRef.current!.getSelected();
    (sel.features as Feature[]).forEach((f) => {
      if (f.id !== undefined && typeof f.id === 'string') drawRef.current!.delete(f.id);
    });

    setIsDrawingMode(false);
    setActivePolylineButton(null);
  };

  const isPointNearLine = (point: Position, line: Position[], tolerance = 0.2) => {
    for (let i = 0; i < line.length - 1; i++) {
      if (pointToSegmentDistance(point, line[i], line[i + 1]) < tolerance) return true;
    }
    return false;
  };

  const pointToVertexDistance = (p: Position, v: Position) => {
    const dx = p[0] - v[0];
    const dy = p[1] - v[1];
    return Math.sqrt(dx * dx + dy * dy);
  };

  function pointToSegmentDistance(p: Position, v: Position, w: Position) {
    const [lng, lat] = p;
    const [lng1, lat1] = v;
    const [lng2, lat2] = w;

    const A = lng - lng1;
    const B = lat - lat1;
    const C = lng2 - lng1;
    const D = lat2 - lat1;

    const dot = A * C + B * D;
    const len = C * C + D * D;

    const param = len !== 0 ? dot / len : -1;

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

    return Math.sqrt((lng - xx) ** 2 + (lat - yy) ** 2);
  }

  return (
    currentDefinition === 'draw_your_own' && (
      <HStack
        position="absolute"
        top="10px"
        right="10px"
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
        >
          <MdCropSquare />
        </IconButton>

        {/* --- RED polyline buttons --- */}
        {['0', '50', '100'].map((n) => (
          <IconButton
            key={`red-${n}`}
            onClick={() => handleDrawPolyline('red', n)}
            size="md"
            disabled={!map}
            bg={activePolylineButton === `red-${n}` ? '#cc362bff' : 'white'}
            color={activePolylineButton === `red-${n}` ? '#000' : '#cc362bff'}
            border="1px solid"
            borderColor={activePolylineButton === `red-${n}` ? '#cc362bff' : 'gray.300'}
            padding={2}
            aria-label="Draw polyline"
          >
            {n}
            <MdTimeline />
          </IconButton>
        ))}

        {/* --- YELLOW polyline buttons --- */}
        {['0', '50', '100'].map((n) => (
          <IconButton
            key={`yellow-${n}`}
            onClick={() => handleDrawPolyline('yellow', n)}
            size="md"
            disabled={!map}
            bg={activePolylineButton === `yellow-${n}` ? '#fdf3c0' : 'white'}
            color={activePolylineButton === `yellow-${n}` ? '#000' : '#cca12b'}
            border="1px solid"
            borderColor={activePolylineButton === `yellow-${n}` ? '#cca12b' : 'gray.300'}
            padding={2}
            aria-label="Draw polyline"
          >
            {n}
            <MdTimeline />
          </IconButton>
        ))}

        {/* DELETE button */}
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
