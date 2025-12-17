// 00-site
import type { Task } from './task.ts';

export interface SiteResult {
  site_area_total: number;
  site_roads_area: number;
}

// 01-streets
export interface StreetsResult {
  road_len_art_100: number | null;
  road_len_sec_100: number | null;
  road_len_loc_100: number | null;
  road_len_art_50: number | null;
  road_len_sec_50: number | null;
  road_len_loc_50: number | null;
  road_area_art: number | null;
  road_area_sec: number | null;
  road_area_loc: number | null;
}

// 02-cluster
export interface ClusterResult {
  extend: boolean | null;
}

// 03-public
export interface PublicResult {
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
  og_clus0_on_art_num: number | null;
  og_clus0_on_sec_num: number | null;
  og_clus0_on_loc_num: number | null;
  og_clus1_on_loc_num: number | null;
  og_clus2_on_loc_num: number | null;
}

// 04-subdivision
export interface SubdivisionResult {
  // type='entry0'
  // cluster_type=art
  og_entr0_on_art_area: number | null;
  // cluster_type=sec
  og_entr0_on_sec_area: number | null;
  // cluster_type=loc
  og_entr0_on_loc_area: number | null;
  // type='entry1'
  // cluster_type=loc
  og_entr1_on_loc_area: number | null;
}

// 05-footprint
export interface FootprintResult {
  // OFF GRID LOT NUMBERS
  // type='off_grid0'
  // cluster_type=art
  og_lot0_on_art_num: number | null;
  // cluster_type=sec
  og_lot0_on_sec_num: number | null;
  // cluster_type=loc
  og_lot0_on_loc_num: number | null;
  // type='off_grid1'
  // cluster_type=loc
  og_lot1_on_loc_num: number | null;
  // type='off_grid2
  // cluster_type=loc
  og_lot2_on_loc_num: number | null;

  // PATH TYPES
  // type='path0'
  // cluster_type=art
  og_path0_on_art_area: number | null;
  // cluster_type=sec
  og_path0_on_sec_area: number | null;
  // cluster_type=loc
  og_path0_on_loc_area: number | null;
  // type='path1'
  // cluster_type=loc
  og_path1_on_loc_area: number | null;
  // type='path2'
  // cluster_type=loc
  og_path2_on_loc_area: number | null;

  // GREEN TYPES
  // type='green0'
  // cluster_type=art
  og_green0_on_art_area: number | null;
  // cluster_type=sec
  og_green0_on_sec_area: number | null;
  // cluster_type=loc
  og_green0_on_loc_area: number | null;
  // type='green1'
  // cluster_type=loc
  og_green1_on_loc_area: number | null;
  // type='green2'
  // cluster_type=loc
  og_green2_on_loc_area: number | null;

  // These are formula calculations
  og_clus0_on_art_con: number | null;
  og_clus0_on_sec_con: number | null;
  og_clus0_on_loc_con: number | null;
  og_clus1_on_loc_con: number | null;
  og_clus2_on_loc_con: number | null;
}

// 06-building_start
export interface BuildingStartResult {
  extend: boolean | null;
}

// 07-building_max
export interface BuildingMaxResult {
  extend: boolean | null;
}

// Export all interfaces
export type { Site, Streets, Clusters, Public, Subdivision, Footprint, BuildingStart, BuildingMax };

// STEP INTERFACES
export interface Step {
  file: string | null;
  task: Task | null;
  financial: null;
}

interface StepSite extends Step {
  financial: SiteResult;
}

interface StepStreet extends Step {
  financial: StreetsResult;
}

interface StepCluster extends Step {
  financial: ClusterResult;
}

interface StepPublic extends Step {
  financial: PublicResult;
}

interface StepSubdivision extends Step {
  financial: SubdivisionResult;
}

interface StepFootprint extends Step {
  financial: FootprintResult;
}

interface StepBuildingStart extends Step {
  financial: BuildingStartResult;
}

interface StepBuildingMax extends Step {
  financial: BuildingMaxResult;
}

export interface StepState {
  step: Step | null;
  loading: boolean;
  error: string | null;
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
