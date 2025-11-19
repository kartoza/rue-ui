import { useEffect, useRef, useState } from 'react';
import Map from '../../components/Map/Map.tsx';
import MapTaskNavigation from '../../components/MapTaskNavigation/MapTaskNavigation';
import MapInputControls from '../../components/MapInputControls/MapInputControls.tsx';
import MapFinanceSection from '../../components/MapFinanceSection/MapFinanceSection';
import { useCurrentDefinition } from '../../redux/selectors/definitionSelector.ts';
import { useCurrentTask } from '../../redux/selectors/taskSelector.ts';

import './style.scss';

function MapPage() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [mapHeight, setMapHeight] = useState<string>('calc(100vh - 60px)'); // Default fallback

  const currentDefinition = useCurrentDefinition();
  const currentTask = useCurrentTask();

  useEffect(() => {
    const updateMapHeight = () => {
      if (navbarRef.current) {
        const navbarHeight = navbarRef.current.offsetHeight;
        setMapHeight(`calc(100vh - ${navbarHeight}px)`);
      }
    };

    // Initial calculation
    updateMapHeight();

    // Recalculate on window resize
    window.addEventListener('resize', updateMapHeight);

    return () => {
      window.removeEventListener('resize', updateMapHeight);
    };
  }, []);

  return (
    <div className="map-container-parent">
      <div className="map-left-sidebar">
        <MapInputControls />
      </div>

      <div className="map-container">
        <div className="map-container-navbar" ref={navbarRef}>
          <MapTaskNavigation />
        </div>
        <div className="map-wrapper" style={{ height: mapHeight }}>
          <Map currentDefinition={currentDefinition} currentTask={currentTask} />
        </div>
      </div>

      <div className="map-right-sidebar">
        <MapFinanceSection />
      </div>
    </div>
  );
}

export default MapPage;
