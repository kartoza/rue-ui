import { useState } from 'react';
import type { FeatureCollection, GeoJsonObject, LineString, Polygon } from 'geojson';

interface Props {
  setRoads: (input: FeatureCollection<LineString> | null) => void;
  setSite: (input: FeatureCollection<Polygon> | null) => void;
}

export default function LoadSite({ setRoads, setSite }: Props) {
  const [roadsError, setRoadsError] = useState<string | null>(null);
  const [siteError, setSiteError] = useState<string | null>(null);

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

  const handleRoadsFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setRoadsError(null);
    setRoads(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!validateGeoJSON(data, 'LineString')) {
          setRoadsError('Invalid GeoJSON: Must be a FeatureCollection with LineString features');
          return;
        }

        setRoads(data as FeatureCollection<LineString>);
      } catch {
        setRoadsError('Failed to parse JSON file. Please ensure it is a valid JSON file.');
      }
    };

    reader.onerror = () => {
      setRoadsError('Failed to read file');
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px',
        marginLeft: '1rem',
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
          style={{ display: 'block' }}
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
      <div>
        <label
          htmlFor="roads-input"
          style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
          }}
        >
          Set roads
        </label>
        <input
          id="roads-input"
          type="file"
          accept=".geojson"
          onChange={handleRoadsFileChange}
          style={{ display: 'block' }}
        />
        {roadsError && (
          <div
            className="ErrorMessage"
            style={{
              marginTop: '4px',
            }}
          >
            {roadsError}
          </div>
        )}
      </div>
    </div>
  );
}
