import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import CityScaleProforma from './FinanceTables/CityScaleProforma';
import DemographicForecast from './FinanceTables/DemographicForecast';
import DwellingsProformaAffordability from './FinanceTables/DwellingsProformaAffordability';
import OffgridClustersProforma from './FinanceTables/OffgridClustersProforma';
import NeighborhoodScaleProforma from './FinanceTables/NeighborhoodScaleProforma';
import StarterBuildingsProforma from './FinanceTables/StarterBuildingsProforma';
import './style.scss';

function FinanceTable() {
  const [selectedOption, setSelectedOption] = useState('CityScaleProforma');

  const renderSelectedTable = () => {
    switch (selectedOption) {
      case 'CityScaleProforma':
        return <CityScaleProforma />;
      case 'NeighborhoodScaleProforma':
        return <NeighborhoodScaleProforma />;
      case 'OffgridClustersProforma':
        return <OffgridClustersProforma />;
      case 'StarterBuildingsProforma':
        return <StarterBuildingsProforma />;
      case 'DwellingsProformaAffordability':
        return <DwellingsProformaAffordability />;
      case 'DemographicForecast':
        return <DemographicForecast />;
      default:
        return <CityScaleProforma />;
    }
  };

  return (
    <Container fluid>
      <br></br>
      <select
        className="form-control"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <option value="CityScaleProforma">City scale Proforma</option>
        <option value="NeighborhoodScaleProforma">Neighborhood scale Proforma</option>
        <option value="OffgridClustersProforma">Off-grid Clusters Proforma</option>
        <option value="StarterBuildingsProforma">Starter Buildings Proforma</option>
        <option value="DwellingsProformaAffordability">Dwellings Proforma & Affordability</option>
        <option value="DemographicForecast">Demographic forecast</option>
      </select>
      <br></br>

      {renderSelectedTable()}
    </Container>
  );
}

export default FinanceTable;
