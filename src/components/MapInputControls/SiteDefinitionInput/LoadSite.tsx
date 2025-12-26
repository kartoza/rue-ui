import { useState } from 'react';
import type { FeatureCollection, GeoJsonObject, LineString, Polygon } from 'geojson';
import { Map } from 'maplibre-gl';
import ExtractRoads from '../ExtractRoads.tsx';

interface Props {
  map: Map | null;
  setSite: (input: FeatureCollection<Polygon> | null) => void;
  setRoadArteries: (input: FeatureCollection<LineString> | null) => void;
  setRoadSecondaries: (input: FeatureCollection<LineString> | null) => void;
}

export default function LoadSite({ map, setSite, setRoadArteries, setRoadSecondaries }: Props) {
  const [siteError, setSiteError] = useState<string | null>(null);
  const [roadArteriesError, setRoadArteriesError] = useState<string | null>(null);
  const [roadSecondariesError, setRoadSecondariesError] = useState<string | null>(null);

  /** Download roads as GeoJSON file */
  const downloadRoadsAsGeoJSON = (roads: FeatureCollection<LineString>) => {
    const geojsonStr = JSON.stringify(roads, null, 2);
    const blob = new Blob([geojsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roads.geojson';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validateGeoJSON = (
    data: unknown,
    expectedGeometryType: 'LineString' | 'Polygon'
  ): boolean => {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const geoJson = data as GeoJsonObject;

    if (geoJson.type !== 'FeatureCollection') {
      return false;
    }

    const featureCollection = geoJson as FeatureCollection;

    if (!Array.isArray(featureCollection.features)) {
      return false;
    }

    if (featureCollection.features.length === 0) {
      return false;
    }

    return featureCollection.features.every(
      (feature) =>
        feature.type === 'Feature' &&
        feature.geometry &&
        feature.geometry.type === expectedGeometryType
    );
  };

  const handleRoadsFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setRoad: (errors: FeatureCollection<LineString> | null) => void,
    setRoadError: (errors: string | null) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setRoadError(null);
    setRoad(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!validateGeoJSON(data, 'LineString')) {
          setRoadError('Invalid GeoJSON: Must be a FeatureCollection with LineString features');
          return;
        }

        setRoad(data as FeatureCollection<LineString>);
      } catch {
        setRoadError('Failed to parse JSON file. Please ensure it is a valid JSON file.');
      }
    };

    reader.onerror = () => {
      setRoadError('Failed to read file');
    };

    reader.readAsText(file);
  };

  const handleSiteFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSiteError(null);
    setSite(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!validateGeoJSON(data, 'Polygon')) {
          setSiteError('Invalid GeoJSON: Must be a FeatureCollection with Polygon features');
          return;
        }

        setSite(data as FeatureCollection<Polygon>);
      } catch {
        setSiteError('Failed to parse JSON file. Please ensure it is a valid JSON file.');
      }
    };

    reader.onerror = () => {
      setSiteError('Failed to read file');
    };

    reader.readAsText(file);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
          marginTop: 8,
          marginBottom: 8,
        }}
      >
        <div>
          <label
            htmlFor="site-input"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
            }}
          >
            Load Site
          </label>
          <input
            id="site-input"
            type="file"
            accept=".geojson"
            onChange={handleSiteFileChange}
            style={{
              display: 'block',
              width: '100%',
            }}
          />
          {siteError && (
            <div
              className="ErrorMessage"
              style={{
                marginTop: '4px',
              }}
            >
              {siteError}
            </div>
          )}
        </div>

        {/* Road arteries */}
        <div>
          <label
            htmlFor="roads-input"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
            }}
          >
            Set road arteries
          </label>
          <input
            id="roads-input"
            type="file"
            accept=".geojson"
            onChange={(event) =>
              handleRoadsFileChange(event, setRoadArteries, setRoadArteriesError)
            }
            style={{
              display: 'block',
              width: '100%',
            }}
          />
          {roadArteriesError && (
            <div
              className="ErrorMessage"
              style={{
                marginTop: '4px',
              }}
            >
              {roadArteriesError}
            </div>
          )}
        </div>

        {/* Road decondaries */}
        <div>
          <label
            htmlFor="roads-input"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
            }}
          >
            Set road secondaries
          </label>
          <input
            id="roads-input"
            type="file"
            accept=".geojson"
            onChange={(event) =>
              handleRoadsFileChange(event, setRoadSecondaries, setRoadSecondariesError)
            }
            style={{
              display: 'block',
              width: '100%',
            }}
          />
          {roadSecondariesError && (
            <div
              className="ErrorMessage"
              style={{
                marginTop: '4px',
              }}
            >
              {roadSecondariesError}
            </div>
          )}
        </div>
      </div>
      <ExtractRoads
        map={map}
        setRoads={(roads) => {
          if (roads) {
            downloadRoadsAsGeoJSON(roads);
          }
        }}
      />
    </>
  );
}
