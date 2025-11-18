import './style.scss';
import Map from '../../components/Map/Map';
import MapTaskNavigation from '../../components/MapTaskNavigation/MapTaskNavigation';
import MapInputControls from '../../components/MapInputControls/MapInputControls.jsx';
import MapFinanceSection from '../../components/MapFinanceSection/MapFinanceSection';
import { useEffect, useRef, useState } from 'react';
import { useCurrentDefinition } from '../../features/site_definition/definitionSelector';
import { useCurrentTask } from '../../features/task/taskSelector';

function MapPage() {
  const navbarRef = useRef(null);
  const [mapHeight, setMapHeight] = useState('calc(100vh - 60px)'); // Default fallback

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
