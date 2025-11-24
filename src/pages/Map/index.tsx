import { useEffect, useRef, useState } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store.ts';
import Map from '../../components/Map';
import MapTabNavigation from '../../components/MapTabNavigation';
import MapInputControls from '../../components/MapInputControls';
import MapFinanceSection from '../../components/MapFinanceSection';
import { useCurrentDefinition } from '../../redux/selectors/definitionSelector';
import { useCurrentStep } from '../../redux/selectors/stepSelector';
import { useCurrentRightSideOpened } from '../../redux/selectors/globalSelector.ts';
import { toggleRightSide } from '../../redux/reducers/global.ts';

import './style.scss';

export default function MapPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navbarRef = useRef<HTMLDivElement>(null);
  const isOpened = useCurrentRightSideOpened();
  const [mapHeight, setMapHeight] = useState<string>('calc(100vh - 60px)'); // Default fallback

  const currentDefinition = useCurrentDefinition();
  const currentStep = useCurrentStep();

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
          <MapTabNavigation />
        </div>
        <div className="map-wrapper" style={{ height: mapHeight }}>
          <Map currentDefinition={currentDefinition} currentStep={currentStep} />
        </div>
      </div>

      <div className={'map-right-sidebar ' + (isOpened ? 'open' : 'close')}>
        <MdChevronLeft
          className="left-toggle svg-button"
          onClick={() => dispatch(toggleRightSide())}
          style={{ cursor: 'pointer' }}
        />
        <MapFinanceSection />
      </div>
    </div>
  );
}
