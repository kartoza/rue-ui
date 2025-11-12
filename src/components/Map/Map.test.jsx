import { waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MapLibre from './Map';
import maplibregl from 'maplibre-gl';
import { render } from '../../test/render';

// Mock the CSS imports
vi.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));
vi.mock('./style.scss', () => ({}));

// Mock the data imports
vi.mock('./data', () => ({
  layers: [
    {
      id: 'osm-background',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
    },
  },
}));

// Mock maplibre-gl
const mockAddSource = vi.fn();
const mockAddLayer = vi.fn();
const mockGetSource = vi.fn(() => ({
  setData: vi.fn(),
  _data: { type: 'FeatureCollection', features: [] },
}));
const mockAddControl = vi.fn();
const mockMap = {
  addControl: mockAddControl,
  addSource: mockAddSource,
  addLayer: mockAddLayer,
  getSource: mockGetSource,
  remove: vi.fn(),
  getContainer: vi.fn(),
  isStyleLoaded: vi.fn(() => true),
  on: vi.fn(),
  off: vi.fn(),
};

const mockNavigationControl = {
  onAdd: vi.fn(),
  onRemove: vi.fn(),
};

vi.mock('maplibre-gl', () => ({
  default: {
    Map: vi.fn(() => mockMap),
    NavigationControl: vi.fn(() => mockNavigationControl),
  },
  Map: vi.fn(() => mockMap),
  NavigationControl: vi.fn(() => mockNavigationControl),
}));

describe('MapLibre Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render a Box component with id "map"', () => {
      render(<MapLibre />);

      const mapContainer = document.getElementById('map');
      expect(mapContainer).toBeInTheDocument();
    });

    it('should render without crashing', () => {
      expect(() => {
        render(<MapLibre />);
      }).not.toThrow();
    });
  });

  describe('map initialization', () => {
    it('should create a new maplibre-gl Map instance on mount', async () => {
      render(<MapLibre />);

      await waitFor(() => {
        expect(maplibregl.Map).toHaveBeenCalledTimes(1);
      });
    });

    it('should initialize map with correct configuration', async () => {
      render(<MapLibre />);

      await waitFor(() => {
        expect(maplibregl.Map).toHaveBeenCalledWith({
          container: 'map',
          style: {
            version: 8,
            sources: {
              osm: {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
              },
            },
            layers: [
              {
                id: 'osm-background',
                type: 'raster',
                source: 'osm',
                minzoom: 0,
                maxzoom: 19,
              },
            ],
            glyphs: '/static/fonts/{fontstack}/{range}.pbf',
            sprite: '',
          },
          center: [0, 0],
          zoom: 1,
          attributionControl: false,
        });
      });
    });

    it('should add NavigationControl to the map', async () => {
      render(<MapLibre />);

      await waitFor(() => {
        expect(maplibregl.NavigationControl).toHaveBeenCalledTimes(1);
        expect(mockAddControl).toHaveBeenCalledWith(mockNavigationControl, 'bottom-left');
      });
    });
  });

  describe('component cleanup', () => {
    it('should handle component unmounting gracefully', () => {
      const { unmount } = render(<MapLibre />);

      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('accessibility', () => {
    it('should have proper container element for screen readers', () => {
      render(<MapLibre />);

      const mapContainer = document.getElementById('map');
      expect(mapContainer).toBeInTheDocument();
      expect(mapContainer).toHaveAttribute('id', 'map');
    });
  });

  describe('data integration', () => {
    it('should use imported sources and layers in map style', async () => {
      render(<MapLibre />);

      await waitFor(() => {
        const mapCall = maplibregl.Map.mock.calls[0][0];
        expect(mapCall.style.sources).toEqual({
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
          },
        });
        expect(mapCall.style.layers).toEqual([
          {
            id: 'osm-background',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
          },
        ]);
      });
    });
  });
});
