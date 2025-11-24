import { type LuckySheetGlobal, SheetIndex } from './types.ts';
import type { AppDispatch } from '../../redux/store.ts';
import {
  setS1DB,
  setS2DB,
  setS3DB,
  setS4DB,
  setS5DB,
  setS6DB,
  setSpider,
} from '../../redux/reducers/luckySheetSlice.ts';
import type { S1DB, S2DB, S3DB, S4DB, S5DB, S6DB, Spider } from '../../redux/reducers/luckySheet';

export function updateLuckySheetReducer(dispatch: AppDispatch, luckySheet: LuckySheetGlobal) {
  if (!luckySheet) return;

  luckySheet.setSheetActive(SheetIndex.Q);
  luckySheet.refresh();
  luckySheet.refreshFormula();

  // -------------------------
  // Update the lucky sheet
  // -------------------------
  // Update s1db
  luckySheet.setSheetActive(SheetIndex.S1DB);
  const s1db: S1DB = {
    b4: luckySheet.getCellValue(3, 1) as number,
    b5: luckySheet.getCellValue(4, 1) as number,
    b6: luckySheet.getCellValue(5, 1) as number,
    b7: luckySheet.getCellValue(6, 1) as number,
    a9: luckySheet.getCellValue(8, 0, { type: 'm' }) as string,
    b9: luckySheet.getCellValue(8, 1) as number,
    a10: luckySheet.getCellValue(9, 0, { type: 'm' }) as string,
    b10: luckySheet.getCellValue(9, 1) as number,
    a11: luckySheet.getCellValue(10, 0, { type: 'm' }) as string,
    b11: luckySheet.getCellValue(10, 1) as number,
    a12: luckySheet.getCellValue(11, 0, { type: 'm' }) as string,
    b12: luckySheet.getCellValue(11, 1) as number,
    a13: luckySheet.getCellValue(12, 0, { type: 'm' }) as string,
    b13: luckySheet.getCellValue(12, 1) as number,
    b14: luckySheet.getCellValue(13, 1) as number,
    b16: luckySheet.getCellValue(15, 1) as number,
  };
  dispatch(setS1DB(s1db));

  // Update s2db
  luckySheet.setSheetActive(SheetIndex.S2DB);
  const s2db: S2DB = {
    b4: luckySheet.getCellValue(3, 1) as number,
    b5: luckySheet.getCellValue(4, 1) as number,
    b6: luckySheet.getCellValue(5, 1) as number,
    b7: luckySheet.getCellValue(6, 1) as number,
    b8: luckySheet.getCellValue(7, 1) as number,
    b9: luckySheet.getCellValue(8, 1) as number,
    b10: luckySheet.getCellValue(9, 1) as number,
    b11: luckySheet.getCellValue(10, 1) as number,
    b12: luckySheet.getCellValue(11, 1) as number,
    b13: luckySheet.getCellValue(12, 1) as number,
    b14: luckySheet.getCellValue(13, 1) as number,
    b15: luckySheet.getCellValue(14, 1) as number,
    b16: luckySheet.getCellValue(15, 1) as number,
    b18: luckySheet.getCellValue(17, 1) as number,
    b19: luckySheet.getCellValue(18, 1) as number,
  };
  dispatch(setS2DB(s2db));

  // Update s3db
  luckySheet.setSheetActive(SheetIndex.S3DB);
  const s3db: S3DB = {
    //arteries
    b4: luckySheet.getCellValue(3, 1) as number,
    b6: luckySheet.getCellValue(5, 1) as number,
    b7: luckySheet.getCellValue(6, 1) as number,
    b8: luckySheet.getCellValue(7, 1) as number,
    b9: luckySheet.getCellValue(8, 1) as number,
    b10: luckySheet.getCellValue(9, 1) as number,
    b11: luckySheet.getCellValue(10, 1) as number,
    b13: luckySheet.getCellValue(12, 1) as number,
    b14: luckySheet.getCellValue(13, 1) as number,
    b17: luckySheet.getCellValue(16, 1) as number,
    b19: luckySheet.getCellValue(18, 1) as number,
    b20: luckySheet.getCellValue(19, 1) as number,
    b21: luckySheet.getCellValue(20, 1) as number,
    b22: luckySheet.getCellValue(21, 1) as number,
    b23: luckySheet.getCellValue(22, 1) as number,
    b24: luckySheet.getCellValue(23, 1) as number,
    b26: luckySheet.getCellValue(25, 1) as number,
    b27: luckySheet.getCellValue(26, 1) as number,
    //secondaries
    c4: luckySheet.getCellValue(3, 2) as number,
    c6: luckySheet.getCellValue(5, 2) as number,
    c7: luckySheet.getCellValue(6, 2) as number,
    c8: luckySheet.getCellValue(7, 2) as number,
    c9: luckySheet.getCellValue(8, 2) as number,
    c10: luckySheet.getCellValue(9, 2) as number,
    c11: luckySheet.getCellValue(10, 2) as number,
    c13: luckySheet.getCellValue(12, 2) as number,
    c14: luckySheet.getCellValue(13, 2) as number,
    c17: luckySheet.getCellValue(16, 2) as number,
    c19: luckySheet.getCellValue(18, 2) as number,
    c20: luckySheet.getCellValue(19, 2) as number,
    c21: luckySheet.getCellValue(20, 2) as number,
    c22: luckySheet.getCellValue(21, 2) as number,
    c23: luckySheet.getCellValue(22, 2) as number,
    c24: luckySheet.getCellValue(23, 2) as number,
    c26: luckySheet.getCellValue(25, 2) as number,
    c27: luckySheet.getCellValue(26, 2) as number,
    //locals single
    d4: luckySheet.getCellValue(3, 3) as number,
    d6: luckySheet.getCellValue(5, 3) as number,
    d7: luckySheet.getCellValue(6, 3) as number,
    d8: luckySheet.getCellValue(7, 3) as number,
    d9: luckySheet.getCellValue(8, 3) as number,
    d10: luckySheet.getCellValue(9, 3) as number,
    d11: luckySheet.getCellValue(10, 3) as number,
    d13: luckySheet.getCellValue(12, 3) as number,
    d14: luckySheet.getCellValue(13, 3) as number,
    d17: luckySheet.getCellValue(16, 3) as number,
    d19: luckySheet.getCellValue(18, 3) as number,
    d20: luckySheet.getCellValue(19, 3) as number,
    d21: luckySheet.getCellValue(20, 3) as number,
    d22: luckySheet.getCellValue(21, 3) as number,
    d23: luckySheet.getCellValue(22, 3) as number,
    d24: luckySheet.getCellValue(23, 3) as number,
    d26: luckySheet.getCellValue(25, 3) as number,
    d27: luckySheet.getCellValue(26, 3) as number,
    //locals multiple
    e4: luckySheet.getCellValue(3, 4) as number,
    e6: luckySheet.getCellValue(5, 4) as number,
    e7: luckySheet.getCellValue(6, 4) as number,
    e8: luckySheet.getCellValue(7, 4) as number,
    e9: luckySheet.getCellValue(8, 4) as number,
    e10: luckySheet.getCellValue(9, 4) as number,
    e11: luckySheet.getCellValue(10, 4) as number,
    e13: luckySheet.getCellValue(12, 4) as number,
    e14: luckySheet.getCellValue(13, 4) as number,
    e17: luckySheet.getCellValue(16, 4) as number,
    e19: luckySheet.getCellValue(18, 4) as number,
    e20: luckySheet.getCellValue(19, 4) as number,
    e21: luckySheet.getCellValue(20, 4) as number,
    e22: luckySheet.getCellValue(21, 4) as number,
    e23: luckySheet.getCellValue(22, 4) as number,
    e24: luckySheet.getCellValue(23, 4) as number,
    e26: luckySheet.getCellValue(25, 4) as number,
    e27: luckySheet.getCellValue(26, 4) as number,
    //total
    f4: luckySheet.getCellValue(3, 5) as number,
    f6: luckySheet.getCellValue(5, 5) as number,
    f7: luckySheet.getCellValue(6, 5) as number,
    f8: luckySheet.getCellValue(7, 5) as number,
    f9: luckySheet.getCellValue(8, 5) as number,
    f10: luckySheet.getCellValue(9, 5) as number,
    f11: luckySheet.getCellValue(10, 5) as number,
    f13: luckySheet.getCellValue(12, 5) as number,
    f14: luckySheet.getCellValue(13, 5) as number,
    f17: luckySheet.getCellValue(16, 5) as number,
    f19: luckySheet.getCellValue(18, 5) as number,
    f20: luckySheet.getCellValue(19, 5) as number,
    f21: luckySheet.getCellValue(20, 5) as number,
    f22: luckySheet.getCellValue(21, 5) as number,
    f23: luckySheet.getCellValue(22, 5) as number,
    f24: luckySheet.getCellValue(23, 5) as number,
    f26: luckySheet.getCellValue(25, 5) as number,
    f27: luckySheet.getCellValue(26, 5) as number,
  };
  dispatch(setS3DB(s3db));

  // Update s4db
  luckySheet.setSheetActive(SheetIndex.S4DB);
  const s4db: S4DB = {
    s3: luckySheet.getCellValue(2, 18) as number,
    s5: luckySheet.getCellValue(4, 18) as number,
    s6: luckySheet.getCellValue(5, 18) as number,
    s7: luckySheet.getCellValue(6, 18) as number,
    s8: luckySheet.getCellValue(7, 18) as number,
    s9: luckySheet.getCellValue(8, 18) as number,
    s10: luckySheet.getCellValue(9, 18) as number,
    s11: luckySheet.getCellValue(10, 18) as number,
    s13: luckySheet.getCellValue(12, 18) as number,
    s15: luckySheet.getCellValue(14, 18) as number,
    s16: luckySheet.getCellValue(15, 18) as number,
    s17: luckySheet.getCellValue(16, 18) as number,
    s18: luckySheet.getCellValue(17, 18) as number,
    s19: luckySheet.getCellValue(18, 18) as number,
    s20: luckySheet.getCellValue(19, 18) as number,
    s21: luckySheet.getCellValue(20, 18) as number,
    s22: luckySheet.getCellValue(21, 18) as number,
    s23: luckySheet.getCellValue(22, 18) as number,
  };
  dispatch(setS4DB(s4db));

  // Update s5db
  luckySheet.setSheetActive(SheetIndex.S5DB);
  const s5db: S5DB = {
    s4: luckySheet.getCellValue(3, 18) as number,
    s5: luckySheet.getCellValue(4, 18) as number,
    s7: luckySheet.getCellValue(6, 18) as number,
    u7: luckySheet.getCellValue(6, 20) as number,
    s9: luckySheet.getCellValue(8, 18) as number,
    u9: luckySheet.getCellValue(8, 20) as number,
    s10: luckySheet.getCellValue(9, 18) as number,
    u10: luckySheet.getCellValue(9, 20) as number,
    s11: luckySheet.getCellValue(10, 18) as number,
    u11: luckySheet.getCellValue(10, 20) as number,
    s12: luckySheet.getCellValue(11, 18) as number,
    u12: luckySheet.getCellValue(11, 20) as number,
    s15: luckySheet.getCellValue(14, 18) as number,
    u15: luckySheet.getCellValue(14, 20) as number,
    s16: luckySheet.getCellValue(15, 18) as number,
    u16: luckySheet.getCellValue(15, 20) as number,
    s17: luckySheet.getCellValue(16, 18) as number,
    u17: luckySheet.getCellValue(16, 20) as number,
    s18: luckySheet.getCellValue(17, 18) as number,
    u18: luckySheet.getCellValue(17, 20) as number,
    s20: luckySheet.getCellValue(19, 18) as number,
    s21: luckySheet.getCellValue(20, 18) as number,
  };
  dispatch(setS5DB(s5db));

  // Update s6db
  luckySheet.setSheetActive(SheetIndex.S6DB);
  const s6DB: S6DB = {
    b3: luckySheet.getCellValue(2, 1, { type: 'm' }) as string,
    b4: luckySheet.getCellValue(3, 1, { type: 'm' }) as string,
    b5: luckySheet.getCellValue(4, 1, { type: 'm' }) as string,
    b6: luckySheet.getCellValue(5, 1, { type: 'm' }) as string,
    b8: luckySheet.getCellValue(7, 1, { type: 'm' }) as string,
    b9: luckySheet.getCellValue(8, 1, { type: 'm' }) as string,
    b10: luckySheet.getCellValue(9, 1, { type: 'm' }) as string,
    b11: luckySheet.getCellValue(10, 1, { type: 'm' }) as string,
  };
  dispatch(setS6DB(s6DB));

  // Update s6db
  luckySheet.setSheetActive(SheetIndex.Spider);
  const spider: Spider = {
    d5: luckySheet.getCellValue(4, 3) as number,
    d7: luckySheet.getCellValue(6, 3) as number,
    d10: luckySheet.getCellValue(9, 3) as number,
    d12: luckySheet.getCellValue(11, 3) as number,
    d13: luckySheet.getCellValue(12, 3) as number,
    d14: luckySheet.getCellValue(13, 3) as number,
    d16: luckySheet.getCellValue(15, 3) as number,
    d17: luckySheet.getCellValue(16, 3) as number,
  };
  dispatch(setSpider(spider));
}
