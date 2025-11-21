declare module 'luckyexcel' {
  interface ExportJson {
    sheets: unknown[];
    info: unknown;
  }

  type SuccessCallback = (exportJson: ExportJson) => void;
  type ErrorCallback = (error: Error) => void;

  const LuckyExcel: {
    transformExcelToLucky: (
      data: ArrayBuffer | File,
      onSuccess: SuccessCallback,
      onError?: ErrorCallback
    ) => void;
  };

  export default LuckyExcel;
}
