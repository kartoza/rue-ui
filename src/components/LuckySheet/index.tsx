import { useEffect, useRef } from 'react';
import LuckyExcel from 'luckyexcel';
import { MdChevronRight } from 'react-icons/md';

import './style.scss';

interface LuckySheetOptions {
  container: string;
  title?: string;
  lang?: string;
  data?: unknown[];
  showtoolbar?: boolean;
  showinfobar?: boolean;
  showsheetbar?: boolean;
  showstatisticBar?: boolean;
  sheetBottomConfig?: boolean;
  allowEdit?: boolean;
  enableAddRow?: boolean;
  enableAddBackTop?: boolean;
  showConfigWindowResize?: boolean;
  forceCalculation?: boolean;
}

interface LuckySheetGlobal {
  create: (options: LuckySheetOptions) => void;
  destroy: () => void;
}

const getLuckySheet = (): LuckySheetGlobal | undefined => {
  return (window as unknown as { luckysheet?: LuckySheetGlobal }).luckysheet;
};

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const LuckySheet = ({ open, setOpen }: Props) => {
  const xlsxUrl = '/src/assets/lucky_sheet/v38d0.xlsx';
  const isInitializedRef = useRef(false);

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
  useEffect(() => {}, []);

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
