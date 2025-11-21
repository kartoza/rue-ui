export const OptionType = {
  CityScaleProforma: 'CityScaleProforma',
  NeighborhoodScaleProforma: 'NeighborhoodScaleProforma',
  OffGridClustersProforma: 'OffGridClustersProforma',
  StarterBuildingsProforma: 'StarterBuildingsProforma',
  DwellingsProformaAffordability: 'DwellingsProformaAffordability',
  DemographicForecast: 'DemographicForecast',
} as const;

export type OptionType = (typeof OptionType)[keyof typeof OptionType];

export const LABELS: Record<OptionType, string> = {
  CityScaleProforma: 'City scale Proforma',
  NeighborhoodScaleProforma: 'Neighborhood scale Proforma',
  OffGridClustersProforma: 'Off-grid Clusters Proforma',
  StarterBuildingsProforma: 'Starter Buildings Proforma',
  DwellingsProformaAffordability: 'Dwellings Proforma & Affordability',
  DemographicForecast: 'Demographic forecast',
};
