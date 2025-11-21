/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import * as THREE from 'three';
import { Vector3 } from 'three';
import turf from 'turf';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { StepType } from '../../redux/reducers/stepSlice.ts';

import './style.scss';
import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';

export default function MapTaskDisplay({
  map,
  currentStep,
}: {
  map: Map | null;
  currentStep: StepType;
}) {
  useEffect(() => {
    if (!map) return;

    if (map.getLayer('3d-model')) {
      try {
        map.removeLayer('3d-model');
        map.removeLayer('geojson-comparison');
      } catch (e) {
        console.warn('Could not remove previous 3d-model layer:', e);
      }
    }

    if (map.getSource && map.getSource('3d-model')) {
      try {
        map.removeSource('3d-model');
      } catch (e) {
        console.warn('Could not remove previous 3d-model source:', e);
      }
    }

    const site_model = new URL(
      '../../dummy-data/input-output/00-site/outputs/site.gltf',
      import.meta.url
    ).href;
    const site_geojson = new URL(
      '../../dummy-data/input-output/00-site/outputs/site.geojson',
      import.meta.url
    ).href;
    const street_model = new URL(
      '../../dummy-data/input-output/01-streets/outputs/streets.gltf',
      import.meta.url
    ).href;
    const street_geojson = new URL(
      '../../dummy-data/input-output/01-streets/outputs/streets.geojson',
      import.meta.url
    ).href;

    const cluster_model = new URL(
      '../../dummy-data/input-output/02-clusters/outputs/cluster.gltf',
      import.meta.url
    ).href;
    const cluster_geojson = new URL(
      '../../dummy-data/input-output/02-clusters/outputs/cluster.geojson',
      import.meta.url
    ).href;

    const public_model = new URL(
      '../../dummy-data/input-output/03-public/outputs/public.gltf',
      import.meta.url
    ).href;
    const public_geojson = new URL(
      '../../dummy-data/input-output/03-public/outputs/public.geojson',
      import.meta.url
    ).href;

    const subdivision_model = new URL(
      '../../dummy-data/input-output/04-subdivision/outputs/subdivision.gltf',
      import.meta.url
    ).href;
    const subdivision_geojson = new URL(
      '../../dummy-data/input-output/04-subdivision/outputs/subdivision.geojson',
      import.meta.url
    ).href;

    const footprint_model = new URL(
      '../../dummy-data/input-output/05-footprint/outputs/footprint.gltf',
      import.meta.url
    ).href;
    const footprint_geojson = new URL(
      '../../dummy-data/input-output/05-footprint/outputs/footprint.geojson',
      import.meta.url
    ).href;

    const building_start_model = new URL(
      '../../dummy-data/input-output/06-building_start/outputs/building_start.gltf',
      import.meta.url
    ).href;
    const building_start_geojson = new URL(
      '../../dummy-data/input-output/06-building_start/outputs/building_start.geojson',
      import.meta.url
    ).href;

    const building_max_model = new URL(
      '../../dummy-data/input-output/07-building_max/outputs/building_max.gltf',
      import.meta.url
    ).href;
    const building_max_geojson = new URL(
      '../../dummy-data/input-output/07-building_max/outputs/building_max.geojson',
      import.meta.url
    ).href;

    // Pass rotation and altitude from state
    switch (currentStep) {
      case StepType.site:
        createCustomLayerFromGeoJSON(site_model, site_geojson);
        break;
      case StepType.streets:
        createCustomLayerFromGeoJSON(street_model, street_geojson);
        break;
      case StepType.clusters:
        createCustomLayerFromGeoJSON(cluster_model, cluster_geojson);
        break;
      case StepType.public:
        createCustomLayerFromGeoJSON(public_model, public_geojson);
        break;
      case StepType.subdivision:
        createCustomLayerFromGeoJSON(subdivision_model, subdivision_geojson);
        break;
      case StepType.footprint:
        createCustomLayerFromGeoJSON(footprint_model, footprint_geojson);
        break;
      case StepType.building_start:
        createCustomLayerFromGeoJSON(building_start_model, building_start_geojson);
        break;
      case StepType.building_max:
        createCustomLayerFromGeoJSON(building_max_model, building_max_geojson);
        break;
      default:
        break;
    }
  }, [map, currentStep]);

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

    map.flyTo({
      center: modelOrigin as [number, number],
      zoom: 18,
      pitch: 60,
      bearing: 0,
      essential: true,
    });

    // Add GeoJSON source and layer for comparison
    if (map.getLayer('geojson-comparison')) {
      try {
        map.removeLayer('geojson-comparison');
      } catch (e) {
        console.warn('Could not remove previous geojson-comparison layer:', e);
      }
    }
    if (map.getSource('geojson-comparison')) {
      try {
        map.removeSource('geojson-comparison');
      } catch (e) {
        console.warn('Could not remove previous geojson-comparison source:', e);
      }
    }
    map.addSource('geojson-comparison', {
      type: 'geojson',
      data: geojson,
    });
    // Style lines and polygons distinctly
    if (geojson.features[0]?.geometry?.type === 'Point') {
      map.addLayer({
        id: 'geojson-comparison',
        type: 'circle',
        source: 'geojson-comparison',
        paint: {
          'circle-radius': 8,
          'circle-color': '#ff0000',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        },
      });
    } else {
      map.addLayer({
        id: 'geojson-comparison',
        type: 'line',
        source: 'geojson-comparison',
        paint: {
          'line-color': '#ff0000',
          'line-width': 4,
        },
      });
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
      id: '3d-model',
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
  }

  return <div></div>;
}
