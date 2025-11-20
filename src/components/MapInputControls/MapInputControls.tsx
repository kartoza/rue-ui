import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Accordion from 'react-bootstrap/Accordion';
import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import type { ProjectParameters } from '../../redux/reducers/project';
import type { RootState } from '../../redux/store';
import { setSelectedDefinition } from '../../redux/reducers/definitionSlice';

import './style.scss';

const projectParametersDefault: ProjectParameters = {
  neighbourhood: {
    off_grid_partitions: {
      cluster_depth_m: 45,
      cluster_size_lots: 15,
      cluster_width_m: 30,
      lot_depth_along_path_m: 12.5,
      lot_depth_around_yard_m: 10,
    },
    on_grid_partitions: {
      depth_along_arteries_m: 40,
      depth_along_locals_m: 20,
      depth_along_secondaries_m: 30,
    },
    public_roads: {
      width_of_arteries_m: 20,
      width_of_locals_m: 10,
      width_of_secondaries_m: 15,
    },
    public_spaces: {
      amenities: {
        amenities_percentage: 10,
      },
      open_spaces: {
        open_space_percentage: 0,
      },
      street_section: {
        sidewalk_width_m: 3,
      },
      trees: {
        final_tree_height_m: 20,
        initial_tree_height_m: 8,
        show_trees_frontend: true,
        tree_spacing_m: 12,
      },
    },
    urban_block_structure: {
      along_arteries: {
        off_grid_clusters_in_depth_m: 0,
        off_grid_clusters_in_width_m: 3,
      },
      along_locals: {
        off_grid_clusters_in_depth_m: 2,
        off_grid_clusters_in_width_m: 3,
      },
      along_secondaries: {
        off_grid_clusters_in_depth_m: 0,
        off_grid_clusters_in_width_m: 3,
      },
    },
  },
  starter_buildings: {
    off_grid_cluster_type_1: {
      initial_depth_percent: 50,
      initial_floors_percent: 50,
      initial_width_percent: 100,
    },
    off_grid_cluster_type_2: {
      initial_depth_percent: 50,
      initial_floors_percent: 50,
      initial_width_percent: 50,
    },
    on_grid_lots_on_arteries: {
      corner_with_other_artery: {
        initial_depth_percent: 0,
        initial_floors_percent: 0,
        initial_width_percent: 0,
      },
      corner_with_secondary: {
        initial_depth_percent: 0,
        initial_floors_percent: 0,
        initial_width_percent: 0,
      },
      corner_with_tertiary: {
        initial_depth_percent: 0,
        initial_floors_percent: 0,
        initial_width_percent: 0,
      },
      regular_lot: {
        initial_depth_percent: 60,
        initial_floors_percent: 80,
        initial_width_percent: 100,
      },
    },
    on_grid_lots_on_locals: {
      corner_with_other_local: {
        initial_depth_percent: 100,
        initial_floors_percent: 100,
        initial_width_percent: 100,
      },
      regular_lot: {
        initial_depth_percent: 60,
        initial_floors_percent: 60,
        initial_width_percent: 100,
      },
    },
    on_grid_lots_on_secondaries: {
      corner_with_other_secondary: {
        initial_depth_percent: 0,
        initial_floors_percent: 0,
        initial_width_percent: 0,
      },
      corner_with_tertiary: {
        initial_depth_percent: 0,
        initial_floors_percent: 0,
        initial_width_percent: 0,
      },
      regular_lot: {
        initial_depth_percent: 60,
        initial_floors_percent: 60,
        initial_width_percent: 100,
      },
    },
  },
  tissue: {
    corner_bonus: {
      description: 'Density (floor) bonus at intersection',
      with_artery_percent: 40,
      with_local_percent: 20,
      with_secondary_percent: 30,
    },
    fire_protection: {
      fire_proof_partitions_with_6m_margins: false,
    },
    off_grid_cluster_type_1: {
      access_path_width_on_grid_m: 3,
      front_setback_m: 0,
      internal_path_width_m: 5,
      lot_width_m: 6,
      number_of_floors: 2,
      open_space_length_m: 15,
      open_space_width_m: 10,
      rear_setback_m: 3,
      side_margins_m: 0,
    },
    off_grid_cluster_type_2: {
      cul_de_sac_width_m: 5,
      internal_path_width_m: 3,
      lot_depth_behind_cul_de_sac_m: 15,
      lot_width_m: 4.5,
    },
    on_grid_lots_on_arteries: {
      depth_m: 40,
      front_setback_m: 6,
      number_of_floors: 5,
      rear_setback_m: 6,
      side_margins_m: 6,
      width_m: 40,
    },
    on_grid_lots_on_locals: {
      depth_m: 20,
      front_setback_m: 0,
      number_of_floors: 3,
      rear_setback_m: 3,
      side_margins_m: 0,
      width_m: 10,
    },
    on_grid_lots_on_secondaries: {
      depth_m: 30,
      front_setback_m: 3,
      number_of_floors: 4,
      rear_setback_m: 3,
      side_margins_m: 3,
      width_m: 20,
    },
  },
};

function MapInputControls() {
  const dispatch = useDispatch();
  const [activeKeys, setActiveKeys] = useState<string[]>(['0', '0-0']);

  // City - Site Definition
  const siteDefinition = useSelector((state: RootState) => state.definition.selectedDefinition);

  // City - Location
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  // City - Geometry
  const [rotation, setRotation] = useState<number>(0);
  const [front, setFront] = useState<number>(0);
  const [rear, setRear] = useState<number>(0);
  const [rearShift, setRearShift] = useState<number>(0);
  const [depth, setDepth] = useState<number>(0);

  // Parameters
  const [parameters, setParameters] = useState<ProjectParameters>(projectParametersDefault);
  console.log(parameters);

  const handleSelect = (eventKey: string | string[] | null | undefined) => {
    if (Array.isArray(eventKey)) {
      setActiveKeys(eventKey);
    } else if (eventKey) {
      setActiveKeys([eventKey]);
    } else {
      setActiveKeys([]);
    }
  };

  const isActive = (key: string) => activeKeys.includes(key);

  return (
    <Container className="map-input-parent">
      <Accordion
        activeKey={activeKeys}
        onSelect={handleSelect}
        alwaysOpen
        style={{ marginTop: '10px' }}
      >
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
                    onChange={(e) => dispatch(setSelectedDefinition(e.target.value))}
                  >
                    <option value="vmc_demo">VMC Demo</option>
                    <option value="draw_your_own">Draw your own</option>
                    <option value="load_site">Load site</option>
                    <option value="dummy_site">Dummy Site</option>
                  </select>
                </Accordion.Body>
              </Accordion.Item>
              {siteDefinition === 'dummy_site' && (
                <>
                  <Accordion.Item eventKey="0-1">
                    <Accordion.Header>
                      <span className={`circle-number-md${isActive('0-1') ? ' active' : ''}`}>
                        2
                      </span>
                      Location
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col>
                          <label>
                            <span className={`circle-number-sm${isActive('0-1') ? ' active' : ''}`}>
                              1
                            </span>
                            Latitude
                          </label>
                        </Col>
                        <Col>
                          <div className="input-group">
                            <input
                              type="number"
                              step="0.000001"
                              className="form-control"
                              value={latitude}
                              onChange={(e) => setLatitude(Number(e.target.value))}
                              readOnly
                            />
                            <span className="input-group-text">°</span>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <label>
                            <span className={`circle-number-sm${isActive('0-1') ? ' active' : ''}`}>
                              2
                            </span>
                            Longitude
                          </label>
                        </Col>
                        <Col>
                          <div className="input-group">
                            <input
                              type="number"
                              step="0.000001"
                              className="form-control"
                              value={longitude}
                              onChange={(e) => setLongitude(Number(e.target.value))}
                            />
                            <span className="input-group-text">°</span>
                          </div>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="0-2">
                    <Accordion.Header>
                      <span className={`circle-number-md${isActive('0-2') ? ' active' : ''}`}>
                        3
                      </span>
                      Geometry
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col>
                          <label>
                            <span className={`circle-number-sm${isActive('0-2') ? ' active' : ''}`}>
                              1
                            </span>
                            Rotation
                          </label>
                        </Col>
                        <Col>
                          <div className="input-group">
                            <input
                              type="number"
                              step="0.000001"
                              className="form-control"
                              value={rotation}
                              onChange={(e) => setRotation(Number(e.target.value))}
                              readOnly
                            />
                            <span className="input-group-text">°</span>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <label>
                            <span className={`circle-number-sm${isActive('0-2') ? ' active' : ''}`}>
                              2
                            </span>
                            Front
                          </label>
                        </Col>
                        <Col>
                          <div className="input-group">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={front}
                              onChange={(e) => setFront(Number(e.target.value))}
                            />
                            <span className="input-group-text">m</span>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <label>
                            <span className={`circle-number-sm${isActive('0-2') ? ' active' : ''}`}>
                              3
                            </span>
                            Rear
                          </label>
                        </Col>
                        <Col>
                          <div className="input-group">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={rear}
                              onChange={(e) => setRear(Number(e.target.value))}
                            />
                            <span className="input-group-text">m</span>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <label>
                            <span className={`circle-number-sm${isActive('0-2') ? ' active' : ''}`}>
                              4
                            </span>
                            Rear shift
                          </label>
                        </Col>
                        <Col>
                          <div className="input-group">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={rearShift}
                              onChange={(e) => setRearShift(Number(e.target.value))}
                            />
                            <span className="input-group-text">m</span>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <label>
                            <span className={`circle-number-sm${isActive('0-2') ? ' active' : ''}`}>
                              5
                            </span>
                            Depth
                          </label>
                        </Col>
                        <Col>
                          <div className="input-group">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={depth}
                              onChange={(e) => setDepth(Number(e.target.value))}
                            />
                            <span className="input-group-text">m</span>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>Site area: 34.5 ha</Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </>
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
      <div
        style={{
          marginTop: '10px',
          marginBottom: '1rem',
          padding: '0 1rem',
        }}
      >
        <Button
          // @ts-expect-error: A custom variant
          variant="primary"
          style={{
            textAlign: 'center',
            width: '100%',
          }}
        >
          Apply
        </Button>
      </div>
    </Container>
  );
}

export default MapInputControls;
