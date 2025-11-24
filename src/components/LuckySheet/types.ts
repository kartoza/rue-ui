export const SheetIndex = {
  Q: 1,
  S1DB: 2,
  S2DB: 3,
  S3DB: 4,
  S4DB: 5,
  S5DB: 6,
  S6DB: 7,
};

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
  setSheetActive: (index: number) => void;
  setCellValue: (
    row: number,
    col: number,
    value: unknown,
    options?: { isRefresh?: boolean }
  ) => void;
  getCellValue: (
    row: number,
    col: number,
    options?: {
      type?: 'v' | 'm' | 'f';
    }
  ) => unknown;
  refreshFormula: () => void;
}

export const getLuckySheet = (): LuckySheetGlobal | undefined => {
  return (window as unknown as { luckysheet?: LuckySheetGlobal }).luckysheet;
};
