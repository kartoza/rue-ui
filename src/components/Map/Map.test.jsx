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
    // Drawn feature layers (simplified for test)
    {
      id: 'gl-draw-polygon-fill',
      source: 'drawnFeatures',
      type: 'fill',
      filter: [],
      paint: {},
    },
    {
      id: 'gl-draw-polygon-stroke-active',
      source: 'drawnFeatures',
      type: 'line',
      filter: [],
      paint: {},
    },
    {
      id: 'gl-draw-line-yellow',
      source: 'drawnFeatures',
      type: 'line',
      filter: [],
      layout: {},
      paint: {},
    },
    {
      id: 'gl-draw-line-red',
      source: 'drawnFeatures',
      type: 'line',
      filter: [],
      layout: {},
      paint: {},
    },
    {
      id: 'gl-draw-line-label-0',
      source: 'drawnFeatures',
      type: 'symbol',
      filter: [],
      layout: {},
      paint: {},
    },
    {
      id: 'gl-draw-line-label-50',
      source: 'drawnFeatures',
      type: 'symbol',
      filter: [],
      layout: {},
      paint: {},
    },
    {
      id: 'gl-draw-line-label-100',
      source: 'drawnFeatures',
      type: 'symbol',
      filter: [],
      layout: {},
      paint: {},
    },
  ],
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
    },
    drawnFeatures: {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
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
const mockSetLayoutProperty = vi.fn();
let loadHandler = null;
const mockMap = {
  addControl: mockAddControl,
  addSource: mockAddSource,
  addLayer: mockAddLayer,
  getSource: mockGetSource,
  remove: vi.fn(),
  getContainer: vi.fn(),
  isStyleLoaded: vi.fn(() => true),
  setLayoutProperty: mockSetLayoutProperty,
  on: vi.fn((event, handler) => {
    if (event === 'load') {
      loadHandler = handler;
    }
  }),
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
          style: expect.objectContaining({
            version: 8,
            sources: expect.objectContaining({
              osm: expect.any(Object),
            }),
            layers: expect.arrayContaining([expect.objectContaining({ id: 'osm-background' })]),
            glyphs: '/static/fonts/{fontstack}/{range}.pbf',
            sprite: '',
          }),
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
        expect(mapCall.style.sources).toHaveProperty('osm');
        expect(mapCall.style.layers.some((l) => l.id === 'osm-background')).toBe(true);
      });
    });

    it('should add drawnFeatures source and drawn feature layers after map load', async () => {
      render(<MapLibre />);
      // Simulate map load event
      expect(typeof loadHandler).toBe('function');
      loadHandler();
      // drawnFeatures source should be added
      expect(mockAddSource).toHaveBeenCalledWith(
        'drawnFeatures',
        expect.objectContaining({ type: 'geojson' })
      );
      // All drawn feature layers should be added
      expect(mockAddLayer).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'gl-draw-polygon-fill' })
      );
      expect(mockAddLayer).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'gl-draw-polygon-stroke-active' })
      );
      expect(mockAddLayer).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'gl-draw-line-yellow' })
      );
      expect(mockAddLayer).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'gl-draw-line-red' })
      );
      expect(mockAddLayer).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'gl-draw-line-label-0' })
      );
      expect(mockAddLayer).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'gl-draw-line-label-50' })
      );
      expect(mockAddLayer).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'gl-draw-line-label-100' })
      );
    });
  });
});
