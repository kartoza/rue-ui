import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import LuckyExcel from 'luckyexcel';
import { MdChevronRight } from 'react-icons/md';
import type { AppDispatch } from '../../redux/store.ts';
import { useCurrentProject } from '../../redux/selectors/projectSelector.ts';
import { getLuckySheet, SheetIndex } from './types.ts';
import { setCells } from './setCells.tsx';
import { updateLuckySheetReducer } from './updateLuckySheetReducer.tsx';

import './style.scss';

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
        forceCalculation: true,
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

    const C = currentProject?.steps?.site?.step?.financial;
    const S = currentProject?.steps?.streets?.step?.financial;
    const N = currentProject?.steps?.public?.step?.financial;
    // const T = currentProject?.steps?.footprint?.step?.financial;
    const T = {
      og_lot0_on_art_num: 0,
      og_lot0_on_sec_num: 0,
      og_lot0_on_loc_num: 0,
      og_lot1_on_loc_num: 0,
      og_lot2_on_loc_num: 0,
      og_clus0_on_art_con: 0,
      og_clus0_on_sec_con: 0,
      og_clus0_on_loc_con: 0,
      og_clus1_on_loc_con: 0,
      og_clus2_on_loc_con: 0,
      og_path0_on_art_area: 0,
      og_path0_on_sec_area: 0,
      og_path0_on_loc_area: 0,
      og_path1_on_loc_area: 0,
      og_path2_on_loc_area: 0,
      og_green0_on_art_area: 0,
      og_green0_on_sec_area: 0,
      og_green0_on_loc_area: 0,
      og_green1_on_loc_area: 0,
      og_green2_on_loc_area: 0,
      param_og_path_w: 0,
      param_og2_path_w: 0,
      param_lot_og_on_sec_w: 0,
      param_lot_og_on_loc_w: 0,
      param_lot_og2_w: 0,
      param_lot_art_fsb: 0,
      param_lot_sec_fsb: 0,
      param_lot_loc_fsb: 0,
      param_lot_og_on_sec_fsb: 0,
      param_lot_og_on_loc_fsb: 0,
      param_lot_og2_fsb: 0,
      param_lot_art_bsb: 0,
      param_lot_sec_bsb: 0,
      param_lot_loc_bsb: 0,
      param_lot_og_on_sec_bsb: 0,
      param_lot_og_on_loc_bsb: 0,
      param_lot_og2_bsb: 0,
      param_lot_art_ssb: 0,
      param_lot_sec_ssb: 0,
      param_lot_loc_ssb: 0,
      param_lot_og_on_sec_ssb: 0,
      param_lot_og_on_loc_ssb: 0,
      param_lot_og2_ssb: 0,
      param_lot_art_f: 0,
      param_lot_sec_f: 0,
      param_lot_loc_f: 0,
      param_lot_og_f: 0,
      param_lot_art_fm: 0,
      param_lot_sec_fm: 0,
      param_lot_loc_fm: 0,
    };
    const parameters = currentProject?.parameters;
    if (!C || !S || !N || !T || !parameters) return;

    setCells(luckysheet, C, S, N, T, parameters);

    // Update reducers after formulas recalculate
    setTimeout(() => {
      updateLuckySheetReducer(dispatch, luckysheet);
      // Update default opened sheet
      luckysheet.setSheetActive(SheetIndex.S1DB);
    }, 1000);
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
