import type { ChangeEvent } from 'react';
import { useState } from 'react';
import CityScaleProforma from './Tables/CityScaleProforma';
import DemographicForecast from './Tables/DemographicForecast';
import DwellingsProformaAffordability from './Tables/DwellingsProformaAffordability';
import OffGridClustersProforma from './Tables/OffGridClustersProforma.tsx';
import NeighborhoodScaleProforma from './Tables/NeighborhoodScaleProforma';
import StarterBuildingsProforma from './Tables/StarterBuildingsProforma';

import { LABELS, OptionType } from './type';

function FinanceTable() {
  const [selectedOption, setSelectedOption] = useState<OptionType>(OptionType.CityScaleProforma);

  const renderSelectedTable = () => {
    switch (selectedOption) {
      case OptionType.CityScaleProforma:
        return <CityScaleProforma />;
      case OptionType.NeighborhoodScaleProforma:
        return <NeighborhoodScaleProforma />;
      case OptionType.OffGridClustersProforma:
        return <OffGridClustersProforma />;
      case OptionType.StarterBuildingsProforma:
        return <StarterBuildingsProforma />;
      case OptionType.DwellingsProformaAffordability:
        return <DwellingsProformaAffordability />;
      case OptionType.DemographicForecast:
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
      <div style={{ padding: '0 1rem 0 3rem' }}>
        <select className="form-control" value={selectedOption} onChange={handleChange}>
          {Object.entries(LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {renderSelectedTable()}
    </>
  );
}

export default FinanceTable;
