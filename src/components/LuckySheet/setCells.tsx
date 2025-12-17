import type { ProjectParameters } from '../../redux/reducers/project';
import { type LuckySheetGlobal } from './types.ts';
import type {
  FootprintResult,
  PublicResult,
  SiteResult,
  StreetsResult,
  SubdivisionResult,
} from '../../redux/reducers/step';

export function setCells(
  luckySheet: LuckySheetGlobal,
  siteResult: SiteResult,
  streetsResult: StreetsResult,
  publicResult: PublicResult,
  subdivisionResult: SubdivisionResult,
  footprintResult: FootprintResult,
  parameters: ProjectParameters
) {
  if (!luckySheet) return;

  const C = siteResult;
  const S = streetsResult;
  const N = publicResult;
  const D = subdivisionResult;
  const T = footprintResult;
  if (!C || !S || !N || !T || !parameters) return;

  luckySheet.setCellValue(52, 1, C.site_roads_area / 10000, { isRefresh: false });
  luckySheet.setCellValue(63, 1, C.site_area_total, { isRefresh: false });

  //* Streets to Q  */
  //C3-C5
  luckySheet.setCellValue(2, 2, S.road_len_art_100, { isRefresh: false });
  luckySheet.setCellValue(3, 2, S.road_len_sec_100, { isRefresh: false });
  luckySheet.setCellValue(4, 2, S.road_len_loc_100, { isRefresh: false });
  //D3-D5
  luckySheet.setCellValue(2, 3, S.road_len_art_50, { isRefresh: false });
  luckySheet.setCellValue(3, 3, S.road_len_sec_50, { isRefresh: false });
  luckySheet.setCellValue(4, 3, S.road_len_loc_50, { isRefresh: false });
  //G33-G35
  luckySheet.setCellValue(32, 6, S.road_area_art, { isRefresh: false });
  luckySheet.setCellValue(33, 6, S.road_area_sec, { isRefresh: false });
  luckySheet.setCellValue(34, 6, S.road_area_loc, { isRefresh: false });

  //* Public to Q  */
  //L14-L17
  luckySheet.setCellValue(13, 11, N.open_art_art_area, { isRefresh: false });
  luckySheet.setCellValue(14, 11, N.open_art_sec_area, { isRefresh: false });
  luckySheet.setCellValue(15, 11, N.open_art_loc_area, { isRefresh: false });
  luckySheet.setCellValue(16, 11, N.open_art_area, { isRefresh: false });
  //L19-L21
  luckySheet.setCellValue(18, 11, N.open_sec_sec_area, { isRefresh: false });
  luckySheet.setCellValue(19, 11, N.open_sec_loc_area, { isRefresh: false });
  luckySheet.setCellValue(20, 11, N.open_sec_area, { isRefresh: false });
  //L23-L24
  luckySheet.setCellValue(22, 11, N.open_loc_loc_area, { isRefresh: false });
  luckySheet.setCellValue(23, 11, N.open_loc_area, { isRefresh: false });
  //L26-L30
  luckySheet.setCellValue(25, 11, N.open_og_clus0_on_art_area, { isRefresh: false });
  luckySheet.setCellValue(26, 11, N.open_og_clus0_on_sec_area, { isRefresh: false });
  luckySheet.setCellValue(27, 11, N.open_og_clus0_on_loc_area, { isRefresh: false });
  luckySheet.setCellValue(28, 11, N.open_og_clus1_on_loc_area, { isRefresh: false });
  luckySheet.setCellValue(29, 11, N.open_og_clus2_on_loc_area, { isRefresh: false });
  //M14-M17
  luckySheet.setCellValue(13, 12, N.amen_art_art_area, { isRefresh: false });
  luckySheet.setCellValue(14, 12, N.amen_art_sec_area, { isRefresh: false });
  luckySheet.setCellValue(15, 12, N.amen_art_loc_area, { isRefresh: false });
  luckySheet.setCellValue(16, 12, N.amen_art_area, { isRefresh: false });
  //M19-M21
  luckySheet.setCellValue(18, 12, N.amen_sec_sec_area, { isRefresh: false });
  luckySheet.setCellValue(19, 12, N.amen_sec_loc_area, { isRefresh: false });
  luckySheet.setCellValue(20, 12, N.amen_sec_area, { isRefresh: false });
  //M23-M24
  luckySheet.setCellValue(22, 12, N.amen_loc_loc_area, { isRefresh: false });
  luckySheet.setCellValue(23, 12, N.amen_loc_area, { isRefresh: false });
  //M26-M30
  luckySheet.setCellValue(25, 12, N.amen_og_clus0_on_art_area, { isRefresh: false });
  luckySheet.setCellValue(26, 12, N.amen_og_clus0_on_sec_area, { isRefresh: false });
  luckySheet.setCellValue(27, 12, N.amen_og_clus0_on_loc_area, { isRefresh: false });
  luckySheet.setCellValue(28, 12, N.amen_og_clus1_on_loc_area, { isRefresh: false });
  luckySheet.setCellValue(29, 12, N.amen_og_clus2_on_loc_area, { isRefresh: false });
  //O14-O17
  luckySheet.setCellValue(13, 14, N.lot_art_art_area, { isRefresh: false });
  luckySheet.setCellValue(14, 14, N.lot_art_sec_area, { isRefresh: false });
  luckySheet.setCellValue(15, 14, N.lot_art_loc_area, { isRefresh: false });
  luckySheet.setCellValue(16, 14, N.lot_art_area, { isRefresh: false });
  //O19-O21
  luckySheet.setCellValue(18, 14, N.lot_sec_sec_area, { isRefresh: false });
  luckySheet.setCellValue(19, 14, N.lot_sec_loc_area, { isRefresh: false });
  luckySheet.setCellValue(20, 14, N.lot_sec_area, { isRefresh: false });
  //O23-O24
  luckySheet.setCellValue(22, 14, N.lot_loc_loc_area, { isRefresh: false });
  luckySheet.setCellValue(23, 14, N.lot_loc_area, { isRefresh: false });
  //O25-O30
  luckySheet.setCellValue(25, 14, N.og_clus0_on_art_area, { isRefresh: false });
  luckySheet.setCellValue(26, 14, N.og_clus0_on_sec_area, { isRefresh: false });
  luckySheet.setCellValue(27, 14, N.og_clus0_on_loc_area, { isRefresh: false });
  luckySheet.setCellValue(28, 14, N.og_clus1_on_loc_area, { isRefresh: false });
  luckySheet.setCellValue(29, 14, N.og_clus2_on_loc_area, { isRefresh: false });
  //X14-X17
  luckySheet.setCellValue(13, 23, N.lot_art_art_num, { isRefresh: false });
  luckySheet.setCellValue(14, 23, N.lot_art_sec_num, { isRefresh: false });
  luckySheet.setCellValue(15, 23, N.lot_art_loc_num, { isRefresh: false });
  luckySheet.setCellValue(16, 23, N.lot_art_num, { isRefresh: false });
  //X19-X21
  luckySheet.setCellValue(18, 23, N.lot_sec_sec_num, { isRefresh: false });
  luckySheet.setCellValue(19, 23, N.lot_sec_loc_num, { isRefresh: false });
  luckySheet.setCellValue(20, 23, N.lot_sec_num, { isRefresh: false });
  //X23-X24
  luckySheet.setCellValue(22, 23, N.lot_loc_loc_num, { isRefresh: false });
  luckySheet.setCellValue(23, 23, N.lot_loc_num, { isRefresh: false });
  //C45-C49
  luckySheet.setCellValue(44, 2, N.og_clus0_on_art_num, { isRefresh: false });
  luckySheet.setCellValue(45, 2, N.og_clus0_on_sec_num, { isRefresh: false });
  luckySheet.setCellValue(46, 2, N.og_clus0_on_loc_num, { isRefresh: false });
  luckySheet.setCellValue(47, 2, N.og_clus1_on_loc_num, { isRefresh: false });
  luckySheet.setCellValue(48, 2, N.og_clus2_on_loc_num, { isRefresh: false });

  //Q37
  // TODO:
  //  It seems it has formula
  // luckySheet.setCellValue(36, 16, N.site_total_area, { isRefresh: false });

  //V28
  // luckySheet.setCellValue(27, 21, N.param_ogc_w, { isRefresh: false });
  luckySheet.setCellValue(27, 21, parameters.neighbourhood.off_grid_partitions.cluster_width_m, {
    isRefresh: false,
  });
  //Y17, Y21, Y24
  // luckySheet.setCellValue(16, 24, N.param_lot_art_d, { isRefresh: false });
  // luckySheet.setCellValue(20, 24, N.param_lot_sec_d, { isRefresh: false });
  // luckySheet.setCellValue(23, 24, N.param_lot_loc_d, { isRefresh: false });
  luckySheet.setCellValue(
    16,
    24,
    parameters.neighbourhood.on_grid_partitions.depth_along_arteries_m,
    { isRefresh: false }
  );
  luckySheet.setCellValue(
    20,
    24,
    parameters.neighbourhood.on_grid_partitions.depth_along_secondaries_m,
    { isRefresh: false }
  );
  luckySheet.setCellValue(
    23,
    24,
    parameters.neighbourhood.on_grid_partitions.depth_along_locals_m,
    { isRefresh: false }
  );
  //Z17, Z21, Z24
  // luckySheet.setCellValue(16, 25, N.param_lot_art_w, { isRefresh: false }); On grid plots: Width along arterial roads
  // luckySheet.setCellValue(20, 25, N.param_lot_sec_w, { isRefresh: false }); On grid plots: Width along secondary roads
  // luckySheet.setCellValue(23, 25, N.param_lot_loc_w, { isRefresh: false }); On grid plots: Width along local roads
  luckySheet.setCellValue(16, 25, parameters.neighbourhood.off_grid_partitions.cluster_width_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(20, 25, parameters.neighbourhood.off_grid_partitions.cluster_width_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(23, 25, parameters.neighbourhood.off_grid_partitions.cluster_width_m, {
    isRefresh: false,
  });

  // TODO:
  // TODO:
  //  This financial is not implemented yet.
  //G45-G48
  luckySheet.setCellValue(44, 6, D.og_entr0_on_art_area, { isRefresh: false });
  luckySheet.setCellValue(45, 6, D.og_entr0_on_sec_area, { isRefresh: false });
  luckySheet.setCellValue(46, 6, D.og_entr0_on_loc_area, { isRefresh: false });
  luckySheet.setCellValue(47, 6, D.og_entr1_on_loc_area, { isRefresh: false });
  //* Tissue to Q  */
  //X26-X30
  luckySheet.setCellValue(25, 23, T.og_lot0_on_art_num, { isRefresh: false });
  luckySheet.setCellValue(26, 23, T.og_lot0_on_sec_num, { isRefresh: false });
  luckySheet.setCellValue(27, 23, T.og_lot0_on_loc_num, { isRefresh: false });
  luckySheet.setCellValue(28, 23, T.og_lot1_on_loc_num, { isRefresh: false });
  luckySheet.setCellValue(29, 23, T.og_lot2_on_loc_num, { isRefresh: false });
  //D45-D49
  luckySheet.setCellValue(44, 3, T.og_clus0_on_art_con, { isRefresh: false });
  luckySheet.setCellValue(45, 3, T.og_clus0_on_sec_con, { isRefresh: false });
  luckySheet.setCellValue(46, 3, T.og_clus0_on_loc_con, { isRefresh: false });
  luckySheet.setCellValue(47, 3, T.og_clus1_on_loc_con, { isRefresh: false });
  luckySheet.setCellValue(48, 3, T.og_clus2_on_loc_con, { isRefresh: false });
  //H45-H49
  luckySheet.setCellValue(44, 7, T.og_path0_on_art_area, { isRefresh: false });
  luckySheet.setCellValue(45, 7, T.og_path0_on_sec_area, { isRefresh: false });
  luckySheet.setCellValue(46, 7, T.og_path0_on_loc_area, { isRefresh: false });
  luckySheet.setCellValue(47, 7, T.og_path1_on_loc_area, { isRefresh: false });
  luckySheet.setCellValue(48, 7, T.og_path2_on_loc_area, { isRefresh: false });
  //I45-I49
  luckySheet.setCellValue(44, 8, T.og_green0_on_art_area, { isRefresh: false });
  luckySheet.setCellValue(45, 8, T.og_green0_on_sec_area, { isRefresh: false });
  luckySheet.setCellValue(46, 8, T.og_green0_on_loc_area, { isRefresh: false });
  luckySheet.setCellValue(47, 8, T.og_green1_on_loc_area, { isRefresh: false });
  luckySheet.setCellValue(48, 8, T.og_green2_on_loc_area, { isRefresh: false });
  //W28, W30
  // luckySheet.setCellValue(27, 22, T.param_og_path_w, { isRefresh: false });
  // luckySheet.setCellValue(29, 22, T.param_og2_path_w, { isRefresh: false });
  luckySheet.setCellValue(27, 22, parameters.tissue.off_grid_cluster_type_1.internal_path_width_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(29, 22, parameters.tissue.off_grid_cluster_type_2.internal_path_width_m, {
    isRefresh: false,
  });
  //Z27, Z28, Z30
  // luckySheet.setCellValue(26, 25, T.param_lot_og_on_sec_w, { isRefresh: false });
  // luckySheet.setCellValue(27, 25, T.param_lot_og_on_loc_w, { isRefresh: false });
  // luckySheet.setCellValue(29, 25, T.param_lot_og2_w, { isRefresh: false });
  luckySheet.setCellValue(26, 25, parameters.tissue.on_grid_lots_on_secondaries.width_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(27, 25, parameters.tissue.on_grid_lots_on_locals.width_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(29, 25, parameters.tissue.off_grid_cluster_type_2.lot_width_m, {
    isRefresh: false,
  });
  //AB17, AB21, AB24, AB27, AB28, AB30
  // luckySheet.setCellValue(16, 27, T.param_lot_art_fsb, { isRefresh: false });
  // luckySheet.setCellValue(20, 27, T.param_lot_sec_fsb, { isRefresh: false });
  // luckySheet.setCellValue(23, 27, T.param_lot_loc_fsb, { isRefresh: false });
  // luckySheet.setCellValue(26, 27, T.param_lot_og_on_sec_fsb, { isRefresh: false });
  // luckySheet.setCellValue(27, 27, T.param_lot_og_on_loc_fsb, { isRefresh: false });
  // luckySheet.setCellValue(28, 27, T.param_lot_og2_fsb, { isRefresh: false });
  luckySheet.setCellValue(16, 27, parameters.tissue.on_grid_lots_on_arteries.front_setback_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(20, 27, parameters.tissue.on_grid_lots_on_secondaries.front_setback_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(23, 27, parameters.tissue.on_grid_lots_on_locals.front_setback_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(26, 27, parameters.tissue.off_grid_cluster_type_1.front_setback_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(27, 27, parameters.tissue.off_grid_cluster_type_1.front_setback_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(28, 27, parameters.tissue.off_grid_cluster_type_1.front_setback_m, {
    isRefresh: false,
  });
  //AC17, AC21, AC24, AC27, AC28, AC30
  // luckySheet.setCellValue(16, 28, T.param_lot_art_bsb, { isRefresh: false });
  // luckySheet.setCellValue(20, 28, T.param_lot_sec_bsb, { isRefresh: false });
  // luckySheet.setCellValue(23, 28, T.param_lot_loc_bsb, { isRefresh: false });
  // luckySheet.setCellValue(26, 28, T.param_lot_og_on_sec_bsb, { isRefresh: false });
  // luckySheet.setCellValue(27, 28, T.param_lot_og_on_loc_bsb, { isRefresh: false });
  // luckySheet.setCellValue(28, 28, T.param_lot_og2_bsb, { isRefresh: false });
  luckySheet.setCellValue(16, 28, parameters.tissue.on_grid_lots_on_arteries.rear_setback_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(20, 28, parameters.tissue.on_grid_lots_on_secondaries.rear_setback_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(23, 28, parameters.tissue.on_grid_lots_on_locals.rear_setback_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(26, 28, parameters.tissue.off_grid_cluster_type_1.rear_setback_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(27, 28, parameters.tissue.off_grid_cluster_type_1.rear_setback_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(28, 28, parameters.tissue.off_grid_cluster_type_1.rear_setback_m, {
    isRefresh: false,
  });
  //AE17, AE21, AE24, AE27, AE28, AE30
  // luckySheet.setCellValue(16, 30, T.param_lot_art_ssb, { isRefresh: false });
  // luckySheet.setCellValue(20, 30, T.param_lot_sec_ssb, { isRefresh: false });
  // luckySheet.setCellValue(23, 30, T.param_lot_loc_ssb, { isRefresh: false });
  // luckySheet.setCellValue(26, 30, T.param_lot_og_on_sec_ssb, { isRefresh: false });
  // luckySheet.setCellValue(27, 30, T.param_lot_og_on_loc_ssb, { isRefresh: false });
  // luckySheet.setCellValue(28, 30, T.param_lot_og2_ssb, { isRefresh: false });
  luckySheet.setCellValue(16, 30, parameters.tissue.on_grid_lots_on_arteries.side_margins_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(20, 30, parameters.tissue.on_grid_lots_on_secondaries.side_margins_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(23, 30, parameters.tissue.on_grid_lots_on_locals.side_margins_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(26, 30, parameters.tissue.off_grid_cluster_type_1.side_margins_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(27, 30, parameters.tissue.off_grid_cluster_type_1.side_margins_m, {
    isRefresh: false,
  });
  luckySheet.setCellValue(28, 30, parameters.tissue.off_grid_cluster_type_1.side_margins_m, {
    isRefresh: false,
  });
  //AI17, AI21, AI24, AI28
  // luckySheet.setCellValue(16, 34, T.param_lot_art_f, { isRefresh: false });
  // luckySheet.setCellValue(20, 34, T.param_lot_sec_f, { isRefresh: false });
  // luckySheet.setCellValue(23, 34, T.param_lot_loc_f, { isRefresh: false });
  // luckySheet.setCellValue(27, 34, T.param_lot_og_f, { isRefresh: false });
  luckySheet.setCellValue(16, 34, parameters.tissue.on_grid_lots_on_arteries.number_of_floors, {
    isRefresh: false,
  });
  luckySheet.setCellValue(20, 34, parameters.tissue.on_grid_lots_on_secondaries.number_of_floors, {
    isRefresh: false,
  });
  luckySheet.setCellValue(23, 34, parameters.tissue.on_grid_lots_on_locals.number_of_floors, {
    isRefresh: false,
  });
  luckySheet.setCellValue(27, 34, parameters.tissue.off_grid_cluster_type_1.number_of_floors, {
    isRefresh: false,
  });
  //AJ14, AJ15, AJ16
  luckySheet.setCellValue(13, 35, parameters.tissue.corner_bonus.with_artery_percent / 100, {
    isRefresh: false,
  });
  luckySheet.setCellValue(14, 35, parameters.tissue.corner_bonus.with_secondary_percent / 100, {
    isRefresh: false,
  });
  luckySheet.setCellValue(15, 35, parameters.tissue.corner_bonus.with_local_percent / 100);

  //AO14, AP14, AQ14
  luckySheet.setCellValue(
    13,
    40,
    parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_other_artery
      .initial_width_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    13,
    41,
    parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_other_artery
      .initial_depth_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    13,
    42,
    parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_other_artery
      .initial_floors_percent / 100,
    {
      isRefresh: false,
    }
  );
  //AO15, AP15, AQ15
  luckySheet.setCellValue(
    14,
    40,
    parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_secondary
      .initial_width_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    14,
    41,
    parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_secondary
      .initial_depth_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    14,
    42,
    parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_secondary
      .initial_floors_percent / 100,
    {
      isRefresh: false,
    }
  );
  //AO16, AP16, AQ16
  luckySheet.setCellValue(
    15,
    40,
    parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_tertiary
      .initial_width_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    15,
    41,
    parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_tertiary
      .initial_depth_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    15,
    42,
    parameters?.starter_buildings.on_grid_lots_on_arteries.corner_with_tertiary
      .initial_floors_percent / 100,
    {
      isRefresh: false,
    }
  );
  //AO17, AP17, AQ17
  luckySheet.setCellValue(
    16,
    40,
    parameters?.starter_buildings.on_grid_lots_on_arteries.regular_lot.initial_width_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    16,
    41,
    parameters?.starter_buildings.on_grid_lots_on_arteries.regular_lot.initial_depth_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    16,
    42,
    parameters?.starter_buildings.on_grid_lots_on_arteries.regular_lot.initial_floors_percent / 100,
    {
      isRefresh: false,
    }
  );
  //AO19, AP19, AQ19
  luckySheet.setCellValue(
    18,
    40,
    parameters?.starter_buildings.on_grid_lots_on_secondaries.corner_with_other_secondary
      .initial_width_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    18,
    41,
    parameters?.starter_buildings.on_grid_lots_on_secondaries.corner_with_other_secondary
      .initial_depth_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    18,
    42,
    parameters?.starter_buildings.on_grid_lots_on_secondaries.corner_with_other_secondary
      .initial_floors_percent / 100,
    {
      isRefresh: false,
    }
  );
  //AO20, AP20, AQ20
  luckySheet.setCellValue(
    19,
    40,
    parameters?.starter_buildings.on_grid_lots_on_secondaries.corner_with_tertiary
      .initial_width_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    19,
    41,
    parameters?.starter_buildings.on_grid_lots_on_secondaries.corner_with_tertiary
      .initial_depth_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    19,
    42,
    parameters?.starter_buildings.on_grid_lots_on_secondaries.corner_with_tertiary
      .initial_floors_percent / 100,
    {
      isRefresh: false,
    }
  );
  //AO21, AP21, AQ21
  luckySheet.setCellValue(
    20,
    40,
    parameters?.starter_buildings.on_grid_lots_on_secondaries.regular_lot.initial_width_percent /
      100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    20,
    41,
    parameters?.starter_buildings.on_grid_lots_on_secondaries.regular_lot.initial_depth_percent /
      100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    20,
    42,
    parameters?.starter_buildings.on_grid_lots_on_secondaries.regular_lot.initial_floors_percent /
      100,
    {
      isRefresh: false,
    }
  );
  //AO23, AP23, AQ23
  luckySheet.setCellValue(
    22,
    40,
    parameters?.starter_buildings.on_grid_lots_on_locals.corner_with_other_local
      .initial_width_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    22,
    41,
    parameters?.starter_buildings.on_grid_lots_on_locals.corner_with_other_local
      .initial_depth_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    22,
    42,
    parameters?.starter_buildings.on_grid_lots_on_locals.corner_with_other_local
      .initial_floors_percent / 100,
    {
      isRefresh: false,
    }
  );
  //AO24, AP24, AQ24
  luckySheet.setCellValue(
    23,
    40,
    parameters?.starter_buildings.on_grid_lots_on_locals.regular_lot.initial_width_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    23,
    41,
    parameters?.starter_buildings.on_grid_lots_on_locals.regular_lot.initial_depth_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    23,
    42,
    parameters?.starter_buildings.on_grid_lots_on_locals.regular_lot.initial_floors_percent / 100,
    {
      isRefresh: false,
    }
  );
  //AO28, AP28, AQ28
  luckySheet.setCellValue(
    27,
    40,
    parameters?.starter_buildings.off_grid_cluster_type_1.initial_width_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    27,
    41,
    parameters?.starter_buildings.off_grid_cluster_type_1.initial_depth_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    27,
    42,
    parameters?.starter_buildings.off_grid_cluster_type_1.initial_floors_percent / 100,
    {
      isRefresh: false,
    }
  );
  //AO30, AP30, AQ30
  luckySheet.setCellValue(
    29,
    40,
    parameters?.starter_buildings.off_grid_cluster_type_2.initial_width_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    29,
    41,
    parameters?.starter_buildings.off_grid_cluster_type_2.initial_depth_percent / 100,
    {
      isRefresh: false,
    }
  );
  luckySheet.setCellValue(
    29,
    42,
    parameters?.starter_buildings.off_grid_cluster_type_2.initial_floors_percent / 100
  );
  luckySheet.refreshFormula();
}
