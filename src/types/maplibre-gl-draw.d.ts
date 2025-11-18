/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'maplibre-gl-draw' {
  import { Feature } from 'geojson';

  export default class MaplibreDraw {
    constructor(options?: any);
    changeMode(
      mode: 'simple_select' | 'direct_select' | 'draw_polygon' | 'draw_line_string',
      options?: any
    ): void;
    getSelected(): { features: Feature[] };
    getAll(): { features: Feature[] };
    getMode(): string;
    getSelectedPoints(): { features: Feature[] };
    add(feature: Feature): void;
    delete(id: string): void;
    trash(): void;
    // ...other methods as needed
  }
}
