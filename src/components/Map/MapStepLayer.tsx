/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import { useDispatch } from 'react-redux';
import * as THREE from 'three';
import { Vector3 } from 'three';
import turf from 'turf';
import type { FeatureCollection } from 'geojson';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  useCurrentProjectStep,
  useCurrentProjectUUID,
} from '../../redux/selectors/projectSelector';
import { useCurrentStep } from '../../redux/selectors/stepSelector.ts';
import { hasLayer, removeLayer, removeSource } from '../../utils/maplibre.tsx';
import { StepType } from '../../redux/reducers/stepSlice.ts';
import MapStepLayerEditor from './MapStepLayerEditor.tsx';
import { Box, Button, Spinner } from '@chakra-ui/react';
import { useCurrentStepUpdate } from '../../redux/selectors/stepUpdateSelector.ts';
import { updateStep } from '../../redux/reducers/stepUpdateSlice.ts';
import type { AppDispatch } from '../../redux/store.ts';
import { resetStepAfter } from '../../redux/reducers/projectSlice.ts';
import { toaster, ToasterType } from '../Toaster/toaster.ts';
import { getAuthHeaders } from '../../utils/api.ts';

import './style.scss';
import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';

const GL_DRAW_POLYGON: string = 'gl-draw-polygon-fill';
const GLTF_ID: string = '3d-model';
const GEOJSON_ID: string = 'task-layer';
const GEOJSON_ID_FILL: string = 'task-layer-fill';
const GEOJSON_ID_LINE: string = 'task-layer-line';

let globalCurrentStep: string = '';

export default function MapStepLayer({ map }: { map: Map | null }) {
  const dispatch = useDispatch<AppDispatch>();
  const currentStep = useCurrentStep();
  const currentStepState = useCurrentProjectStep(currentStep);
  const currentUUID = useCurrentProjectUUID();
  const currentStepUpdate = useCurrentStepUpdate();

  const [isInit, setIsInit] = useState<boolean>(true);
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const style = () => {
    switch (currentStep) {
      case StepType.site.toString(): {
        return {
          'fill-color': [
            'match',
            ['get', 'type'],
            'road_art',
            '#c28823',
            'road_sec',
            '#eba936',
            '#00FF00',
          ],
          'fill-outline-color': 'rgba(0, 0, 0, 1)',
        };
      }
    }

    return {
      'fill-color': 'rgba(0, 255, 0, 0.5)',
      'fill-outline-color': 'rgba(0, 0, 0, 1)',
    };
  };

  /** Set init when current UUID changes */
  useEffect(() => {
    setIsInit(true);
  }, [currentUUID]);

  /** Initiate the layer */
  const doInit = () => {
    if (!map) return;

    setGeojson(null);
    setIsUpdated(false);

    // Load files
    const geojsonUrl = currentStepState?.step?.file?.replace('gltf', 'geojson');
    const gltfUrl = currentStepState?.step?.file?.replace('geojson', 'gltf');
    if (geojsonUrl && gltfUrl) {
      const step = currentStep;
      globalCurrentStep = step;
      fetch(geojsonUrl, {
        headers: getAuthHeaders(),
      })
        .then((res) => res.json())
        .then((data: FeatureCollection) => {
          if (globalCurrentStep !== step) return;
          setGeojson(data);
        });
    }
  };

  /** When map or current step changes, load GeoJSON */
  useEffect(() => {
    doInit();
  }, [map, currentStepState]);

  /** Render geojson */
  useEffect(() => {
    if (!map) return;

    removeSource(map, GEOJSON_ID);
    if (geojson) {
      let before: string | undefined = undefined;
      if (hasLayer(map, GLTF_ID)) {
        before = GLTF_ID;
      }
      if (hasLayer(map, GL_DRAW_POLYGON)) {
        before = GL_DRAW_POLYGON;
      }

      if (isInit) {
        const bbox = turf.bbox(geojson);
        map.fitBounds(
          [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ],
          {
            padding: 50,
            duration: 1000,
          }
        );
      }

      map.addSource(GEOJSON_ID, {
        type: 'geojson',
        data: geojson,
      });
      map.addLayer(
        {
          id: GEOJSON_ID_FILL,
          type: 'fill',
          source: GEOJSON_ID,
          filter: ['in', ['geometry-type'], ['literal', ['Polygon', 'MultiPolygon']]],
          // @ts-expect-error: Custom style function
          paint: style(),
        },
        before
      );
      map.addLayer(
        {
          id: GEOJSON_ID_LINE,
          type: 'line',
          source: GEOJSON_ID,
          filter: ['in', ['geometry-type'], ['literal', ['LineString', 'MultiLineString']]],
          paint: {
            'line-color': '#000000',
            'line-width': 1,
          },
        },
        before
      );
    }
  }, [map, geojson]);

  /** Check current step update status */
  useEffect(() => {
    if (currentStepUpdate.lastRequest) {
      dispatch(resetStepAfter(currentStep));
      doInit();
    }
  }, [currentStepUpdate.lastRequest]);

  /** When current step update fails, show error toast */
  useEffect(() => {
    if (currentStepUpdate.error) {
      toaster.create({
        title: 'Failed',
        description: currentStepUpdate.error,
        type: ToasterType.error,
      });
    }
  }, [currentStepUpdate.error]);

  /** Add click handler to show feature properties */
  useEffect(() => {
    if (!map) return;

    /** Handle click on a feature */
    const handleClick = (e: maplibregl.MapMouseEvent) => {
      // Don't show popup when in editing mode
      if (isEditing) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: [GEOJSON_ID_FILL],
      });

      if (!features.length) return;

      const feature = features[0];
      const properties = feature.properties || {};

      // Create HTML content from properties
      const content = Object.entries(properties)
        .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
        .join('<br>');

      new maplibregl.Popup().setLngLat(e.lngLat).setHTML(content).addTo(map);
    };

    const handleMouseEnter = () => {
      // Don't change cursor when in editing mode
      if (isEditing) return;
      map.getCanvas().style.cursor = 'pointer';
    };

    const handleMouseLeave = () => {
      // Don't change cursor when in editing mode
      if (isEditing) return;
      map.getCanvas().style.cursor = '';
    };

    map.on('click', GEOJSON_ID_FILL, handleClick);
    map.on('mouseenter', GEOJSON_ID_FILL, handleMouseEnter);
    map.on('mouseleave', GEOJSON_ID_FILL, handleMouseLeave);

    return () => {
      map.off('click', GEOJSON_ID_FILL, handleClick);
      map.off('mouseenter', GEOJSON_ID_FILL, handleMouseEnter);
      map.off('mouseleave', GEOJSON_ID_FILL, handleMouseLeave);
    };
  }, [map, isEditing]);

  /** Render gltf */
  useEffect(() => {
    if (!map) return;
    if (!geojson) return;
    removeSource(map, GLTF_ID);
    removeLayer(map, GLTF_ID);
    if (geojson) {
      createGltf();
    }
  }, [map, geojson]);

  async function createGltf() {
    if ([StepType.site.toString(), StepType.streets.toString()].includes(currentStep.toString()))
      return;
    if (!map) return;
    if (!geojson) return;
    const modelUrl = currentStepState?.step?.file?.replace('geojson', 'gltf');
    if (!modelUrl) return;

    // Add GeoJSON source and layer for comparison
    const modelOrigin = (turf.centroid(geojson).geometry.coordinates as [number, number]) || [0, 0];
    const modelAltitude = 0;
    const modelAsMercator = maplibregl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);

    // Calculate GLTF centroid before adding to map
    let gltfCentroid: any = null;
    try {
      const gltfResponse = await fetch(modelUrl, {
        headers: getAuthHeaders(),
      });
      const gltfArrayBuffer = await gltfResponse.arrayBuffer();
      const loader = new GLTFLoader();
      const gltf = await new Promise<any>((resolve) => {
        loader.parse(gltfArrayBuffer, '', (result) => resolve(result));
      });
      // Calculate centroid from all mesh geometry
      const positions: any[] = [];
      gltf.scene.traverse((object: any) => {
        if (object.isMesh && object.geometry && object.geometry.attributes.position) {
          const pos = object.geometry.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            positions.push(new Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
          }
        }
      });
      if (positions.length > 0) {
        const sum = new Vector3(0, 0, 0);
        positions.forEach((v) => sum.add(v));
        gltfCentroid = sum.divideScalar(positions.length);
        console.log('GLTF centroid:', gltfCentroid);
      } else {
        console.log('No mesh positions found in GLTF.');
      }
    } catch (err) {
      console.log('Error calculating GLTF centroid:', err);
    }

    const modelTransform = {
      translateX: modelAsMercator.x,
      translateY: modelAsMercator.y,
      translateZ: modelAsMercator.z,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: modelAsMercator.meterInMercatorCoordinateUnits(),
    };

    const layer: any = {
      id: GLTF_ID,
      type: 'custom',
      renderingMode: '3d',
      onAdd(mapInstance: any, gl: any) {
        const camera = new THREE.Camera();
        const scene = new THREE.Scene();

        const light1 = new THREE.DirectionalLight(0xffffff);
        light1.position.set(0, -70, 100).normalize();
        scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff);
        light2.position.set(0, 70, 100).normalize();
        scene.add(light2);

        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf) => {
          // Align GLTF centroid with geojson centroid
          if (gltfCentroid) {
            // Shift GLTF model so its centroid is at origin (0,0,0)
            // The modelTransform already positions origin at the GeoJSON centroid
            gltf.scene.position.set(-gltfCentroid.x, -gltfCentroid.y, -gltfCentroid.z);
            console.log('Applied offset to GLTF:', {
              x: -gltfCentroid.x,
              y: -gltfCentroid.y,
              z: -gltfCentroid.z,
            });
          }
          scene.add(gltf.scene);
        });

        const renderer = new THREE.WebGLRenderer({
          canvas: mapInstance.getCanvas(),
          context: gl,
          antialias: true,
        });
        renderer.autoClear = false;

        (this as any).camera = camera;
        (this as any).scene = scene;
        (this as any).renderer = renderer;
        (this as any).map = mapInstance;
        (this as any).modelTransform = modelTransform;
      },
      render(_gl: any, args: any) {
        const camera = (this as any).camera;
        const scene = (this as any).scene;
        const renderer = (this as any).renderer;
        const mapInstance = (this as any).map;
        const transform = (this as any).modelTransform;

        const rotationX = new THREE.Matrix4().makeRotationX(transform.rotateX);
        const rotationY = new THREE.Matrix4().makeRotationY(transform.rotateY);
        const rotationZ = new THREE.Matrix4().makeRotationZ(transform.rotateZ);

        const m = new THREE.Matrix4().fromArray(args.defaultProjectionData.mainMatrix);
        const l = new THREE.Matrix4()
          .makeTranslation(transform.translateX, transform.translateY, transform.translateZ)
          .multiply(
            new THREE.Matrix4().makeScale(transform.scale, -transform.scale, transform.scale)
          )
          .multiply(rotationX)
          .multiply(rotationY)
          .multiply(rotationZ);

        camera.projectionMatrix = m.multiply(l);
        renderer.resetState();
        renderer.render(scene, camera);
        mapInstance.triggerRepaint();
      },
    };
    map.addLayer(layer);
  }

  // Apply the form
  const apply = () => {
    if (!currentUUID) return;
    if (!geojson) return;
    dispatch(
      updateStep({
        uuid: currentUUID,
        step: currentStep,
        geojson: geojson,
      })
    );
  };

  return (
    <Box position="absolute" top="10px" right="10px" zIndex={1} display="flex" gap="1rem">
      {isUpdated && !isEditing && (
        <Box bg="white" borderRadius="md" boxShadow="md" p={2} zIndex={1}>
          {/* @ts-expect-error: A custom variant */}
          <Button variant="primary" size="sm" onClick={apply} flex={1}>
            Apply {currentStepUpdate.loading && <Spinner />}
          </Button>
        </Box>
      )}
      <MapStepLayerEditor
        map={map}
        geojson={geojson}
        setGeojson={(geojson) => {
          setIsUpdated(true);
          setGeojson(geojson);
        }}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </Box>
  );
}
