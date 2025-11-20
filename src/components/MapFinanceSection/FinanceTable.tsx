import type { ChangeEvent } from 'react';
import { useState } from 'react';
import CityScaleProforma from './FinanceTables/CityScaleProforma';
import DemographicForecast from './FinanceTables/DemographicForecast';
import DwellingsProformaAffordability from './FinanceTables/DwellingsProformaAffordability';
import OffgridClustersProforma from './FinanceTables/OffgridClustersProforma';
import NeighborhoodScaleProforma from './FinanceTables/NeighborhoodScaleProforma';
import StarterBuildingsProforma from './FinanceTables/StarterBuildingsProforma';

import './style.scss';

type OptionType =
  | 'CityScaleProforma'
  | 'NeighborhoodScaleProforma'
  | 'OffgridClustersProforma'
  | 'StarterBuildingsProforma'
  | 'DwellingsProformaAffordability'
  | 'DemographicForecast';

function FinanceTable() {
  const [selectedOption, setSelectedOption] = useState<OptionType>('CityScaleProforma');

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

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value as OptionType);
  };

  return (
    <>
      <div style={{ padding: '0 1rem' }}>
        <select className="form-control" value={selectedOption} onChange={handleChange}>
          <option value="CityScaleProforma">City scale Proforma</option>
          <option value="NeighborhoodScaleProforma">Neighborhood scale Proforma</option>
          <option value="OffgridClustersProforma">Off-grid Clusters Proforma</option>
          <option value="StarterBuildingsProforma">Starter Buildings Proforma</option>
          <option value="DwellingsProformaAffordability">Dwellings Proforma & Affordability</option>
          <option value="DemographicForecast">Demographic forecast</option>
        </select>
      </div>
      {renderSelectedTable()}
    </>
  );
}

export default FinanceTable;
