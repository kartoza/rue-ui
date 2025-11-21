// 00-site
import type { Task } from './task.ts';
import type { SerializedError } from '@reduxjs/toolkit';

interface SiteResult {
  site_area_total: number;
  site_roads_area: number;
}

// 01-streets
// 02-cluster
// 04-subdivision
interface StreetsResult {
  road_len_art_100: number | null;
  road_len_sec_100: number | null;
  road_len_loc_100: number | null;
  road_len_art_50: number | null;
  road_len_sec_50: number | null;
  road_len_loc_50: number | null;
  open_art_art_area: number | null;
  open_art_sec_area: number | null;
  open_art_loc_area: number | null;
  open_art_area: number | null;
  open_sec_sec_area: number | null;
  open_sec_loc_area: number | null;
  open_sec_area: number | null;
  open_loc_loc_area: number | null;
  open_loc_area: number | null;
  open_og_clus0_on_art_area: number | null;
  open_og_clus0_on_sec_area: number | null;
  open_og_clus0_on_loc_area: number | null;
  open_og_clus1_on_loc_area: number | null;
  open_og_clus2_on_loc_area: number | null;
  open_total_area: number | null;
  amen_art_art_area: number | null;
  amen_art_sec_area: number | null;
  amen_art_loc_area: number | null;
  amen_art_area: number | null;
  amen_sec_sec_area: number | null;
  amen_sec_loc_area: number | null;
  amen_sec_area: number | null;
  amen_loc_loc_area: number | null;
  amen_loc_area: number | null;
  amen_og_clus0_on_art_area: number | null;
  amen_og_clus0_on_sec_area: number | null;
  amen_og_clus0_on_loc_area: number | null;
  amen_og_clus1_on_loc_area: number | null;
  amen_og_clus2_on_loc_area: number | null;
  amen_total_area: number | null;
  lot_art_art_area: number | null;
  lot_art_sec_area: number | null;
  lot_art_loc_area: number | null;
  lot_art_area: number | null;
  lot_sec_sec_area: number | null;
  lot_sec_loc_area: number | null;
  lot_sec_area: number | null;
  lot_loc_loc_area: number | null;
  lot_loc_area: number | null;
  og_clus0_on_art_area: number | null;
  og_clus0_on_sec_area: number | null;
  og_clus0_on_loc_area: number | null;
  og_clus1_on_loc_area: number | null;
  og_clus2_on_loc_area: number | null;
  lot_art_art_num: number | null;
  lot_art_sec_num: number | null;
  lot_art_loc_num: number | null;
  lot_art_num: number | null;
  lot_sec_sec_num: number | null;
  lot_sec_loc_num: number | null;
  lot_sec_num: number | null;
  lot_loc_loc_num: number | null;
  lot_loc_num: number | null;
  road_area_art: number | null;
  road_area_sec: number | null;
  road_area_loc: number | null;
  og_clus0_on_art_num: number | null;
  og_clus0_on_sec_num: number | null;
  og_clus0_on_loc_num: number | null;
  og_clus1_on_loc_num: number | null;
  og_clus2_on_loc_num: number | null;
  og_entr0_on_art_area: number | null;
  og_entr0_on_sec_area: number | null;
  og_entr0_on_loc_area: number | null;
  og_entr1_on_loc_area: number | null;
  site_total_area: number | null;
  param_ogc_w: number | null;
  param_lot_art_d: number | null;
  param_lot_sec_d: number | null;
  param_lot_loc_d: number | null;
  param_lot_art_w: number | null;
  param_lot_sec_w: number | null;
  param_lot_loc_w: number | null;
}

// 03-public
interface PublicResult {
  extend: boolean | null;
}

// 05-footprint
interface FootprintResult {
  og_lot0_on_art_num: number | null;
  og_lot0_on_sec_num: number | null;
  og_lot0_on_loc_num: number | null;
  og_lot1_on_loc_num: number | null;
  og_lot2_on_loc_num: number | null;
  og_clus0_on_art_con: number | null;
  og_clus0_on_sec_con: number | null;
  og_clus0_on_loc_con: number | null;
  og_clus1_on_loc_con: number | null;
  og_clus2_on_loc_con: number | null;
  og_path0_on_art_area: number | null;
  og_path0_on_sec_area: number | null;
  og_path0_on_loc_area: number | null;
  og_path1_on_loc_area: number | null;
  og_path2_on_loc_area: number | null;
  og_green0_on_art_area: number | null;
  og_green0_on_sec_area: number | null;
  og_green0_on_loc_area: number | null;
  og_green1_on_loc_area: number | null;
  og_green2_on_loc_area: number | null;
  param_og_path_w: number | null;
  param_og2_path_w: number | null;
  param_lot_og_on_sec_w: number | null;
  param_lot_og_on_loc_w: number | null;
  param_lot_og2_w: number | null;
  param_lot_art_fsb: number | null;
  param_lot_sec_fsb: number | null;
  param_lot_loc_fsb: number | null;
  param_lot_og_on_sec_fsb: number | null;
  param_lot_og_on_loc_fsb: number | null;
  param_lot_og2_fsb: number | null;
  param_lot_art_bsb: number | null;
  param_lot_sec_bsb: number | null;
  param_lot_loc_bsb: number | null;
  param_lot_og_on_sec_bsb: number | null;
  param_lot_og_on_loc_bsb: number | null;
  param_lot_og2_bsb: number | null;
  param_lot_art_ssb: number | null;
  param_lot_sec_ssb: number | null;
  param_lot_loc_ssb: number | null;
  param_lot_og_on_sec_ssb: number | null;
  param_lot_og_on_loc_ssb: number | null;
  param_lot_og2_ssb: number | null;
  param_lot_art_f: number | null;
  param_lot_sec_f: number | null;
  param_lot_loc_f: number | null;
  param_lot_og_f: number | null;
  param_lot_art_fm: number | null;
  param_lot_sec_fm: number | null;
  param_lot_loc_fm: number | null;
}

// 06-building_start
interface BuildingStartResult {
  param_pcen_art_art_w: number | null;
  param_pcen_art_sec_w: number | null;
  param_pcen_art_loc_w: number | null;
  param_pcen_art_w: number | null;
  param_pcen_sec_sec_w: number | null;
  param_pcen_sec_loc_w: number | null;
  param_pcen_sec_w: number | null;
  param_pcen_loc_loc_w: number | null;
  param_pcen_loc_w: number | null;
  param_pcen_og_w: number | null;
  param_pcen_og2_w: number | null;
  param_pcen_art_art_d: number | null;
  param_pcen_art_sec_d: number | null;
  param_pcen_art_loc_d: number | null;
  param_pcen_art_d: number | null;
  param_pcen_sec_sec_d: number | null;
  param_pcen_sec_loc_d: number | null;
  param_pcen_sec_d: number | null;
  param_pcen_loc_loc_d: number | null;
  param_pcen_loc_d: number | null;
  param_pcen_og_d: number | null;
  param_pcen_og2_d: number | null;
  param_pcen_art_art_f: number | null;
  param_pcen_art_sec_f: number | null;
  param_pcen_art_loc_f: number | null;
  param_pcen_art_f: number | null;
  param_pcen_sec_sec_f: number | null;
  param_pcen_sec_loc_f: number | null;
  param_pcen_sec_f: number | null;
  param_pcen_loc_loc_f: number | null;
  param_pcen_loc_f: number | null;
  param_pcen_og_f: number | null;
  param_pcen_og2_f: number | null;
}

// 07-building_max
interface BuildingMaxResult {
  extend: boolean | null;
}

// Export all interfaces
export type { Site, Streets, Clusters, Public, Subdivision, Footprint, BuildingStart, BuildingMax };

// STEP INTERFACES
export interface Step {
  file: string | null;
  task: Task | null;
  result: null;
}

interface StepSite extends Step {
  result: SiteResult;
}

interface StepStreet extends Step {
  result: StreetsResult;
}

interface StepCluster extends Step {
  result: StreetsResult;
}

interface StepPublic extends Step {
  result: PublicResult;
}

interface StepSubdivision extends Step {
  result: StreetsResult;
}

interface StepFootprint extends Step {
  result: FootprintResult;
}

interface StepBuildingStart extends Step {
  result: BuildingStartResult;
}

interface StepBuildingMax extends Step {
  result: BuildingMaxResult;
}

export interface StepState {
  step: Step | null;
  loading: boolean;
  error: SerializedError | null;
}

export interface StepSiteState extends StepState {
  step: StepSite;
}

export interface StepStreetState extends StepState {
  step: StepStreet;
}

export interface StepClusterState extends StepState {
  step: StepCluster;
}

export interface StepPublicState extends StepState {
  step: StepPublic;
}

export interface StepSubdivisionState extends StepState {
  step: StepSubdivision;
}

export interface StepFootprintState extends StepState {
  step: StepFootprint;
}

export interface StepBuildingStartState extends StepState {
  step: StepBuildingStart;
}

export interface StepBuildingMaxState extends StepState {
  step: StepBuildingMax;
}
