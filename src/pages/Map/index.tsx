import { useEffect, useRef, useState } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store.ts';
import Map from '../../components/Map';
import MapTabNavigation from '../../components/MapTabNavigation';
import MapInputControls from '../../components/MapInputControls';
import MapFinanceSection from '../../components/MapFinanceSection';
import { useCurrentRightSideOpened } from '../../redux/selectors/globalSelector.ts';
import { setDrawingMode, toggleRightSide } from '../../redux/reducers/global.ts';
import ProjectControl from '../../components/ProjectControl';
import ProjectDescription from '../../components/ProjectDescription';
import ProjectList from '../../components/ProjectList';
import { resetLuckySheet } from '../../redux/reducers/luckySheetSlice.ts';
import { resetProject } from '../../redux/reducers/projectSlice.ts';
import { Map as MapLibreMap } from 'maplibre-gl';

import './style.scss';
import ProjectVersionControl from '../../components/ProjectVersionControl';

export const SideBarTabs = {
  projectList: 'projectList',
  projectDetail: 'projectDetail',
} as const;

export type SideBarTabs = (typeof SideBarTabs)[keyof typeof SideBarTabs];
export default function MapPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navbarRef = useRef<HTMLDivElement>(null);
  const isOpened = useCurrentRightSideOpened();

  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [mapHeight, setMapHeight] = useState<string>('calc(100vh - 60px)'); // Default fallback

  const [sideBarTab, setSiteBarTab] = useState<SideBarTabs>(SideBarTabs.projectList);

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
      <ProjectControl />
      <ProjectVersionControl />
      <div className="map-left-sidebar">
        {sideBarTab === SideBarTabs.projectDetail && (
          <>
            <ProjectDescription
              toList={() => {
                dispatch(setDrawingMode(null));
                dispatch(resetLuckySheet());
                dispatch(resetProject());
                setSiteBarTab(SideBarTabs.projectList);
              }}
            />
            <MapInputControls map={map} />
          </>
        )}
        {sideBarTab === SideBarTabs.projectList && (
          <>
            <ProjectList
              toDetail={() => {
                setSiteBarTab(SideBarTabs.projectDetail);
              }}
            />
          </>
        )}
      </div>

      <div className="map-container">
        <div className="map-container-navbar" ref={navbarRef}>
          <MapTabNavigation />
        </div>
        <div className="map-wrapper" style={{ height: mapHeight }}>
          <Map map={map} setMap={setMap} />
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
