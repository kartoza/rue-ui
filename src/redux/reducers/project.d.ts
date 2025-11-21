import type { SerializedError } from '@reduxjs/toolkit';
import type {
  StepBuildingMaxState,
  StepBuildingStartState,
  StepClusterState,
  StepFootprintState,
  StepPublicState,
  StepSiteState,
  StepStreetState,
  StepSubdivisionState,
} from './step';

// -------------------------
// For payload
// -------------------------

interface ProjectParameters {
  neighbourhood: Neighbourhood;
  tissue: Tissue;
  starter_buildings: StarterBuildings;
}

interface Neighbourhood {
  public_roads: PublicRoads;
  on_grid_partitions: OnGridPartitions;
  off_grid_partitions: OffGridPartitions;
  urban_block_structure: UrbanBlockStructure;
  public_spaces: PublicSpaces;
}

interface PublicRoads {
  width_of_arteries_m: number;
  width_of_secondaries_m: number;
  width_of_locals_m: number;
}

interface OnGridPartitions {
  depth_along_arteries_m: number;
  depth_along_secondaries_m: number;
  depth_along_locals_m: number;
}

interface OffGridPartitions {
  cluster_depth_m: number;
  cluster_size_lots: number;
  cluster_width_m: number;
  lot_depth_along_path_m: number;
  lot_depth_around_yard_m: number;
}

interface UrbanBlockStructure {
  along_arteries: BlockStructureConfig;
  along_secondaries: BlockStructureConfig;
  along_locals: BlockStructureConfig;
}

interface BlockStructureConfig {
  off_grid_clusters_in_depth_m: number;
  off_grid_clusters_in_width_m: number;
}

interface PublicSpaces {
  open_spaces: OpenSpaces;
  amenities: Amenities;
  street_section: StreetSection;
  trees: Trees;
}

interface OpenSpaces {
  open_space_percentage: number;
}

interface Amenities {
  amenities_percentage: number;
}

interface StreetSection {
  sidewalk_width_m: number;
}

interface Trees {
  show_trees_frontend: boolean;
  tree_spacing_m: number;
  initial_tree_height_m: number;
  final_tree_height_m: number;
}

interface Tissue {
  on_grid_lots_on_arteries: LotConfiguration;
  on_grid_lots_on_secondaries: LotConfiguration;
  on_grid_lots_on_locals: LotConfiguration;
  off_grid_cluster_type_1: OffGridClusterType1;
  off_grid_cluster_type_2: OffGridClusterType2;
  corner_bonus: CornerBonus;
  fire_protection: FireProtection;
}

interface LotConfiguration {
  depth_m: number;
  width_m: number;
  front_setback_m: number;
  side_margins_m: number;
  rear_setback_m: number;
  number_of_floors: number;
}

interface OffGridClusterType1 {
  access_path_width_on_grid_m: number;
  internal_path_width_m: number;
  open_space_width_m: number;
  open_space_length_m: number;
  lot_width_m: number;
  front_setback_m: number;
  side_margins_m: number;
  rear_setback_m: number;
  number_of_floors: number;
}

interface OffGridClusterType2 {
  internal_path_width_m: number;
  cul_de_sac_width_m: number;
  lot_width_m: number;
  lot_depth_behind_cul_de_sac_m: number;
}

interface CornerBonus {
  description: string;
  with_artery_percent: number;
  with_secondary_percent: number;
  with_local_percent: number;
}

interface FireProtection {
  fire_proof_partitions_with_6m_margins: boolean;
}

interface StarterBuildings {
  on_grid_lots_on_arteries: StarterBuildingsByLotType;
  on_grid_lots_on_secondaries: StarterBuildingsBySecondaryLotType;
  on_grid_lots_on_locals: StarterBuildingsByLocalLotType;
  off_grid_cluster_type_1: StarterBuildingConfig;
  off_grid_cluster_type_2: StarterBuildingConfig;
}

interface StarterBuildingsByLotType {
  corner_with_other_artery: StarterBuildingConfig;
  corner_with_secondary: StarterBuildingConfig;
  corner_with_tertiary: StarterBuildingConfig;
  regular_lot: StarterBuildingConfig;
}

interface StarterBuildingsBySecondaryLotType {
  corner_with_other_secondary: StarterBuildingConfig;
  corner_with_tertiary: StarterBuildingConfig;
  regular_lot: StarterBuildingConfig;
}

interface StarterBuildingsByLocalLotType {
  corner_with_other_local: StarterBuildingConfig;
  regular_lot: StarterBuildingConfig;
}

interface StarterBuildingConfig {
  initial_width_percent: number;
  initial_depth_percent: number;
  initial_floors_percent: number;
}

// -------------------------
// For reducers and payload
// -------------------------
interface ProjectPayload {
  name: string;
  description: string;
  parameters: ProjectParameters;
}

interface Project {
  uuid: string | null;
  name: string | null;
  steps: {
    site: StepSiteState;
    streets: StepStreetState;
    clusters: StepClusterState;
    public: StepPublicState;
    subdivision: StepSubdivisionState;
    footprint: StepFootprintState;
    building_start: StepBuildingStartState;
    building_max: StepBuildingMaxState;
  };
}

interface ProjectState {
  project: Project | null;
  loading: boolean;
  error: SerializedError | null;
}
