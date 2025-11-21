import { type FC, useState } from 'react';
import { MdChevronLeft } from 'react-icons/md';

import ImpactChart from './ImpactChart';
import FinanceTable from './FinanceTable';
import LuckySheet from '../LuckySheet';

import './style.scss';

const MapFinanceSection: FC = () => {
  const [showLuckySheet, setShowLuckySheet] = useState<boolean>(false);
  return (
    <div className="map-finance-section">
      <MdChevronLeft
        className="full-screen"
        onClick={() => setShowLuckySheet(true)}
        style={{ cursor: 'pointer' }}
      />
      <LuckySheet open={showLuckySheet} setOpen={setShowLuckySheet} />
      <div className="map-finance-top-section">
        <FinanceTable />
      </div>
      <div className="map-finance-bottom-section">
        <ImpactChart />
      </div>
    </div>
  );
};

export default MapFinanceSection;
