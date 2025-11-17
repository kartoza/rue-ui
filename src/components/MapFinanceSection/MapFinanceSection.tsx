import './style.scss';
import { Container } from 'react-bootstrap';
import ImpactChart from './ImpactChart';
import FinanceTable from './FinanceTable';
import type { FC } from 'react';

const MapFinanceSection: FC = () => {
  return (
    <Container fluid className="map-finance-section">
      <div className="map-finance-top-section">
        <FinanceTable />
      </div>
      <div className="map-finance-bottom-section">
        <ImpactChart />
      </div>
    </Container>
  );
};

export default MapFinanceSection;
