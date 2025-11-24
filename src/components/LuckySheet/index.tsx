import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import LuckyExcel from 'luckyexcel';
import { MdChevronRight } from 'react-icons/md';
import type { AppDispatch } from '../../redux/store.ts';
import { useCurrentProject } from '../../redux/selectors/projectSelector.ts';
import type { S1DB, S2DB, S3DB, S4DB, S5DB, S6DB } from '../../redux/reducers/luckySheet';
import {
  setS1DB,
  setS2DB,
  setS3DB,
  setS4DB,
  setS5DB,
  setS6DB,
} from '../../redux/reducers/luckySheetSlice';
import { getLuckySheet, SheetIndex } from './types.ts';

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
    luckysheet.setSheetActive(SheetIndex.Q);
    luckysheet.setCellValue(52, 1, C.site_roads_area / 10000, { isRefresh: false });
    luckysheet.setCellValue(63, 1, C.site_area_total, { isRefresh: false });

    //* Neighbourhood to Q  */
    //C3-C5
    luckysheet.setCellValue(2, 2, N.road_len_art_100, { isRefresh: false });
    luckysheet.setCellValue(3, 2, N.road_len_sec_100, { isRefresh: false });
    luckysheet.setCellValue(4, 2, N.road_len_loc_100, { isRefresh: false });
    //D3-D5
    luckysheet.setCellValue(2, 3, N.road_len_art_50, { isRefresh: false });
    luckysheet.setCellValue(3, 3, N.road_len_sec_50, { isRefresh: false });
    luckysheet.setCellValue(4, 3, N.road_len_loc_50, { isRefresh: false });
    //L14-L17
    luckysheet.setCellValue(13, 11, N.open_art_art_area, { isRefresh: false });
    luckysheet.setCellValue(14, 11, N.open_art_sec_area, { isRefresh: false });
    luckysheet.setCellValue(15, 11, N.open_art_loc_area, { isRefresh: false });
    luckysheet.setCellValue(16, 11, N.open_art_area, { isRefresh: false });
    //L19-L21
    luckysheet.setCellValue(18, 11, N.open_sec_sec_area, { isRefresh: false });
    luckysheet.setCellValue(19, 11, N.open_sec_loc_area, { isRefresh: false });
    luckysheet.setCellValue(20, 11, N.open_sec_area, { isRefresh: false });
    //L23-L24
    luckysheet.setCellValue(22, 11, N.open_loc_loc_area, { isRefresh: false });
    luckysheet.setCellValue(23, 11, N.open_loc_area, { isRefresh: false });
    //L26-L30
    luckysheet.setCellValue(25, 11, N.open_og_clus0_on_art_area, { isRefresh: false });
    luckysheet.setCellValue(26, 11, N.open_og_clus0_on_sec_area, { isRefresh: false });
    luckysheet.setCellValue(27, 11, N.open_og_clus0_on_loc_area, { isRefresh: false });
    luckysheet.setCellValue(28, 11, N.open_og_clus1_on_loc_area, { isRefresh: false });
    luckysheet.setCellValue(29, 11, N.open_og_clus2_on_loc_area, { isRefresh: false });
    //M14-M17
    luckysheet.setCellValue(13, 12, N.amen_art_art_area, { isRefresh: false });
    luckysheet.setCellValue(14, 12, N.amen_art_sec_area, { isRefresh: false });
    luckysheet.setCellValue(15, 12, N.amen_art_loc_area, { isRefresh: false });
    luckysheet.setCellValue(16, 12, N.amen_art_area, { isRefresh: false });
    //M19-M21
    luckysheet.setCellValue(18, 12, N.amen_sec_sec_area, { isRefresh: false });
    luckysheet.setCellValue(19, 12, N.amen_sec_loc_area, { isRefresh: false });
    luckysheet.setCellValue(20, 12, N.amen_sec_area, { isRefresh: false });
    //M23-M24
    luckysheet.setCellValue(22, 12, N.amen_loc_loc_area, { isRefresh: false });
    luckysheet.setCellValue(23, 12, N.amen_loc_area, { isRefresh: false });
    //M26-M30
    luckysheet.setCellValue(25, 12, N.amen_og_clus0_on_art_area, { isRefresh: false });
    luckysheet.setCellValue(26, 12, N.amen_og_clus0_on_sec_area, { isRefresh: false });
    luckysheet.setCellValue(27, 12, N.amen_og_clus0_on_loc_area, { isRefresh: false });
    luckysheet.setCellValue(28, 12, N.amen_og_clus1_on_loc_area, { isRefresh: false });
    luckysheet.setCellValue(29, 12, N.amen_og_clus2_on_loc_area, { isRefresh: false });
    //O14-O17
    luckysheet.setCellValue(13, 14, N.lot_art_art_area, { isRefresh: false });
    luckysheet.setCellValue(14, 14, N.lot_art_sec_area, { isRefresh: false });
    luckysheet.setCellValue(15, 14, N.lot_art_loc_area, { isRefresh: false });
    luckysheet.setCellValue(16, 14, N.lot_art_area, { isRefresh: false });
    //O19-O21
    luckysheet.setCellValue(18, 14, N.lot_sec_sec_area, { isRefresh: false });
    luckysheet.setCellValue(19, 14, N.lot_sec_loc_area, { isRefresh: false });
    luckysheet.setCellValue(20, 14, N.lot_sec_area, { isRefresh: false });
    //O23-O24
    luckysheet.setCellValue(22, 14, N.lot_loc_loc_area, { isRefresh: false });
    luckysheet.setCellValue(23, 14, N.lot_loc_area, { isRefresh: false });
    //O25-O30
    luckysheet.setCellValue(25, 14, N.og_clus0_on_art_area, { isRefresh: false });
    luckysheet.setCellValue(26, 14, N.og_clus0_on_sec_area, { isRefresh: false });
    luckysheet.setCellValue(27, 14, N.og_clus0_on_loc_area, { isRefresh: false });
    luckysheet.setCellValue(28, 14, N.og_clus1_on_loc_area, { isRefresh: false });
    luckysheet.setCellValue(29, 14, N.og_clus2_on_loc_area, { isRefresh: false });
    //X14-X17
    luckysheet.setCellValue(13, 23, N.lot_art_art_num, { isRefresh: false });
    luckysheet.setCellValue(14, 23, N.lot_art_sec_num, { isRefresh: false });
    luckysheet.setCellValue(15, 23, N.lot_art_loc_num, { isRefresh: false });
    luckysheet.setCellValue(16, 23, N.lot_art_num, { isRefresh: false });
    //X19-X21
    luckysheet.setCellValue(18, 23, N.lot_sec_sec_num, { isRefresh: false });
    luckysheet.setCellValue(19, 23, N.lot_sec_loc_num, { isRefresh: false });
    luckysheet.setCellValue(20, 23, N.lot_sec_num, { isRefresh: false });
    //X23-X24
    luckysheet.setCellValue(22, 23, N.lot_loc_loc_num, { isRefresh: false });
    luckysheet.setCellValue(23, 23, N.lot_loc_num, { isRefresh: false });
    //G33-G35
    luckysheet.setCellValue(32, 6, N.road_area_art, { isRefresh: false });
    luckysheet.setCellValue(33, 6, N.road_area_sec, { isRefresh: false });
    luckysheet.setCellValue(34, 6, N.road_area_loc, { isRefresh: false });
    //C45-C49
    luckysheet.setCellValue(44, 2, N.og_clus0_on_art_num, { isRefresh: false });
    luckysheet.setCellValue(45, 2, N.og_clus0_on_sec_num, { isRefresh: false });
    luckysheet.setCellValue(46, 2, N.og_clus0_on_loc_num, { isRefresh: false });
    luckysheet.setCellValue(47, 2, N.og_clus1_on_loc_num, { isRefresh: false });
    luckysheet.setCellValue(48, 2, N.og_clus2_on_loc_num, { isRefresh: false });
    //G45-G48
    luckysheet.setCellValue(44, 6, N.og_entr0_on_art_area, { isRefresh: false });
    luckysheet.setCellValue(45, 6, N.og_entr0_on_sec_area, { isRefresh: false });
    luckysheet.setCellValue(46, 6, N.og_entr0_on_loc_area, { isRefresh: false });
    luckysheet.setCellValue(47, 6, N.og_entr1_on_loc_area, { isRefresh: false });
    //Q37
    luckysheet.setCellValue(36, 16, N.site_total_area, { isRefresh: false });
    //V28
    luckysheet.setCellValue(27, 21, N.param_ogc_w, { isRefresh: false });
    //Y17, Y21, Y24
    luckysheet.setCellValue(16, 24, N.param_lot_art_d, { isRefresh: false });
    luckysheet.setCellValue(20, 24, N.param_lot_sec_d, { isRefresh: false });
    luckysheet.setCellValue(23, 24, N.param_lot_loc_d, { isRefresh: false });
    //Z17, Z21, Z24
    luckysheet.setCellValue(16, 25, N.param_lot_art_w, { isRefresh: false });
    luckysheet.setCellValue(20, 25, N.param_lot_sec_w, { isRefresh: false });
    luckysheet.setCellValue(23, 25, N.param_lot_loc_w, { isRefresh: false });
    //* Tissue to Q  */
    //X26-X30
    luckysheet.setCellValue(25, 23, T.og_lot0_on_art_num, { isRefresh: false });
    luckysheet.setCellValue(26, 23, T.og_lot0_on_sec_num, { isRefresh: false });
    luckysheet.setCellValue(27, 23, T.og_lot0_on_loc_num, { isRefresh: false });
    luckysheet.setCellValue(28, 23, T.og_lot1_on_loc_num, { isRefresh: false });
    luckysheet.setCellValue(29, 23, T.og_lot2_on_loc_num, { isRefresh: false });
    //D45-D49
    luckysheet.setCellValue(44, 3, T.og_clus0_on_art_con, { isRefresh: false });
    luckysheet.setCellValue(45, 3, T.og_clus0_on_sec_con, { isRefresh: false });
    luckysheet.setCellValue(46, 3, T.og_clus0_on_loc_con, { isRefresh: false });
    luckysheet.setCellValue(47, 3, T.og_clus1_on_loc_con, { isRefresh: false });
    luckysheet.setCellValue(48, 3, T.og_clus2_on_loc_con, { isRefresh: false });
    //H45-H49
    luckysheet.setCellValue(44, 7, T.og_path0_on_art_area, { isRefresh: false });
    luckysheet.setCellValue(45, 7, T.og_path0_on_sec_area, { isRefresh: false });
    luckysheet.setCellValue(46, 7, T.og_path0_on_loc_area, { isRefresh: false });
    luckysheet.setCellValue(47, 7, T.og_path1_on_loc_area, { isRefresh: false });
    luckysheet.setCellValue(48, 7, T.og_path2_on_loc_area, { isRefresh: false });
    //I45-I49
    luckysheet.setCellValue(44, 8, T.og_green0_on_art_area, { isRefresh: false });
    luckysheet.setCellValue(45, 8, T.og_green0_on_sec_area, { isRefresh: false });
    luckysheet.setCellValue(46, 8, T.og_green0_on_loc_area, { isRefresh: false });
    luckysheet.setCellValue(47, 8, T.og_green1_on_loc_area, { isRefresh: false });
    luckysheet.setCellValue(48, 8, T.og_green2_on_loc_area, { isRefresh: false });
    //W28, W30
    luckysheet.setCellValue(27, 22, T.param_og_path_w, { isRefresh: false });
    luckysheet.setCellValue(29, 22, T.param_og2_path_w, { isRefresh: false });
    //Z27, Z28, Z30
    luckysheet.setCellValue(26, 25, T.param_lot_og_on_sec_w, { isRefresh: false });
    luckysheet.setCellValue(27, 25, T.param_lot_og_on_loc_w, { isRefresh: false });
    luckysheet.setCellValue(29, 25, T.param_lot_og2_w, { isRefresh: false });
    //AB17, AB21, AB24, AB27, AB28, AB30
    luckysheet.setCellValue(16, 27, T.param_lot_art_fsb, { isRefresh: false });
    luckysheet.setCellValue(20, 27, T.param_lot_sec_fsb, { isRefresh: false });
    luckysheet.setCellValue(23, 27, T.param_lot_loc_fsb, { isRefresh: false });
    luckysheet.setCellValue(26, 27, T.param_lot_og_on_sec_fsb, { isRefresh: false });
    luckysheet.setCellValue(27, 27, T.param_lot_og_on_loc_fsb, { isRefresh: false });
    luckysheet.setCellValue(28, 27, T.param_lot_og2_fsb, { isRefresh: false });
    //AC17, AC21, AC24, AC27, AC28, AC30
    luckysheet.setCellValue(16, 28, T.param_lot_art_bsb, { isRefresh: false });
    luckysheet.setCellValue(20, 28, T.param_lot_sec_bsb, { isRefresh: false });
    luckysheet.setCellValue(23, 28, T.param_lot_loc_bsb, { isRefresh: false });
    luckysheet.setCellValue(26, 28, T.param_lot_og_on_sec_bsb, { isRefresh: false });
    luckysheet.setCellValue(27, 28, T.param_lot_og_on_loc_bsb, { isRefresh: false });
    luckysheet.setCellValue(28, 28, T.param_lot_og2_bsb, { isRefresh: false });
    //AE17, AE21, AE24, AE27, AE28, AE30
    luckysheet.setCellValue(16, 30, T.param_lot_art_ssb, { isRefresh: false });
    luckysheet.setCellValue(20, 30, T.param_lot_sec_ssb, { isRefresh: false });
    luckysheet.setCellValue(23, 30, T.param_lot_loc_ssb, { isRefresh: false });
    luckysheet.setCellValue(26, 30, T.param_lot_og_on_sec_ssb, { isRefresh: false });
    luckysheet.setCellValue(27, 30, T.param_lot_og_on_loc_ssb, { isRefresh: false });
    luckysheet.setCellValue(28, 30, T.param_lot_og2_ssb, { isRefresh: false });
    //AI17, AI21, AI24, AI28
    luckysheet.setCellValue(16, 34, T.param_lot_art_f, { isRefresh: false });
    luckysheet.setCellValue(20, 34, T.param_lot_sec_f, { isRefresh: false });
    luckysheet.setCellValue(23, 34, T.param_lot_loc_f, { isRefresh: false });
    luckysheet.setCellValue(27, 34, T.param_lot_og_f, { isRefresh: false });
    //AJ14, AJ15, AJ16
    luckysheet.setCellValue(13, 35, T.param_lot_art_fm / 100, { isRefresh: false });
    luckysheet.setCellValue(14, 35, T.param_lot_sec_fm / 100, { isRefresh: false });
    luckysheet.setCellValue(15, 35, T.param_lot_loc_fm / 100, { isRefresh: false });

    //AO14, AP14, AQ14
    luckysheet.setCellValue(
      13,
      40,
      parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_other_artery
        .initial_width_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      13,
      41,
      parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_other_artery
        .initial_depth_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      13,
      42,
      parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_other_artery
        .initial_floors_percent / 100,
      {
        isRefresh: false,
      }
    );
    //AO15, AP15, AQ15
    luckysheet.setCellValue(
      14,
      40,
      parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_secondary
        .initial_width_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      14,
      41,
      parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_secondary
        .initial_depth_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      14,
      42,
      parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_secondary
        .initial_floors_percent / 100,
      {
        isRefresh: false,
      }
    );
    //AO16, AP16, AQ16
    luckysheet.setCellValue(
      15,
      40,
      parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_tertiary
        .initial_width_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      15,
      41,
      parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_tertiary
        .initial_depth_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      15,
      42,
      parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_tertiary
        .initial_floors_percent / 100,
      {
        isRefresh: false,
      }
    );
    //AO17, AP17, AQ17
    luckysheet.setCellValue(
      16,
      40,
      parameters?.starter_buildings.on_grid_lots_on_arteries.regular_lot.initial_width_percent /
        100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      16,
      41,
      parameters?.starter_buildings.on_grid_lots_on_arteries.regular_lot.initial_depth_percent /
        100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      16,
      42,
      parameters?.starter_buildings.on_grid_lots_on_arteries.regular_lot.initial_floors_percent /
        100,
      {
        isRefresh: false,
      }
    );
    //AO19, AP19, AQ19
    luckysheet.setCellValue(
      18,
      40,
      parameters?.starter_buildings.on_grid_lots_on_secondaries.corner_with_other_secondary
        .initial_width_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      18,
      41,
      parameters?.starter_buildings.on_grid_lots_on_secondaries.corner_with_other_secondary
        .initial_depth_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      18,
      42,
      parameters?.starter_buildings.on_grid_lots_on_secondaries.corner_with_other_secondary
        .initial_floors_percent / 100,
      {
        isRefresh: false,
      }
    );
    //AO20, AP20, AQ20
    luckysheet.setCellValue(
      19,
      40,
      parameters?.starter_buildings.on_grid_lots_on_secondaries.corner_with_tertiary
        .initial_width_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      19,
      41,
      parameters?.starter_buildings.on_grid_lots_on_secondaries.corner_with_tertiary
        .initial_depth_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      19,
      42,
      parameters?.starter_buildings.on_grid_lots_on_secondaries.corner_with_tertiary
        .initial_floors_percent / 100,
      {
        isRefresh: false,
      }
    );
    //AO21, AP21, AQ21
    luckysheet.setCellValue(
      20,
      40,
      parameters?.starter_buildings.on_grid_lots_on_secondaries.regular_lot.initial_width_percent /
        100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      20,
      41,
      parameters?.starter_buildings.on_grid_lots_on_secondaries.regular_lot.initial_depth_percent /
        100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      20,
      42,
      parameters?.starter_buildings.on_grid_lots_on_secondaries.regular_lot.initial_floors_percent /
        100,
      {
        isRefresh: false,
      }
    );
    //AO23, AP23, AQ23
    luckysheet.setCellValue(
      22,
      40,
      parameters?.starter_buildings.on_grid_lots_on_locals.corner_with_other_local
        .initial_width_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      22,
      41,
      parameters?.starter_buildings.on_grid_lots_on_locals.corner_with_other_local
        .initial_depth_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      22,
      42,
      parameters?.starter_buildings.on_grid_lots_on_locals.corner_with_other_local
        .initial_floors_percent / 100,
      {
        isRefresh: false,
      }
    );
    //AO24, AP24, AQ24
    luckysheet.setCellValue(
      23,
      40,
      parameters?.starter_buildings.on_grid_lots_on_locals.regular_lot.initial_width_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      23,
      41,
      parameters?.starter_buildings.on_grid_lots_on_locals.regular_lot.initial_depth_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      23,
      42,
      parameters?.starter_buildings.on_grid_lots_on_locals.regular_lot.initial_floors_percent / 100,
      {
        isRefresh: false,
      }
    );
    //AO28, AP28, AQ28
    luckysheet.setCellValue(
      27,
      40,
      parameters?.starter_buildings.off_grid_cluster_type_1.initial_width_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      27,
      41,
      parameters?.starter_buildings.off_grid_cluster_type_1.initial_depth_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      27,
      42,
      parameters?.starter_buildings.off_grid_cluster_type_1.initial_floors_percent / 100,
      {
        isRefresh: false,
      }
    );
    //AO30, AP30, AQ30
    luckysheet.setCellValue(
      29,
      40,
      parameters?.starter_buildings.off_grid_cluster_type_2.initial_width_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      29,
      41,
      parameters?.starter_buildings.off_grid_cluster_type_2.initial_depth_percent / 100,
      {
        isRefresh: false,
      }
    );
    luckysheet.setCellValue(
      29,
      42,
      parameters?.starter_buildings.off_grid_cluster_type_2.initial_floors_percent / 100
    );
    luckysheet.refreshFormula();

    // -------------------------
    // Update the lucky sheet
    // -------------------------
    // Update s1db
    luckysheet.setSheetActive(SheetIndex.S1DB);
    const s1db: S1DB = {
      b4: luckysheet.getCellValue(3, 1) as number,
      b5: luckysheet.getCellValue(4, 1) as number,
      b6: luckysheet.getCellValue(5, 1) as number,
      b7: luckysheet.getCellValue(6, 1) as number,
      a9: luckysheet.getCellValue(8, 0, { type: 'm' }) as string,
      b9: luckysheet.getCellValue(8, 1) as number,
      a10: luckysheet.getCellValue(9, 0, { type: 'm' }) as string,
      b10: luckysheet.getCellValue(9, 1) as number,
      a11: luckysheet.getCellValue(10, 0, { type: 'm' }) as string,
      b11: luckysheet.getCellValue(10, 1) as number,
      a12: luckysheet.getCellValue(11, 0, { type: 'm' }) as string,
      b12: luckysheet.getCellValue(11, 1) as number,
      a13: luckysheet.getCellValue(12, 0, { type: 'm' }) as string,
      b13: luckysheet.getCellValue(12, 1) as number,
      b14: luckysheet.getCellValue(13, 1) as number,
      b16: luckysheet.getCellValue(15, 1) as number,
    };
    dispatch(setS1DB(s1db));

    // Update s2db
    luckysheet.setSheetActive(SheetIndex.S2DB);
    const s2db: S2DB = {
      b4: luckysheet.getCellValue(3, 1) as number,
      b5: luckysheet.getCellValue(4, 1) as number,
      b6: luckysheet.getCellValue(5, 1) as number,
      b7: luckysheet.getCellValue(6, 1) as number,
      b8: luckysheet.getCellValue(7, 1) as number,
      b9: luckysheet.getCellValue(8, 1) as number,
      b10: luckysheet.getCellValue(9, 1) as number,
      b11: luckysheet.getCellValue(10, 1) as number,
      b12: luckysheet.getCellValue(11, 1) as number,
      b13: luckysheet.getCellValue(12, 1) as number,
      b14: luckysheet.getCellValue(13, 1) as number,
      b15: luckysheet.getCellValue(14, 1) as number,
      b16: luckysheet.getCellValue(15, 1) as number,
      b18: luckysheet.getCellValue(17, 1) as number,
      b19: luckysheet.getCellValue(18, 1) as number,
    };
    dispatch(setS2DB(s2db));

    // Update s3db
    luckysheet.setSheetActive(SheetIndex.S3DB);
    const s3db: S3DB = {
      //arteries
      b4: luckysheet.getCellValue(3, 1) as number,
      b6: luckysheet.getCellValue(5, 1) as number,
      b7: luckysheet.getCellValue(6, 1) as number,
      b8: luckysheet.getCellValue(7, 1) as number,
      b9: luckysheet.getCellValue(8, 1) as number,
      b10: luckysheet.getCellValue(9, 1) as number,
      b11: luckysheet.getCellValue(10, 1) as number,
      b13: luckysheet.getCellValue(12, 1) as number,
      b14: luckysheet.getCellValue(13, 1) as number,
      b17: luckysheet.getCellValue(16, 1) as number,
      b19: luckysheet.getCellValue(18, 1) as number,
      b20: luckysheet.getCellValue(19, 1) as number,
      b21: luckysheet.getCellValue(20, 1) as number,
      b22: luckysheet.getCellValue(21, 1) as number,
      b23: luckysheet.getCellValue(22, 1) as number,
      b24: luckysheet.getCellValue(23, 1) as number,
      b26: luckysheet.getCellValue(25, 1) as number,
      b27: luckysheet.getCellValue(26, 1) as number,
      //secondaries
      c4: luckysheet.getCellValue(3, 2) as number,
      c6: luckysheet.getCellValue(5, 2) as number,
      c7: luckysheet.getCellValue(6, 2) as number,
      c8: luckysheet.getCellValue(7, 2) as number,
      c9: luckysheet.getCellValue(8, 2) as number,
      c10: luckysheet.getCellValue(9, 2) as number,
      c11: luckysheet.getCellValue(10, 2) as number,
      c13: luckysheet.getCellValue(12, 2) as number,
      c14: luckysheet.getCellValue(13, 2) as number,
      c17: luckysheet.getCellValue(16, 2) as number,
      c19: luckysheet.getCellValue(18, 2) as number,
      c20: luckysheet.getCellValue(19, 2) as number,
      c21: luckysheet.getCellValue(20, 2) as number,
      c22: luckysheet.getCellValue(21, 2) as number,
      c23: luckysheet.getCellValue(22, 2) as number,
      c24: luckysheet.getCellValue(23, 2) as number,
      c26: luckysheet.getCellValue(25, 2) as number,
      c27: luckysheet.getCellValue(26, 2) as number,
      //locals single
      d4: luckysheet.getCellValue(3, 3) as number,
      d6: luckysheet.getCellValue(5, 3) as number,
      d7: luckysheet.getCellValue(6, 3) as number,
      d8: luckysheet.getCellValue(7, 3) as number,
      d9: luckysheet.getCellValue(8, 3) as number,
      d10: luckysheet.getCellValue(9, 3) as number,
      d11: luckysheet.getCellValue(10, 3) as number,
      d13: luckysheet.getCellValue(12, 3) as number,
      d14: luckysheet.getCellValue(13, 3) as number,
      d17: luckysheet.getCellValue(16, 3) as number,
      d19: luckysheet.getCellValue(18, 3) as number,
      d20: luckysheet.getCellValue(19, 3) as number,
      d21: luckysheet.getCellValue(20, 3) as number,
      d22: luckysheet.getCellValue(21, 3) as number,
      d23: luckysheet.getCellValue(22, 3) as number,
      d24: luckysheet.getCellValue(23, 3) as number,
      d26: luckysheet.getCellValue(25, 3) as number,
      d27: luckysheet.getCellValue(26, 3) as number,
      //locals multiple
      e4: luckysheet.getCellValue(3, 4) as number,
      e6: luckysheet.getCellValue(5, 4) as number,
      e7: luckysheet.getCellValue(6, 4) as number,
      e8: luckysheet.getCellValue(7, 4) as number,
      e9: luckysheet.getCellValue(8, 4) as number,
      e10: luckysheet.getCellValue(9, 4) as number,
      e11: luckysheet.getCellValue(10, 4) as number,
      e13: luckysheet.getCellValue(12, 4) as number,
      e14: luckysheet.getCellValue(13, 4) as number,
      e17: luckysheet.getCellValue(16, 4) as number,
      e19: luckysheet.getCellValue(18, 4) as number,
      e20: luckysheet.getCellValue(19, 4) as number,
      e21: luckysheet.getCellValue(20, 4) as number,
      e22: luckysheet.getCellValue(21, 4) as number,
      e23: luckysheet.getCellValue(22, 4) as number,
      e24: luckysheet.getCellValue(23, 4) as number,
      e26: luckysheet.getCellValue(25, 4) as number,
      e27: luckysheet.getCellValue(26, 4) as number,
      //total
      f4: luckysheet.getCellValue(3, 5) as number,
      f6: luckysheet.getCellValue(5, 5) as number,
      f7: luckysheet.getCellValue(6, 5) as number,
      f8: luckysheet.getCellValue(7, 5) as number,
      f9: luckysheet.getCellValue(8, 5) as number,
      f10: luckysheet.getCellValue(9, 5) as number,
      f11: luckysheet.getCellValue(10, 5) as number,
      f13: luckysheet.getCellValue(12, 5) as number,
      f14: luckysheet.getCellValue(13, 5) as number,
      f17: luckysheet.getCellValue(16, 5) as number,
      f19: luckysheet.getCellValue(18, 5) as number,
      f20: luckysheet.getCellValue(19, 5) as number,
      f21: luckysheet.getCellValue(20, 5) as number,
      f22: luckysheet.getCellValue(21, 5) as number,
      f23: luckysheet.getCellValue(22, 5) as number,
      f24: luckysheet.getCellValue(23, 5) as number,
      f26: luckysheet.getCellValue(25, 5) as number,
      f27: luckysheet.getCellValue(26, 5) as number,
    };
    dispatch(setS3DB(s3db));

    // Update s4db
    luckysheet.setSheetActive(SheetIndex.S4DB);
    const s4db: S4DB = {
      s3: luckysheet.getCellValue(2, 18) as number,
      s5: luckysheet.getCellValue(4, 18) as number,
      s6: luckysheet.getCellValue(5, 18) as number,
      s7: luckysheet.getCellValue(6, 18) as number,
      s8: luckysheet.getCellValue(7, 18) as number,
      s9: luckysheet.getCellValue(8, 18) as number,
      s10: luckysheet.getCellValue(9, 18) as number,
      s11: luckysheet.getCellValue(10, 18) as number,
      s13: luckysheet.getCellValue(12, 18) as number,
      s15: luckysheet.getCellValue(14, 18) as number,
      s16: luckysheet.getCellValue(15, 18) as number,
      s17: luckysheet.getCellValue(16, 18) as number,
      s18: luckysheet.getCellValue(17, 18) as number,
      s19: luckysheet.getCellValue(18, 18) as number,
      s20: luckysheet.getCellValue(19, 18) as number,
      s21: luckysheet.getCellValue(20, 18) as number,
      s22: luckysheet.getCellValue(21, 18) as number,
      s23: luckysheet.getCellValue(22, 18) as number,
    };
    dispatch(setS4DB(s4db));

    // Update s5db
    luckysheet.setSheetActive(SheetIndex.S5DB);
    const s5db: S5DB = {
      s4: luckysheet.getCellValue(3, 18) as number,
      s5: luckysheet.getCellValue(4, 18) as number,
      s7: luckysheet.getCellValue(6, 18) as number,
      u7: luckysheet.getCellValue(6, 20) as number,
      s9: luckysheet.getCellValue(8, 18) as number,
      u9: luckysheet.getCellValue(8, 20) as number,
      s10: luckysheet.getCellValue(9, 18) as number,
      u10: luckysheet.getCellValue(9, 20) as number,
      s11: luckysheet.getCellValue(10, 18) as number,
      u11: luckysheet.getCellValue(10, 20) as number,
      s12: luckysheet.getCellValue(11, 18) as number,
      u12: luckysheet.getCellValue(11, 20) as number,
      s15: luckysheet.getCellValue(14, 18) as number,
      u15: luckysheet.getCellValue(14, 20) as number,
      s16: luckysheet.getCellValue(15, 18) as number,
      u16: luckysheet.getCellValue(15, 20) as number,
      s17: luckysheet.getCellValue(16, 18) as number,
      u17: luckysheet.getCellValue(16, 20) as number,
      s18: luckysheet.getCellValue(17, 18) as number,
      u18: luckysheet.getCellValue(17, 20) as number,
      s20: luckysheet.getCellValue(19, 18) as number,
      s21: luckysheet.getCellValue(20, 18) as number,
    };
    dispatch(setS5DB(s5db));

    // Update s6db
    luckysheet.setSheetActive(SheetIndex.S6DB);
    const s6DB: S6DB = {
      b3: luckysheet.getCellValue(2, 1, { type: 'm' }) as string,
      b4: luckysheet.getCellValue(3, 1, { type: 'm' }) as string,
      b5: luckysheet.getCellValue(4, 1, { type: 'm' }) as string,
      b6: luckysheet.getCellValue(5, 1, { type: 'm' }) as string,
      b8: luckysheet.getCellValue(7, 1, { type: 'm' }) as string,
      b9: luckysheet.getCellValue(8, 1, { type: 'm' }) as string,
      b10: luckysheet.getCellValue(9, 1, { type: 'm' }) as string,
      b11: luckysheet.getCellValue(10, 1, { type: 'm' }) as string,
    };
    dispatch(setS6DB(s6DB));

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
