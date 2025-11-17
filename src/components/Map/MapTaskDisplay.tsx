import { useEffect } from 'react';
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import { Vector3, Camera, Scene, WebGLRenderer, DirectionalLight, Matrix4, Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as turf from '@turf/turf';
import type { FeatureCollection, Feature, Geometry } from 'geojson';
import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';
import './style.scss';

export default function MapTaskDisplay({
  map,
  currentTask,
}: {
  map: MapLibreMap | null;
  currentTask: string;
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
    switch (currentTask) {
      case 'Site':
        break;
      case 'Streets':
        createCustomLayerFromGeoJSON(street_model, street_geojson);
        break;
      case 'Cluster':
        createCustomLayerFromGeoJSON(cluster_model, cluster_geojson);
        break;
      case 'Public':
        createCustomLayerFromGeoJSON(public_model, public_geojson);
        break;
      case 'Subdivision':
        createCustomLayerFromGeoJSON(subdivision_model, subdivision_geojson);
        break;
      case 'Footprint':
        createCustomLayerFromGeoJSON(footprint_model, footprint_geojson);
        break;
      case 'Starter buildings':
        createCustomLayerFromGeoJSON(building_start_model, building_start_geojson);
        break;
      case 'Consolidated buildings':
        createCustomLayerFromGeoJSON(building_max_model, building_max_geojson);
        break;
    }
  }, [map, currentTask]);

  async function createCustomLayerFromGeoJSON(modelUrl: string, geojsonUrl: string): Promise<void> {
    if (!map) return;

    const response = await fetch(geojsonUrl);
    const geojson: FeatureCollection = await response.json();

    let modelOrigin: [number, number] = [148.9819, -35.39847];

    // Use turf to get the centroid of all features
    function hasCoordinates(geom: Geometry): geom is Geometry & { coordinates: number[] } {
      return geom.type === 'Point' || geom.type === 'LineString' || geom.type === 'Polygon';
    }
    if (geojson.features && geojson.features.length > 0) {
      // If only one feature, use its centroid
      if (geojson.features.length === 1) {
        const centroid: Feature<Geometry> = turf.centroid(geojson.features[0]);
        if (centroid && centroid.geometry && hasCoordinates(centroid.geometry)) {
          modelOrigin = [centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]];
        }
      } else {
        // If multiple features, create a feature collection and get centroid
        const centroid: Feature<Geometry> = turf.centroid(geojson);
        if (centroid && centroid.geometry && hasCoordinates(centroid.geometry)) {
          modelOrigin = [centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]];
        }
      }
    }

    map.flyTo({
      center: modelOrigin,
      zoom: 18,
      pitch: 60,
      bearing: 0,
      essential: true,
    });

    // Add GeoJSON source and layer for comparison
    if (map.getLayer('geojson-comparison')) {
      map.removeLayer('geojson-comparison');
    }
    if (map.getSource('geojson-comparison')) {
      map.removeSource('geojson-comparison');
    }
    map.addSource('geojson-comparison', {
      type: 'geojson',
      data: geojson,
    });
    // Style lines and polygons distinctly
    map.addLayer({
      id: 'geojson-comparison',
      type: geojson.features[0]?.geometry?.type === 'Point' ? 'circle' : 'line',
      source: 'geojson-comparison',
      paint:
        geojson.features[0]?.geometry?.type === 'Point'
          ? {
              'circle-radius': 8,
              'circle-color': '#ff0000',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff',
            }
          : {
              'line-color': '#ff0000',
              'line-width': 4,
            },
    } as maplibregl.LayerSpecification);

    const modelAsMercator = maplibregl.MercatorCoordinate.fromLngLat(modelOrigin, 0);

    // Calculate GLTF centroid before adding to map
    let gltfCentroid = null;
    try {
      const gltfResponse = await fetch(modelUrl);
      const gltfArrayBuffer = await gltfResponse.arrayBuffer();
      const loader = new GLTFLoader();
      const gltf = await new Promise((resolve) => {
        loader.parse(gltfArrayBuffer, '', (result) => resolve(result));
      });

      // Calculate centroid from all mesh geometry
      const positions: Vector3Type[] = [];
      gltf.scene.traverse((object) => {
        if (object instanceof Mesh && object.geometry && object.geometry.attributes.position) {
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

    const layer = {
      id: '3d-model',
      type: 'custom' as const,
      renderingMode: '3d',
      onAdd(mapInstance, gl) {
        this.camera = new Camera();
        this.scene = new Scene();

        const light1 = new DirectionalLight(0xffffff);
        light1.position.set(0, -70, 100).normalize();
        this.scene.add(light1);

        const light2 = new DirectionalLight(0xffffff);
        light2.position.set(0, 70, 100).normalize();
        this.scene.add(light2);

        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf) => {
          if (gltfCentroid && modelOrigin) {
            const geojsonMerc = maplibregl.MercatorCoordinate.fromLngLat(modelOrigin, 0);
            gltf.scene.position.set(
              geojsonMerc.x - gltfCentroid.x,
              geojsonMerc.y - gltfCentroid.y,
              geojsonMerc.z - gltfCentroid.z
            );
          }
          this.scene.add(gltf.scene);
        });

        this.renderer = new WebGLRenderer({
          canvas: mapInstance.getCanvas(),
          context: gl,
          antialias: true,
        });
        this.renderer.autoClear = false;

        this.map = mapInstance;
        this.modelTransform = modelTransform;
      },
      render(_gl, args) {
        const camera = this.camera;
        const scene = this.scene;
        const renderer = this.renderer;
        const mapInstance = this.map;
        const transform = this.modelTransform;

        const rotationX = new Matrix4().makeRotationX(transform.rotateX);
        const rotationY = new Matrix4().makeRotationY(transform.rotateY);
        const rotationZ = new Matrix4().makeRotationZ(transform.rotateZ);

        const m = new Matrix4().fromArray(args.defaultProjectionData.mainMatrix);
        const l = new Matrix4()
          .makeTranslation(transform.translateX, transform.translateY, transform.translateZ)
          .multiply(new Matrix4().makeScale(transform.scale, -transform.scale, transform.scale))
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
