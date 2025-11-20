import type { FC } from 'react';

import ImpactChart from './ImpactChart';
import FinanceTable from './FinanceTable';

import './style.scss';

const MapFinanceSection: FC = () => {
  return (
    <div className="map-finance-section">
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
