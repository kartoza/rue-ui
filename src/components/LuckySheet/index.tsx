import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import LuckyExcel from 'luckyexcel';
import { MdChevronRight } from 'react-icons/md';
import type { AppDispatch } from '../../redux/store.ts';
import { useCurrentProject } from '../../redux/selectors/projectSelector.ts';
import { getLuckySheet, SheetIndex } from './types.ts';
import { setCells } from './setCells.tsx';

import './style.scss';
import { updateLuckySheetReducer } from './updateLuckySheetReducer.tsx';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const LuckySheet = ({ open, setOpen }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentProject = useCurrentProject();
  const xlsxUrl = '/src/assets/lucky_sheet/v38d0.xlsx';
  const isInitializedRef = useRef(false);
  const isSheetReadyRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const luckysheet = getLuckySheet();
    if (!luckysheet) {
      console.error('LuckySheet not loaded');
      return;
    }

    const initEmptySheet = () => {
      luckysheet.create({
        container: 'luckysheet-content',
        title: 'New Sheet',
        lang: 'en',
        showtoolbar: false,
        showinfobar: false,
        showsheetbar: true,
        showstatisticBar: false,
        allowEdit: true,
      });
      isSheetReadyRef.current = true;
    };

    const loadXlsx = async () => {
      try {
        const response = await fetch(xlsxUrl);
        const arrayBuffer = await response.arrayBuffer();

        LuckyExcel.transformExcelToLucky(
          arrayBuffer,
          (exportJson: { sheets: unknown[]; info: unknown }) => {
            if (!exportJson.sheets || exportJson.sheets.length === 0) {
              console.error('No sheets found in Excel file');
              initEmptySheet();
              return;
            }

            luckysheet.create({
              container: 'luckysheet-content',
              title: 'Excel Sheet',
              lang: 'en',
              data: exportJson.sheets,
              showtoolbar: false,
              showinfobar: false,
              showsheetbar: true,
              showstatisticBar: false,
              sheetBottomConfig: false,
              allowEdit: true,
              enableAddRow: true,
              enableAddBackTop: true,
              showConfigWindowResize: false,
              forceCalculation: true,
            });
            isSheetReadyRef.current = true;

            console.log('XLSX loaded successfully with styles');
          },
          (error: Error) => {
            console.error('Failed to parse xlsx:', error);
            initEmptySheet();
          }
        );
      } catch (error) {
        console.error('Failed to load xlsx:', error);
        initEmptySheet();
      }
    };

    if (xlsxUrl) {
      void loadXlsx();
    } else {
      initEmptySheet();
    }

    return () => {
      const ls = getLuckySheet();
      if (ls) {
        ls.destroy();
      }
      isInitializedRef.current = false;
    };
  }, [xlsxUrl]);

  // Update the sheet
  useEffect(() => {
    const luckysheet = getLuckySheet();
    if (!luckysheet) return;
    if (!isSheetReadyRef.current) return;

    const C = currentProject?.steps?.site?.step?.result;
    const N = currentProject?.steps?.subdivision?.step?.result;
    const T = currentProject?.steps?.footprint?.step?.result;
    const parameters = currentProject?.parameters;
    if (!C || !N || !T || !parameters) return;

    setCells(
      luckysheet,
      currentProject?.steps?.site?.step?.result,
      currentProject?.steps?.subdivision?.step?.result,
      currentProject?.steps?.footprint?.step?.result,
      currentProject?.parameters
    );

    // Update reducers
    updateLuckySheetReducer(dispatch, luckysheet);

    // Update default opened sheet
    luckysheet.setSheetActive(SheetIndex.Q);
  }, [currentProject, dispatch]);

  return (
    <div id="luckysheet" className={open ? 'open' : ''}>
      <div className="header">
        <MdChevronRight onClick={() => setOpen(false)} />
      </div>
      <div id="luckysheet-content" />
    </div>
  );
};

export default LuckySheet;
