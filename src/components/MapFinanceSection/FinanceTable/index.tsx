import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import CityScaleProforma from './Tables/CityScaleProforma';
import DemographicForecast from './Tables/DemographicForecast';
import DwellingsProformaAffordability from './Tables/DwellingsProformaAffordability';
import OffGridClustersProforma from './Tables/OffGridClustersProforma.tsx';
import NeighborhoodScaleProforma from './Tables/NeighborhoodScaleProforma';
import StarterBuildingsProforma from './Tables/StarterBuildingsProforma';
import { getLuckySheet, SheetIndex } from '../../LuckySheet/types.ts';
import type { AppDispatch } from '../../../redux/store.ts';
import LuckySheet from '../../LuckySheet';

import { LABELS, OptionType } from './type';
import { toggleRightSide } from '../../../redux/reducers/global.ts';

function FinanceTable() {
  const dispatch = useDispatch<AppDispatch>();
  const [showLuckySheet, setShowLuckySheet] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<OptionType>(
    OptionType.NeighborhoodScaleProforma
  );

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
    const value = e.target.value as OptionType;
    setSelectedOption(value);

    const luckysheet = getLuckySheet();
    if (!luckysheet) return;
    switch (value) {
      case OptionType.CityScaleProforma:
        luckysheet.setSheetActive(SheetIndex.S1DB);
        break;
      case OptionType.NeighborhoodScaleProforma:
        luckysheet.setSheetActive(SheetIndex.S2DB);
        break;
      case OptionType.OffGridClustersProforma:
        luckysheet.setSheetActive(SheetIndex.S3DB);
        break;
      case OptionType.StarterBuildingsProforma:
        luckysheet.setSheetActive(SheetIndex.S4DB);
        break;
      case OptionType.DwellingsProformaAffordability:
        luckysheet.setSheetActive(SheetIndex.S5DB);
        break;
      case OptionType.DemographicForecast:
        luckysheet.setSheetActive(SheetIndex.S6DB);
        break;
    }
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <MdChevronLeft
          className="full-screen svg-button"
          onClick={() => setShowLuckySheet(true)}
          style={{ cursor: 'pointer' }}
        />
        <LuckySheet open={showLuckySheet} setOpen={setShowLuckySheet} />
        <select className="form-control" value={selectedOption} onChange={handleChange}>
          {Object.entries(LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <MdChevronRight
          className="right-toggle svg-button"
          onClick={() => dispatch(toggleRightSide())}
          style={{ cursor: 'pointer' }}
        />
      </div>
      {renderSelectedTable()}
    </>
  );
}

export default FinanceTable;
