import { Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Accordion from 'react-bootstrap/Accordion';
import { Box, Button, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { FeatureCollection, LineString, Polygon } from 'geojson';
import { toaster, ToasterType } from '../Toaster/toaster';
import type { ProjectParameters, ProjectPayload } from '../../redux/reducers/project';
import type { AppDispatch } from '../../redux/store';
import { createProject } from '../../redux/reducers/projectSlice';
import NeighbourhoodPublicScapeOpenSpace from './Results/NeighbourhoodPublicScapeOpenSpace.tsx';
import NeighbourhoodPublicScapeAmenities from './Results/NeighbourhoodPublicScapeAmenities.tsx';
import {
  useCurrentProjectDone,
  useCurrentProjectState,
} from '../../redux/selectors/projectSelector.ts';
import DummySite from './SiteDefinitionInput/DummySite.tsx';
import LoadSite from './SiteDefinitionInput/LoadSite.tsx';
import { useCurrentStepUpdateLoading } from '../../redux/selectors/stepUpdateSelector.ts';
import { DrawingMode, setDrawingMode } from '../../redux/reducers/global.ts';

import projectParametersDefault from './general_input.json';

import './style.scss';

const DefinitionType = {
  vmc_demo: 'vmc_demo',
  draw_your_own: 'draw_your_own',
  load_site: 'load_site',
  dummy_site: 'dummy_site',
} as const;

type DefinitionType = (typeof DefinitionType)[keyof typeof DefinitionType];

const DEFINITION_LABELS: Record<DefinitionType, string> = {
  vmc_demo: 'VMC Demo',
  draw_your_own: 'Draw your own',
  load_site: 'Load site',
  dummy_site: 'Dummy Site',
};

export default function MapInputControls() {
  const dispatch = useDispatch<AppDispatch>();
  const isProjectDone = useCurrentProjectDone();
  const currentProject = useCurrentProjectState();
  const currentStepUpdateLoading = useCurrentStepUpdateLoading();

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [siteDefinition, setSiteDefinition] = useState<DefinitionType>(DefinitionType.vmc_demo);
  const [activeKeys, setActiveKeys] = useState<string[]>(['0', '0-0']);

  // Parameters
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string | null>('');

  const [parameters, setParameters] = useState<ProjectParameters>(projectParametersDefault);
  const [site, setSite] = useState<FeatureCollection<Polygon> | null>(null);
  const [roads, setRoads] = useState<FeatureCollection<LineString> | null>(null);

  const errors: string[] = [];
  switch (siteDefinition) {
    case DefinitionType.load_site:
      if (!site || !roads) {
        errors.push('Please select a site and roads in the city');
      }
  }
  if (!name) {
    errors.push('Please enter project name');
  }

  const isActive = (key: string) => activeKeys.includes(key);
  // Handle when according changed
  const handleSelect = (eventKey: string | string[] | null | undefined) => {
    if (Array.isArray(eventKey)) {
      setActiveKeys(eventKey);
    } else if (eventKey) {
      setActiveKeys([eventKey]);
    } else {
      setActiveKeys([]);
    }
  };

  // When project done, make submitted false
  useEffect(() => {
    if (isProjectDone) {
      setSubmitted(false);
    }
  }, [isProjectDone]);

  // When project done, make submitted false
  useEffect(() => {
    if (currentProject?.error) {
      setSubmitted(false);
      toaster.create({
        title: 'Failed',
        description: currentProject?.error,
        type: ToasterType.error,
      });
    }
    if (!currentProject.loading) {
      const project = currentProject.project;
      if (project) {
        setName(project.name);
        setDescription(project.description);
        if (project.parameters) {
          setParameters(project.parameters);
        }
      }
    }
  }, [currentProject]);

  // Apply the form
  const apply = () => {
    if (siteDefinition === DefinitionType.load_site) {
      if (!site || !roads) {
        toaster.create({
          title: 'Failed',
          description: 'Please select a site and roads in the city',
          type: ToasterType.error,
        });
        return;
      }
    }
    setSubmitted(true);

    const payload: ProjectPayload = {
      name: name,
      description: description,
      parameters: parameters,
    };
    if (site && roads) {
      payload.site = site;
      payload.roads = roads;
    }
    dispatch(createProject(payload));
  };

  return (
    <Box className="map-input-parent" style={{ position: 'relative' }}>
      <Box className="project-info-inputs">
        <Box className="input-field">
          <label htmlFor="project-name">Project Name</label>
          <input
            id="project-name"
            type="text"
            className="form-control"
            placeholder="Enter project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <Box className="input-field">
          <label htmlFor="project-description">Description</label>
          <textarea
            id="project-description"
            className="form-control"
            placeholder="Enter project description"
            rows={3}
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
      </Box>

      <Accordion activeKey={activeKeys} onSelect={handleSelect} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span className={`circle-number-lg${isActive('0') ? ' active' : ''}`}>1</span>City
          </Accordion.Header>
          <Accordion.Body>
            <Accordion
              activeKey={activeKeys}
              onSelect={handleSelect}
              alwaysOpen
              style={{ marginBottom: '10px' }}
            >
              <Accordion.Item eventKey="0-0">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('0-0') ? ' active' : ''}`}>1</span>
                  Site Definition
                </Accordion.Header>
                <Accordion.Body style={{ marginRight: '1rem' }}>
                  <select
                    className="form-control"
                    value={siteDefinition}
                    onChange={(e) => {
                      setSite(null);
                      setRoads(null);
                      setSiteDefinition(e.target.value as DefinitionType);
                      if (e.target.value === DefinitionType.draw_your_own) {
                        dispatch(setDrawingMode(DrawingMode.DRAW_SITE));
                      } else {
                        dispatch(setDrawingMode(null));
                      }
                    }}
                  >
                    {Object.entries(DEFINITION_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Accordion.Body>
              </Accordion.Item>
              {siteDefinition === DefinitionType.dummy_site && (
                <DummySite activeKeys={activeKeys} />
              )}
              {siteDefinition === DefinitionType.load_site && (
                <LoadSite setSite={setSite} setRoads={setRoads} />
              )}
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <span className={`circle-number-lg${isActive('1') ? ' active' : ''}`}>2</span>
            Neighbourhood
          </Accordion.Header>
          <Accordion.Body>
            <Accordion activeKey={activeKeys} onSelect={handleSelect} alwaysOpen>
              <Accordion.Item eventKey="1-0">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('1-0') ? ' active' : ''}`}>1</span>
                  Public roads
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col>
                      <label>
                        <span className={`circle-number-sm${isActive('1-0') ? ' active' : ''}`}>
                          1
                        </span>
                        Width of arteries
                      </label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.neighbourhood.public_roads.width_of_arteries_m}
                          onChange={(e) => {
                            parameters.neighbourhood.public_roads.width_of_arteries_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>
                        <span className={`circle-number-sm${isActive('1-0') ? ' active' : ''}`}>
                          2
                        </span>
                        Width of secondaries
                      </label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.neighbourhood.public_roads.width_of_secondaries_m}
                          onChange={(e) => {
                            parameters.neighbourhood.public_roads.width_of_secondaries_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>
                        <span className={`circle-number-sm${isActive('1-0') ? ' active' : ''}`}>
                          3
                        </span>
                        Width of locals
                      </label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.neighbourhood.public_roads.width_of_locals_m}
                          onChange={(e) => {
                            parameters.neighbourhood.public_roads.width_of_locals_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1-1">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('1-1') ? ' active' : ''}`}>2</span>
                  On-grid partitions
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col>
                      <label>
                        <span className={`circle-number-sm${isActive('1-1') ? ' active' : ''}`}>
                          1
                        </span>
                        Depth along arteries
                      </label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.neighbourhood.on_grid_partitions.depth_along_arteries_m}
                          onChange={(e) => {
                            parameters.neighbourhood.on_grid_partitions.depth_along_arteries_m =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>
                        <span className={`circle-number-sm${isActive('1-1') ? ' active' : ''}`}>
                          2
                        </span>
                        Depth along secondaries
                      </label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={
                            parameters.neighbourhood.on_grid_partitions.depth_along_secondaries_m
                          }
                          onChange={(e) => {
                            parameters.neighbourhood.on_grid_partitions.depth_along_secondaries_m =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>
                        <span className={`circle-number-sm${isActive('1-1') ? ' active' : ''}`}>
                          3
                        </span>
                        Depth along locals
                      </label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.neighbourhood.on_grid_partitions.depth_along_locals_m}
                          onChange={(e) => {
                            parameters.neighbourhood.on_grid_partitions.depth_along_locals_m =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1-2">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('1-2') ? ' active' : ''}`}>3</span>
                  Off-grid partitions
                </Accordion.Header>
                <Accordion.Body>
                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('1-2') ? ' active' : ''}`}>
                            1
                          </span>
                          Cluster depth
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            value={parameters.neighbourhood.off_grid_partitions.cluster_depth_m}
                            onChange={(e) => {
                              parameters.neighbourhood.off_grid_partitions.cluster_depth_m = Number(
                                e.target.value
                              );
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Cluster size</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            value={parameters.neighbourhood.off_grid_partitions.cluster_size_lots}
                            onChange={(e) => {
                              parameters.neighbourhood.off_grid_partitions.cluster_size_lots =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                            readOnly
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('1-2') ? ' active' : ''}`}>
                            2
                          </span>
                          Cluster width
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            value={parameters.neighbourhood.off_grid_partitions.cluster_width_m}
                            onChange={(e) => {
                              parameters.neighbourhood.off_grid_partitions.cluster_width_m = Number(
                                e.target.value
                              );
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Lot depth along path</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            value={
                              parameters.neighbourhood.off_grid_partitions.lot_depth_along_path_m
                            }
                            onChange={(e) => {
                              parameters.neighbourhood.off_grid_partitions.lot_depth_along_path_m =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                            readOnly
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Lot depth around yard</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            value={
                              parameters.neighbourhood.off_grid_partitions.lot_depth_around_yard_m
                            }
                            onChange={(e) => {
                              parameters.neighbourhood.off_grid_partitions.lot_depth_around_yard_m =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                            readOnly
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1-3">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('1-3') ? ' active' : ''}`}>4</span>
                  Urban Block Structure
                </Accordion.Header>
                <Accordion.Body>
                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('1-3') ? ' active' : ''}`}>
                            1
                          </span>
                          Along arteries:
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Off-grid clusters in depth</label>
                      </Col>
                      <Col>
                        <select
                          className="form-control"
                          value={
                            '' +
                            parameters.neighbourhood.urban_block_structure.along_arteries
                              .off_grid_clusters_in_depth_m
                          }
                          onChange={(e) => {
                            parameters.neighbourhood.urban_block_structure.along_arteries.off_grid_clusters_in_depth_m =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                        </select>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Off-grid clusters in width</label>
                      </Col>
                      <Col>
                        <select
                          className="form-control"
                          value={
                            '' +
                            parameters.neighbourhood.urban_block_structure.along_arteries
                              .off_grid_clusters_in_width_m
                          }
                          onChange={(e) => {
                            parameters.neighbourhood.urban_block_structure.along_arteries.off_grid_clusters_in_width_m =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                        </select>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('1-3') ? ' active' : ''}`}>
                            2
                          </span>
                          Along secondaries:
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Off-grid clusters in depth</label>
                      </Col>
                      <Col>
                        <select
                          className="form-control"
                          value={
                            '' +
                            parameters.neighbourhood.urban_block_structure.along_secondaries
                              .off_grid_clusters_in_depth_m
                          }
                          onChange={(e) => {
                            parameters.neighbourhood.urban_block_structure.along_secondaries.off_grid_clusters_in_depth_m =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                        </select>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Off-grid clusters in width</label>
                      </Col>
                      <Col>
                        <select
                          className="form-control"
                          value={
                            '' +
                            parameters.neighbourhood.urban_block_structure.along_secondaries
                              .off_grid_clusters_in_width_m
                          }
                          onChange={(e) => {
                            parameters.neighbourhood.urban_block_structure.along_secondaries.off_grid_clusters_in_width_m =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                        </select>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('1-3') ? ' active' : ''}`}>
                            3
                          </span>
                          Along locals:
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Off-grid clusters in depth</label>
                      </Col>
                      <Col>
                        <select
                          className="form-control"
                          value={
                            '' +
                            parameters.neighbourhood.urban_block_structure.along_locals
                              .off_grid_clusters_in_depth_m
                          }
                          onChange={(e) => {
                            parameters.neighbourhood.urban_block_structure.along_locals.off_grid_clusters_in_depth_m =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="1">2</option>
                        </select>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Off-grid clusters in width</label>
                      </Col>
                      <Col>
                        <select
                          className="form-control"
                          value={
                            '' +
                            parameters.neighbourhood.urban_block_structure.along_locals
                              .off_grid_clusters_in_width_m
                          }
                          onChange={(e) => {
                            parameters.neighbourhood.urban_block_structure.along_locals.off_grid_clusters_in_width_m =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </Col>
                    </Row>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1-4">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('1-4') ? ' active' : ''}`}>5</span>
                  Public Spaces
                </Accordion.Header>
                <Accordion.Body>
                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('1-4') ? ' active' : ''}`}>
                            1
                          </span>
                          Open spaces
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Open space</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.neighbourhood.public_spaces.open_spaces
                                .open_space_percentage
                            }
                            onChange={(e) => {
                              parameters.neighbourhood.public_spaces.open_spaces.open_space_percentage =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col></Col>
                      <Col style={{ textAlign: 'right' }}>
                        <NeighbourhoodPublicScapeOpenSpace />
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('1-4') ? ' active' : ''}`}>
                            2
                          </span>
                          Amenities
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Amenities</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.neighbourhood.public_spaces.amenities.amenities_percentage
                            }
                            onChange={(e) => {
                              parameters.neighbourhood.public_spaces.amenities.amenities_percentage =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col></Col>
                      <Col style={{ textAlign: 'right' }}>
                        <NeighbourhoodPublicScapeAmenities />
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('1-4') ? ' active' : ''}`}>
                            3
                          </span>
                          Street sections
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Sidewalk width</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="0.5"
                            className="form-control"
                            value={
                              parameters.neighbourhood.public_spaces.street_section.sidewalk_width_m
                            }
                            onChange={(e) => {
                              parameters.neighbourhood.public_spaces.street_section.sidewalk_width_m =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('1-4') ? ' active' : ''}`}>
                            4
                          </span>
                          Trees
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Show trees?</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="checkbox"
                            checked={
                              parameters.neighbourhood.public_spaces.trees.show_trees_frontend
                            }
                            onChange={(e) => {
                              parameters.neighbourhood.public_spaces.trees.show_trees_frontend =
                                e.target.checked;
                              setParameters({ ...parameters });
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Tree spacing</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={parameters.neighbourhood.public_spaces.trees.tree_spacing_m}
                            onChange={(e) => {
                              parameters.neighbourhood.public_spaces.trees.tree_spacing_m = Number(
                                e.target.value
                              );
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Initial tree height</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.neighbourhood.public_spaces.trees.initial_tree_height_m
                            }
                            onChange={(e) => {
                              parameters.neighbourhood.public_spaces.trees.initial_tree_height_m =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">Final tree height</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={parameters.neighbourhood.public_spaces.trees.final_tree_height_m}
                            onChange={(e) => {
                              parameters.neighbourhood.public_spaces.trees.final_tree_height_m =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <span className={`circle-number-lg${isActive('2') ? ' active' : ''}`}>3</span>Tissue
          </Accordion.Header>
          <Accordion.Body>
            <Accordion activeKey={activeKeys} onSelect={handleSelect} alwaysOpen>
              <Accordion.Item eventKey="2-0">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('2-0') ? ' active' : ''}`}>1</span>
                  On-grid lots on arteries
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col>
                      <label>Depth</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_arteries.depth_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_arteries.depth_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                          readOnly
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_arteries.width_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_arteries.width_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Front setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_arteries.front_setback_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_arteries.front_setback_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Side margins</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_arteries.side_margins_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_arteries.side_margins_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Rear setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_arteries.rear_setback_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_arteries.rear_setback_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Number of floors</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_arteries.number_of_floors}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_arteries.number_of_floors = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">floors</span>
                      </div>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2-1">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('2-1') ? ' active' : ''}`}>2</span>
                  On-grid lots on secondaries
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col>
                      <label>Depth</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_secondaries.depth_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_secondaries.depth_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                          readOnly
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_secondaries.width_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_secondaries.width_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Front setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_secondaries.front_setback_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_secondaries.front_setback_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Side margins</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_secondaries.side_margins_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_secondaries.side_margins_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Rear setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_secondaries.rear_setback_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_secondaries.rear_setback_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Number of floors</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_secondaries.number_of_floors}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_secondaries.number_of_floors = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">floors</span>
                      </div>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2-2">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('2-2') ? ' active' : ''}`}>3</span>
                  On-grid lots on locals
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col>
                      <label>Depth</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_locals.depth_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_locals.depth_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                          readOnly
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_locals.width_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_locals.width_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Front setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_locals.front_setback_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_locals.front_setback_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Side margins</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_locals.side_margins_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_locals.side_margins_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Rear setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_locals.rear_setback_m}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_locals.rear_setback_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Number of floors</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={parameters.tissue.on_grid_lots_on_locals.number_of_floors}
                          onChange={(e) => {
                            parameters.tissue.on_grid_lots_on_locals.number_of_floors = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">floors</span>
                      </div>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2-3">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('2-3') ? ' active' : ''}`}>4</span>
                  Off-grid cluster, Type1 (behind on-grid)
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col>
                      <label>Access path width (on grid)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={
                            parameters.tissue.off_grid_cluster_type_1.access_path_width_on_grid_m
                          }
                          onChange={(e) => {
                            parameters.tissue.off_grid_cluster_type_1.access_path_width_on_grid_m =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Internal path width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={parameters.tissue.off_grid_cluster_type_1.internal_path_width_m}
                          onChange={(e) => {
                            parameters.tissue.off_grid_cluster_type_1.internal_path_width_m =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Open space width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={parameters.tissue.off_grid_cluster_type_1.open_space_width_m}
                          onChange={(e) => {
                            parameters.tissue.off_grid_cluster_type_1.open_space_width_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Open space length</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={parameters.tissue.off_grid_cluster_type_1.open_space_length_m}
                          onChange={(e) => {
                            parameters.tissue.off_grid_cluster_type_1.open_space_length_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Lot width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.off_grid_cluster_type_1.lot_width_m}
                          onChange={(e) => {
                            parameters.tissue.off_grid_cluster_type_1.lot_width_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Front setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.off_grid_cluster_type_1.front_setback_m}
                          onChange={(e) => {
                            parameters.tissue.off_grid_cluster_type_1.front_setback_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Side margins</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.off_grid_cluster_type_1.side_margins_m}
                          onChange={(e) => {
                            parameters.tissue.off_grid_cluster_type_1.side_margins_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Rear setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.off_grid_cluster_type_1.rear_setback_m}
                          onChange={(e) => {
                            parameters.tissue.off_grid_cluster_type_1.rear_setback_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Number of floors</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={parameters.tissue.off_grid_cluster_type_1.number_of_floors}
                          onChange={(e) => {
                            parameters.tissue.off_grid_cluster_type_1.number_of_floors = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">floors</span>
                      </div>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2-4">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('2-4') ? ' active' : ''}`}>5</span>
                  Off-grid cluster, Type2 (behind 1st)
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col>
                      <label>Internal path width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.off_grid_cluster_type_2.internal_path_width_m}
                          onChange={(e) => {
                            parameters.tissue.off_grid_cluster_type_2.internal_path_width_m =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Cul-de-sac width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.off_grid_cluster_type_2.cul_de_sac_width_m}
                          onChange={(e) => {
                            parameters.tissue.off_grid_cluster_type_2.cul_de_sac_width_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Lot width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={parameters.tissue.off_grid_cluster_type_2.lot_width_m}
                          onChange={(e) => {
                            parameters.tissue.off_grid_cluster_type_2.lot_width_m = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Lot depth (behind cul-de-sac)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={
                            parameters.tissue.off_grid_cluster_type_2.lot_depth_behind_cul_de_sac_m
                          }
                          onChange={(e) => {
                            parameters.tissue.off_grid_cluster_type_2.lot_depth_behind_cul_de_sac_m =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2-5">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('2-5') ? ' active' : ''}`}>6</span>
                  Corner bonus
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col>
                      <label>Density (floor) bonus at intersection</label>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>With artery</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={parameters.tissue.corner_bonus.with_artery_percent}
                          onChange={(e) => {
                            parameters.tissue.corner_bonus.with_artery_percent = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>With Secondary</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={parameters.tissue.corner_bonus.with_secondary_percent}
                          onChange={(e) => {
                            parameters.tissue.corner_bonus.with_secondary_percent = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Width local</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={parameters.tissue.corner_bonus.with_local_percent}
                          onChange={(e) => {
                            parameters.tissue.corner_bonus.with_local_percent = Number(
                              e.target.value
                            );
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2-6">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('2-6') ? ' active' : ''}`}>7</span>
                  Fire protection
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col>
                      <label>Make partitions fire-proof via 6m margins</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="checkbox"
                          checked={
                            parameters.tissue.fire_protection.fire_proof_partitions_with_6m_margins
                          }
                          onChange={(e) => {
                            parameters.tissue.fire_protection.fire_proof_partitions_with_6m_margins =
                              e.target.checked;
                            setParameters({ ...parameters });
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>
            <span className={`circle-number-md${isActive('3') ? ' active' : ''}`}>4</span>Starter
            Buildings
          </Accordion.Header>
          <Accordion.Body>
            <Accordion activeKey={activeKeys} onSelect={handleSelect} alwaysOpen>
              <Accordion.Item eventKey="3-0">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('3-0') ? ' active' : ''}`}>1</span>
                  On-grid lots on arteries
                </Accordion.Header>
                <Accordion.Body>
                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('3-0') ? ' active' : ''}`}>
                            1
                          </span>
                          Corner with other artery
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_arteries
                                .corner_with_other_artery.initial_width_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_arteries.corner_with_other_artery.initial_width_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_arteries
                                .corner_with_other_artery.initial_depth_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_arteries.corner_with_other_artery.initial_depth_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_arteries
                                .corner_with_other_artery.initial_floors_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_arteries.corner_with_other_artery.initial_floors_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('3-0') ? ' active' : ''}`}>
                            2
                          </span>
                          Corner with secondary
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_arteries
                                .corner_with_secondary.initial_width_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_arteries.corner_with_secondary.initial_width_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_arteries
                                .corner_with_secondary.initial_depth_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_arteries.corner_with_secondary.initial_depth_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_arteries
                                .corner_with_secondary.initial_floors_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_arteries.corner_with_secondary.initial_floors_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('3-0') ? ' active' : ''}`}>
                            3
                          </span>
                          Corner with tertiary
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_arteries
                                .corner_with_tertiary.initial_width_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_arteries.corner_with_tertiary.initial_width_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_arteries
                                .corner_with_tertiary.initial_depth_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_arteries.corner_with_tertiary.initial_depth_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_arteries
                                .corner_with_tertiary.initial_floors_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_arteries.corner_with_tertiary.initial_floors_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('3-0') ? ' active' : ''}`}>
                            4
                          </span>
                          Regular lot
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_arteries.regular_lot
                                .initial_width_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_arteries.regular_lot.initial_width_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_arteries.regular_lot
                                .initial_depth_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_arteries.regular_lot.initial_depth_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_arteries.regular_lot
                                .initial_floors_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_arteries.regular_lot.initial_floors_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3-1">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('3-1') ? ' active' : ''}`}>2</span>
                  On-grid lots on secondaries
                </Accordion.Header>
                <Accordion.Body>
                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('3-1') ? ' active' : ''}`}>
                            1
                          </span>
                          Corner with other secondary
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_secondaries
                                .corner_with_other_secondary.initial_width_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_secondaries.corner_with_other_secondary.initial_width_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_secondaries
                                .corner_with_other_secondary.initial_depth_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_secondaries.corner_with_other_secondary.initial_depth_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_secondaries
                                .corner_with_other_secondary.initial_floors_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_secondaries.corner_with_other_secondary.initial_floors_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('3-1') ? ' active' : ''}`}>
                            2
                          </span>
                          Corner with tertiary
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_secondaries
                                .corner_with_tertiary.initial_width_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_secondaries.corner_with_tertiary.initial_width_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_secondaries
                                .corner_with_tertiary.initial_depth_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_secondaries.corner_with_tertiary.initial_depth_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_secondaries
                                .corner_with_tertiary.initial_floors_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_secondaries.corner_with_tertiary.initial_floors_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('3-1') ? ' active' : ''}`}>
                            3
                          </span>
                          Regular lot
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_secondaries.regular_lot
                                .initial_width_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_secondaries.regular_lot.initial_width_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_secondaries.regular_lot
                                .initial_depth_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_secondaries.regular_lot.initial_depth_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_secondaries.regular_lot
                                .initial_floors_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_secondaries.regular_lot.initial_floors_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3-2">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('3-2') ? ' active' : ''}`}>3</span>
                  On-grid lots on locals
                </Accordion.Header>
                <Accordion.Body>
                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('3-2') ? ' active' : ''}`}>
                            1
                          </span>
                          Corner with other local
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_locals
                                .corner_with_other_local.initial_width_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_locals.corner_with_other_local.initial_width_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_locals
                                .corner_with_other_local.initial_depth_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_locals.corner_with_other_local.initial_depth_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_locals
                                .corner_with_other_local.initial_floors_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_locals.corner_with_other_local.initial_floors_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row>
                      <Col>
                        <label>
                          <span className={`circle-number-sm${isActive('3-2') ? ' active' : ''}`}>
                            2
                          </span>
                          Regular lot
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_locals.regular_lot
                                .initial_width_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_locals.regular_lot.initial_width_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_locals.regular_lot
                                .initial_depth_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_locals.regular_lot.initial_depth_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className="without-number">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={
                              parameters.starter_buildings.on_grid_lots_on_locals.regular_lot
                                .initial_floors_percent
                            }
                            onChange={(e) => {
                              parameters.starter_buildings.on_grid_lots_on_locals.regular_lot.initial_floors_percent =
                                Number(e.target.value);
                              setParameters({ ...parameters });
                            }}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3-3">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('3-3') ? ' active' : ''}`}>4</span>
                  Off-grid cluster, Type1 (behind on-grid)
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col>
                      <label>Initial width (share of permissable)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={
                            parameters.starter_buildings.off_grid_cluster_type_1
                              .initial_width_percent
                          }
                          onChange={(e) => {
                            parameters.starter_buildings.off_grid_cluster_type_1.initial_width_percent =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Initial depth (share of permissable)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={
                            parameters.starter_buildings.off_grid_cluster_type_1
                              .initial_depth_percent
                          }
                          onChange={(e) => {
                            parameters.starter_buildings.off_grid_cluster_type_1.initial_depth_percent =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Initial floors (share of permissable)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={
                            parameters.starter_buildings.off_grid_cluster_type_1
                              .initial_floors_percent
                          }
                          onChange={(e) => {
                            parameters.starter_buildings.off_grid_cluster_type_1.initial_floors_percent =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3-4">
                <Accordion.Header>
                  <span className={`circle-number-sm${isActive('3-4') ? ' active' : ''}`}>5</span>
                  Off-grid cluster, Type2 (behind 1st)
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col>
                      <label>Initial width (share of permissable)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={
                            parameters.starter_buildings.off_grid_cluster_type_2
                              .initial_width_percent
                          }
                          onChange={(e) => {
                            parameters.starter_buildings.off_grid_cluster_type_2.initial_width_percent =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Initial depth (share of permissable)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={
                            parameters.starter_buildings.off_grid_cluster_type_2
                              .initial_depth_percent
                          }
                          onChange={(e) => {
                            parameters.starter_buildings.off_grid_cluster_type_2.initial_depth_percent =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Initial floors (share of permissable)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={
                            parameters.starter_buildings.off_grid_cluster_type_2
                              .initial_floors_percent
                          }
                          onChange={(e) => {
                            parameters.starter_buildings.off_grid_cluster_type_2.initial_floors_percent =
                              Number(e.target.value);
                            setParameters({ ...parameters });
                          }}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* TODO: We need to add API for update */}
      {!currentProject.project?.uuid && (
        <div
          style={{
            marginTop: '10px',
            marginBottom: '1rem',
            padding: '0 1rem',
          }}
          onClick={apply}
        >
          <Button
            // @ts-expect-error: A custom variant
            variant="primary"
            style={{
              textAlign: 'center',
              width: '100%',
            }}
            disabled={!!errors.length || !isProjectDone || submitted || currentStepUpdateLoading}
          >
            {currentProject.project?.uuid ? 'Update' : 'Create'} project
          </Button>
        </div>
      )}
      {!!errors.length && (
        <div
          className="ErrorMessage"
          style={{
            padding: '1rem',
            paddingTop: 0,
          }}
        >
          {errors.join(', ')}
        </div>
      )}
      {(submitted || currentStepUpdateLoading || !isProjectDone) && (
        <Box
          position="absolute"
          width="100%"
          height="100% "
          top={0}
          left={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="rgba(255, 255, 255, 0.8)"
        >
          <Spinner size="xl" />
        </Box>
      )}
    </Box>
  );
}
