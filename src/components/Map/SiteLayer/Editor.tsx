import { useEffect, useRef, useState } from 'react';
import type { Map as MaplibreMap } from 'maplibre-gl';
import { Box, HStack, IconButton } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { MdTimeline } from 'react-icons/md';
import type { FeatureCollection, LineString, Polygon } from 'geojson';

import type { AppDispatch } from '../../../redux/store.ts';
import { useCurrentDrawMode } from '../../../redux/selectors/globalSelector.ts';
import { DrawingMode } from '../../../redux/reducers/global.ts';
import MapEditor, { type MapLayerEditorRef } from '../MapEditor.tsx';
import { updateRoads, updateSite } from '../../../redux/reducers/projectInputSlice.ts';
import { useCurrentProjectInput } from '../../../redux/selectors/projectInputSelector.ts';

import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';

export const DrawMode = {
  polygon: 'polygon',
  road_art_0: 'road_art_0',
  road_art_50: 'road_art_50',
  road_art_100: 'road_art_100',
  road_sec_0: 'road_sec_0',
  road_sec_50: 'road_sec_50',
  road_sec_100: 'road_sec_100',
} as const;

export type DrawMode = (typeof DrawMode)[keyof typeof DrawMode];

export default function SiteEditor({
  map,
  geojson,
}: {
  map: MaplibreMap | null;
  geojson: FeatureCollection | null;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const editorRef = useRef<MapLayerEditorRef | null>(null);
  const [mode, setMode] = useState<DrawMode | null>(null);
  const roads = useCurrentProjectInput().roads;

  const isDrawSite = useCurrentDrawMode() == DrawingMode.DRAW_SITE;

  /** Update editor when roads updated */
  useEffect(() => {
    if (JSON.stringify(roads) === JSON.stringify(getRoads())) return;

    const drawRef = editorRef.current?.getDrawRef();
    if (!drawRef?.current) return;

    const drawControl = drawRef.current;

    // Get all current features
    const allFeatures = drawControl.getAll();

    // Remove all existing road features (LineStrings)
    const roadFeatures = allFeatures.features.filter((f) => f.geometry.type === 'LineString');
    roadFeatures.forEach((feature) => {
      if (feature.id) {
        drawControl.delete(feature.id as string);
      }
    });

    // Add new road features from Redux state
    if (roads?.features) {
      roads.features.forEach((feature) => {
        drawControl.add(feature);
      });
    }
  }, [roads]);

  /** Log properties when a feature is clicked */
  useEffect(() => {
    if (!map) return;

    const onSelectionChange = (e: { features: GeoJSON.Feature[] }) => {
      if (e.features && e.features.length > 0) {
        console.log('Selected feature properties:', e.features[0].properties);
      }
    };

    map.on('draw.selectionchange', onSelectionChange);

    return () => {
      map.off('draw.selectionchange', onSelectionChange);
    };
  }, [map]);

  const getRoads = (): FeatureCollection<LineString> | null => {
    const drawRef = editorRef.current?.getDrawRef();
    if (!drawRef?.current) return null;

    const drawControl = drawRef.current;

    const allFeatures = drawControl.getAll();

    const roadsFeatures = allFeatures.features.filter((f) => f.geometry.type === 'LineString');
    return roadsFeatures.length > 0
      ? {
          type: 'FeatureCollection',
          // @ts-expect-error: This is correct
          features: roadsFeatures,
        }
      : null;
  };

  const onFeaturesChanged = () => {
    const drawRef = editorRef.current?.getDrawRef();
    if (!drawRef?.current) return;

    const drawControl = drawRef.current;

    const allFeatures = drawControl.getAll();
    const siteFeatures = allFeatures.features.filter((f) => f.geometry.type === 'Polygon');
    // @ts-expect-error: This is correct
    const site: FeatureCollection<Polygon> | null =
      siteFeatures.length > 0
        ? {
            type: 'FeatureCollection',
            features: siteFeatures,
          }
        : null;
    dispatch(updateSite(site));
    dispatch(updateRoads(getRoads()));
  };

  const startDrawPolygon = () => {
    const drawRef = editorRef.current?.getDrawRef();
    if (!drawRef?.current) return;

    const drawControl = drawRef.current;
    const isNewMode = mode !== DrawMode.polygon;

    if (isNewMode) {
      drawControl.changeMode('draw_polygon');

      const onDrawCreate = () => {
        map?.off('draw.create', onDrawCreate);

        requestAnimationFrame(() => {
          setMode(null);
          drawControl.changeMode('simple_select');
          onFeaturesChanged();
        });
      };

      map?.on('draw.create', onDrawCreate);
      setMode(DrawMode.polygon);
    } else {
      setMode(null);
      drawControl.changeMode('simple_select');
    }
  };

  const startDrawRoad = (road_type: string, road_pcent: number) => {
    const drawRef = editorRef.current?.getDrawRef();
    if (!drawRef?.current || !map) return;

    const drawControl = drawRef.current;
    const key = `${road_type}_${road_pcent}`;
    const newMode = DrawMode[key];
    const isNewMode = mode !== newMode;

    if (isNewMode) {
      drawControl.changeMode('draw_line_string');

      const onDrawCreate = (e: { features: GeoJSON.Feature[] }) => {
        map.off('draw.create', onDrawCreate);

        if (e.features?.length > 0) {
          const feature = e.features[0];
          const featureId = feature.id as string;

          // Delete the feature and add it back with properties
          drawControl.delete(featureId);

          // Add properties to the feature
          const updatedFeature = {
            ...feature,
            properties: {
              ...feature.properties,
              road_type: road_type,
              road_pcent: road_pcent,
            },
          };

          drawControl.add(updatedFeature);
        }

        requestAnimationFrame(() => {
          setMode(null);
          drawControl.changeMode('simple_select');
          onFeaturesChanged();
        });
      };

      map.on('draw.create', onDrawCreate);
      setMode(newMode);
    } else {
      drawControl.changeMode('simple_select');
      setMode(null);
    }
  };

  if (!isDrawSite) {
    return null;
  }
  if (!map) {
    return null;
  }

  return (
    <>
      <HStack className="editor-stack" borderRadius="md" boxShadow="md">
        <IconButton
          onClick={startDrawPolygon}
          size="md"
          padding={1}
          title={`Draw site`}
          // @ts-expect-error: A custom variant
          variant={'base'}
        >
          <Box
            width="100%"
            height="100%"
            bg={mode === DrawMode.polygon ? '#fbb03b' : 'rgba(153, 153, 34, 0.3)'}
            border="1px solid"
            borderColor={mode === DrawMode.polygon ? '#fbb03b' : 'rgb(235,201,199)'}
          />
        </IconButton>

        {/* --- Road Artery polyline buttons --- */}
        {[0, 50, 100].map((n) => {
          const key = `road_art_${n}`;
          const active = mode === DrawMode[key];
          return (
            <IconButton
              key={key}
              onClick={() => startDrawRoad('road_art', n)}
              size="md"
              bg={active ? '#FF6666 !important' : 'white'}
              color={active ? 'white' : '#FF6666'}
              border="1px solid"
              borderColor={active ? '#FF6666' : 'gray.300'}
              padding={2}
              title={`Draw road artery at ${n}%`}
            >
              {n}
              <MdTimeline />
            </IconButton>
          );
        })}

        {/* --- Road secondary polyline buttons --- */}
        {[0, 50, 100].map((n) => {
          const key = `road_sec_${n}`;
          const active = mode === DrawMode[key];
          return (
            <IconButton
              key={key}
              onClick={() => startDrawRoad('road_sec', n)}
              size="md"
              bg={active ? '#FFB24D !important' : 'white'}
              color={active ? 'white' : '#FFB24D'}
              border="1px solid"
              borderColor={active ? '#FFB24D' : 'gray.300'}
              padding={2}
              title={`Draw road secondary at ${n}%`}
            >
              {n}
              <MdTimeline />
            </IconButton>
          );
        })}
        <MapEditor
          map={map}
          defaultGeojson={geojson}
          enabled={isDrawSite}
          activeByDefault={true}
          onFeaturesChanged={onFeaturesChanged}
          hideDelete={false}
          ref={editorRef}
        />
      </HStack>
    </>
  );
}
