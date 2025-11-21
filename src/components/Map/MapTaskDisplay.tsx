/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import * as THREE from 'three';
import { Vector3 } from 'three';
import turf from 'turf';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { StepType } from '../../redux/reducers/stepSlice.ts';
import {
  useCurrentProjectStep,
  useCurrentProjectUUID,
} from '../../redux/selectors/projectSelector';

import './style.scss';
import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';
import { removeLayer, removeSource } from '../../utilities/maplibre.tsx';

const GLTF_ID: string = '3d-model';
const GEOJSON_ID: string = 'geojson-comparison';
const GEOJSON_ID_POINT: string = 'geojson-comparison-point';
const GEOJSON_ID_LINE: string = 'geojson-comparison-line';

export default function MapTaskDisplay({
  map,
  currentStep,
}: {
  map: Map | null;
  currentStep: StepType;
}) {
  const currentStepState = useCurrentProjectStep(currentStep);
  const [isInit, setIsInit] = useState<boolean>(true);
  const currentUUID = useCurrentProjectUUID();

  /** Set init when current UUID changes */
  useEffect(() => {
    setIsInit(true);
  }, [currentUUID]);

  useEffect(() => {
    if (!map) return;

    removeSource(map, GLTF_ID);
    removeLayer(map, GLTF_ID);
    removeSource(map, GEOJSON_ID);

    // Load files
    const file = currentStepState?.step?.file;
    if (file) {
      createCustomLayerFromGeoJSON(file.replace('geojson', 'gltf'), file);
    }
  }, [map, currentStepState]);

  async function createCustomLayerFromGeoJSON(modelUrl: string, geojsonUrl: string) {
    if (!map) return;

    const response = await fetch(geojsonUrl);
    const geojson = await response.json();

    let modelOrigin: [number, number] = [148.9819, -35.39847];

    // Use turf to get the centroid of all features
    if (geojson.features && geojson.features.length > 0) {
      // If only one feature, use its centroid
      if (geojson.features.length === 1) {
        const centroid = turf.centroid(geojson.features[0]);
        if (centroid && centroid.geometry && centroid.geometry.coordinates) {
          modelOrigin = [centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]];
        }
      } else {
        // If multiple features, create a feature collection and get centroid
        const centroid = turf.centroid(geojson);
        if (centroid && centroid.geometry && centroid.geometry.coordinates) {
          modelOrigin = [centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]];
        }
      }
    }

    const modelAsMercator = maplibregl.MercatorCoordinate.fromLngLat(modelOrigin, 0);

    // Calculate GLTF centroid before adding to map
    let gltfCentroid: any = null;
    try {
      const gltfResponse = await fetch(modelUrl);
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
          if (gltfCentroid && modelOrigin) {
            // Convert geojson centroid to Mercator units
            const geojsonMerc = maplibregl.MercatorCoordinate.fromLngLat(modelOrigin, 0);
            // Calculate offset in Mercator units
            // gltfCentroid is in model's local coordinates, so we shift the scene
            gltf.scene.position.set(
              geojsonMerc.x - gltfCentroid.x,
              geojsonMerc.y - gltfCentroid.y,
              geojsonMerc.z - gltfCentroid.z
            );
            console.log('Applied offset to GLTF:', {
              x: geojsonMerc.x - gltfCentroid.x,
              y: geojsonMerc.y - gltfCentroid.y,
              z: geojsonMerc.z - gltfCentroid.z,
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

    // Zoom to the model
    if (isInit) {
      map.flyTo({
        center: modelOrigin as [number, number],
        zoom: 18,
        pitch: 60,
        bearing: 0,
        essential: true,
        speed: 2.5,
      });
    }
    setIsInit(false);

    // Add GeoJSON source and layer for comparison
    removeSource(map, GEOJSON_ID);

    map.addSource(GEOJSON_ID, {
      type: 'geojson',
      data: geojson,
    });
    map.addLayer(
      {
        id: GEOJSON_ID_POINT,
        type: 'circle',
        source: GEOJSON_ID,
        paint: {
          'circle-radius': 2,
          'circle-color': '#ff0000',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        },
      },
      GLTF_ID
    );

    map.addLayer(
      {
        id: GEOJSON_ID_LINE,
        type: 'line',
        source: GEOJSON_ID,
        paint: {
          'line-color': '#ff0000',
          'line-width': 2,
        },
      },
      GLTF_ID
    );
  }

  return <div></div>;
}
