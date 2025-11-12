import './style.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { useState } from 'react';
import { setSelectedDefiniton } from '../../features/site_definition/definitionSlice';
import { useDispatch, useSelector } from 'react-redux';

function MapInputControls() {
  const dispatch = useDispatch();
  const [activeKeys, setActiveKeys] = useState(['0', '0-0']);

  // City - Site Definition
  const siteDefinition = useSelector((state) => state.definition.selectedDefinition);

  // City - Location
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  // City - Geometry
  const [rotation, setRotation] = useState(0);
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(0);
  const [rearShift, setRearShift] = useState(0);
  const [depth, setDepth] = useState(0);

  // Neighbourhood - Public roads
  const [widthOfArteries, setWidthOfArteries] = useState(0);
  const [widthOfSecondaries, setWidthOfSecondaries] = useState(0);
  const [widthOfLocals, setWidthOfLocals] = useState(0);

  // Neighbourhood - On-grid partitions
  const [depthAlongArteries, setDepthAlongArteries] = useState(0);
  const [depthAlongSecondaries, setDepthAlongSecondaries] = useState(0);
  const [depthAlongLocals, setDepthAlongLocals] = useState(0);

  // Neighbourhood - Off-grid partitions
  const [clusterDepth, setClusterDepth] = useState(0);
  const [clusterSize, setClusterSize] = useState(0);
  const [clusterWidth, setClusterWidth] = useState(0);
  const [lotDepthAlongPath, setLotDepthAlongPath] = useState(0);
  const [lotDepthAroundYard, setLotDepthAroundYard] = useState(0);

  // Neighbourhood - Urban Block Structure
  const [arteriesOffGridDepth, setArteriesOffGridDepth] = useState('0');
  const [arteriesOffGridWidth, setArteriesOffGridWidth] = useState('0');
  const [secondariesOffGridDepth, setSecondariesOffGridDepth] = useState('0');
  const [secondariesOffGridWidth, setSecondariesOffGridWidth] = useState('0');
  const [localsOffGridDepth, setLocalsOffGridDepth] = useState('0');
  const [localsOffGridWidth, setLocalsOffGridWidth] = useState('0');

  // Neighbourhood - Public Spaces
  const [openSpace, setOpenSpace] = useState(0);
  const [amenities, setAmenities] = useState(0);
  const [sidewalkWidth, setSidewalkWidth] = useState(0);
  const [showTrees, setShowTrees] = useState(false);
  const [treeSpacing, setTreeSpacing] = useState(0);
  const [initialTreeHeight, setInitialTreeHeight] = useState(0);
  const [finalTreeHeight, setFinalTreeHeight] = useState(0);

  // Tissue - On-grid lots on arteries
  const [arteriesDepth, setArteriesDepth] = useState(0);
  const [arteriesWidth, setArteriesWidth] = useState(0);
  const [arteriesFrontSetback, setArteriesFrontSetback] = useState(0);
  const [arteriesSideMargins, setArteriesSideMargins] = useState(0);
  const [arteriesRearSetback, setArteriesRearSetback] = useState(0);
  const [arteriesNumFloors, setArteriesNumFloors] = useState(0);

  // Tissue - On-grid lots on secondaries
  const [secondariesDepth, setSecondariesDepth] = useState(0);
  const [secondariesWidth, setSecondariesWidth] = useState(0);
  const [secondariesFrontSetback, setSecondariesFrontSetback] = useState(0);
  const [secondariesSideMargins, setSecondariesSideMargins] = useState(0);
  const [secondariesRearSetback, setSecondariesRearSetback] = useState(0);
  const [secondariesNumFloors, setSecondariesNumFloors] = useState(0);

  // Tissue - On-grid lots on locals
  const [localsDepth, setLocalsDepth] = useState(0);
  const [localsWidth, setLocalsWidth] = useState(0);
  const [localsFrontSetback, setLocalsFrontSetback] = useState(0);
  const [localsSideMargins, setLocalsSideMargins] = useState(0);
  const [localsRearSetback, setLocalsRearSetback] = useState(0);
  const [localsNumFloors, setLocalsNumFloors] = useState(0);

  // Tissue - Off-grid cluster, Type1
  const [type1AccessPathWidth, setType1AccessPathWidth] = useState(0);
  const [type1InternalPathWidth, setType1InternalPathWidth] = useState(0);
  const [type1OpenSpaceWidth, setType1OpenSpaceWidth] = useState(0);
  const [type1OpenSpaceLength, setType1OpenSpaceLength] = useState(0);
  const [type1LotWidth, setType1LotWidth] = useState(0);
  const [type1FrontSetback, setType1FrontSetback] = useState(0);
  const [type1SideMargins, setType1SideMargins] = useState(0);
  const [type1RearSetback, setType1RearSetback] = useState(0);
  const [type1NumFloors, setType1NumFloors] = useState(0);

  // Tissue - Off-grid cluster, Type2
  const [type2InternalPathWidth, setType2InternalPathWidth] = useState(0);
  const [type2CulDeSacWidth, setType2CulDeSacWidth] = useState(0);
  const [type2LotWidth, setType2LotWidth] = useState(0);
  const [type2LotDepth, setType2LotDepth] = useState(0);

  // Tissue - Corner bonus
  const [bonusWithArtery, setBonusWithArtery] = useState(0);
  const [bonusWithSecondary, setBonusWithSecondary] = useState(0);
  const [bonusWithLocal, setBonusWithLocal] = useState(0);

  // Tissue - Fire protection
  const [fireProof, setFireProof] = useState(false);

  // Starter Buildings - On-grid lots on arteries
  const [arteriesCornerArteryWidth, setArteriesCornerArteryWidth] = useState(0);
  const [arteriesCornerArteryDepth, setArteriesCornerArteryDepth] = useState(0);
  const [arteriesCornerArteryFloors, setArteriesCornerArteryFloors] = useState(0);
  const [arteriesCornerSecondaryWidth, setArteriesCornerSecondaryWidth] = useState(0);
  const [arteriesCornerSecondaryDepth, setArteriesCornerSecondaryDepth] = useState(0);
  const [arteriesCornerSecondaryFloors, setArteriesCornerSecondaryFloors] = useState(0);
  const [arteriesCornerTertiaryWidth, setArteriesCornerTertiaryWidth] = useState(0);
  const [arteriesCornerTertiaryDepth, setArteriesCornerTertiaryDepth] = useState(0);
  const [arteriesCornerTertiaryFloors, setArteriesCornerTertiaryFloors] = useState(0);
  const [arteriesRegularWidth, setArteriesRegularWidth] = useState(0);
  const [arteriesRegularDepth, setArteriesRegularDepth] = useState(0);
  const [arteriesRegularFloors, setArteriesRegularFloors] = useState(0);

  // Starter Buildings - On-grid lots on secondaries
  const [secondariesCornerSecondaryWidth, setSecondariesCornerSecondaryWidth] = useState(0);
  const [secondariesCornerSecondaryDepth, setSecondariesCornerSecondaryDepth] = useState(0);
  const [secondariesCornerSecondaryFloors, setSecondariesCornerSecondaryFloors] = useState(0);
  const [secondariesCornerTertiaryWidth, setSecondariesCornerTertiaryWidth] = useState(0);
  const [secondariesCornerTertiaryDepth, setSecondariesCornerTertiaryDepth] = useState(0);
  const [secondariesCornerTertiaryFloors, setSecondariesCornerTertiaryFloors] = useState(0);
  const [secondariesRegularWidth, setSecondariesRegularWidth] = useState(0);
  const [secondariesRegularDepth, setSecondariesRegularDepth] = useState(0);
  const [secondariesRegularFloors, setSecondariesRegularFloors] = useState(0);

  // Starter Buildings - On-grid lots on locals
  const [localsCornerLocalWidth, setLocalsCornerLocalWidth] = useState(0);
  const [localsCornerLocalDepth, setLocalsCornerLocalDepth] = useState(0);
  const [localsCornerLocalFloors, setLocalsCornerLocalFloors] = useState(0);
  const [localsRegularWidth, setLocalsRegularWidth] = useState(0);
  const [localsRegularDepth, setLocalsRegularDepth] = useState(0);
  const [localsRegularFloors, setLocalsRegularFloors] = useState(0);

  // Starter Buildings - Off-grid clusters
  const [offGridType1Width, setOffGridType1Width] = useState(0);
  const [offGridType1Depth, setOffGridType1Depth] = useState(0);
  const [offGridType1Floors, setOffGridType1Floors] = useState(0);
  const [offGridType2Width, setOffGridType2Width] = useState(0);
  const [offGridType2Depth, setOffGridType2Depth] = useState(0);
  const [offGridType2Floors, setOffGridType2Floors] = useState(0);

  const handleSelect = (eventKeys) => {
    if (Array.isArray(eventKeys)) {
      setActiveKeys(eventKeys);
    } else if (eventKeys) {
      setActiveKeys([eventKeys]);
    } else {
      setActiveKeys([]);
    }
  };

  const isActive = (key) => activeKeys.includes(key);

  return (
    <Container className="map-input-parent">
      <Accordion className="mt20" activeKey={activeKeys} onSelect={handleSelect} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span className={`circle-number-lg${isActive('0') ? ' active' : ''}`}>1</span>City
          </Accordion.Header>
          <Accordion.Body>
            <Accordion className="mb10" activeKey={activeKeys} onSelect={handleSelect} alwaysOpen>
              <Accordion.Item eventKey="0-0">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('0-0') ? ' active' : ''}`}>1</span>
                  Site Definition
                </Accordion.Header>
                <Accordion.Body>
                  <select
                    className="form-control"
                    value={siteDefinition}
                    onChange={(e) => dispatch(setSelectedDefiniton(e.target.value))}
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
                      <Row className="mb10">
                        <Col>
                          <label className="font-label-sm">
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
                      <Row className="mb10">
                        <Col>
                          <label className="font-label-sm">
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
                      <Row className="mb10">
                        <Col>
                          <label className="font-label-sm">
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
                      <Row className="mb10">
                        <Col>
                          <label className="font-label-sm">
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
                      <Row className="mb10">
                        <Col>
                          <label className="font-label-sm">
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
                      <Row className="mb10">
                        <Col>
                          <label className="font-label-sm">
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
                      <Row className="mb10">
                        <Col>
                          <label className="font-label-sm">
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
                      <Row className="mb10">
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
            <Accordion className="mb10" activeKey={activeKeys} onSelect={handleSelect} alwaysOpen>
              <Accordion.Item eventKey="1-0">
                <Accordion.Header>
                  <span className={`circle-number-md${isActive('1-0') ? ' active' : ''}`}>1</span>
                  Public roads
                </Accordion.Header>
                <Accordion.Body>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">
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
                          value={widthOfArteries}
                          onChange={(e) => setWidthOfArteries(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">
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
                          value={widthOfSecondaries}
                          onChange={(e) => setWidthOfSecondaries(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">
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
                          value={widthOfLocals}
                          onChange={(e) => setWidthOfLocals(Number(e.target.value))}
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
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">
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
                          value={depthAlongArteries}
                          onChange={(e) => setDepthAlongArteries(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">
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
                          value={depthAlongSecondaries}
                          onChange={(e) => setDepthAlongSecondaries(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">
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
                          value={depthAlongLocals}
                          onChange={(e) => setDepthAlongLocals(Number(e.target.value))}
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
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
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
                            value={clusterDepth}
                            onChange={(e) => setClusterDepth(Number(e.target.value))}
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Cluster size</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            value={clusterSize}
                            onChange={(e) => setClusterSize(Number(e.target.value))}
                            readOnly
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
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
                            value={clusterWidth}
                            onChange={(e) => setClusterWidth(Number(e.target.value))}
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Lot depth along path</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            value={lotDepthAlongPath}
                            onChange={(e) => setLotDepthAlongPath(Number(e.target.value))}
                            readOnly
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Lot depth around yard</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            value={lotDepthAroundYard}
                            onChange={(e) => setLotDepthAroundYard(Number(e.target.value))}
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
                    <label className="font-label-sm">
                      <span className={`circle-number-sm${isActive('1-3') ? ' active' : ''}`}>
                        1
                      </span>
                      Along arteries:
                    </label>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Off-grid clusters in depth</label>
                      </Col>
                      <Col>
                        <select
                          className="form-control"
                          value={arteriesOffGridDepth}
                          onChange={(e) => setArteriesOffGridDepth(e.target.value)}
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                        </select>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Off-grid clusters in width</label>
                      </Col>
                      <Col>
                        <select
                          className="form-control"
                          value={arteriesOffGridWidth}
                          onChange={(e) => setArteriesOffGridWidth(e.target.value)}
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
                    <label className="font-label-sm">
                      <span className={`circle-number-sm${isActive('1-3') ? ' active' : ''}`}>
                        2
                      </span>
                      Along secondaries:
                    </label>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Off-grid clusters in depth</label>
                      </Col>
                      <Col>
                        <select
                          className="form-control"
                          value={secondariesOffGridDepth}
                          onChange={(e) => setSecondariesOffGridDepth(e.target.value)}
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                        </select>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Off-grid clusters in width</label>
                      </Col>
                      <Col>
                        <select
                          className="form-control"
                          value={secondariesOffGridWidth}
                          onChange={(e) => setSecondariesOffGridWidth(e.target.value)}
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
                    <label className="font-label-sm">
                      <span className={`circle-number-sm${isActive('1-3') ? ' active' : ''}`}>
                        3
                      </span>
                      Along locals:
                    </label>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Off-grid clusters in depth</label>
                      </Col>
                      <Col>
                        <select
                          className="form-control"
                          value={localsOffGridDepth}
                          onChange={(e) => setLocalsOffGridDepth(e.target.value)}
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="1">2</option>
                        </select>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Off-grid clusters in width</label>
                      </Col>
                      <Col>
                        <select
                          className="form-control"
                          value={localsOffGridWidth}
                          onChange={(e) => setLocalsOffGridWidth(e.target.value)}
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
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
                          <span className={`circle-number-sm${isActive('1-4') ? ' active' : ''}`}>
                            1
                          </span>
                          Open spaces
                        </label>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Open space</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={openSpace}
                            onChange={(e) => setOpenSpace(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
                          <span className={`circle-number-sm${isActive('1-4') ? ' active' : ''}`}>
                            2
                          </span>
                          Amenities
                        </label>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Amenities</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={amenities}
                            onChange={(e) => setAmenities(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
                          <span className={`circle-number-sm${isActive('1-4') ? ' active' : ''}`}>
                            3
                          </span>
                          Street sections
                        </label>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Sidewalk width</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="0.5"
                            className="form-control"
                            value={sidewalkWidth}
                            onChange={(e) => setSidewalkWidth(Number(e.target.value))}
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
                          <span className={`circle-number-sm${isActive('1-4') ? ' active' : ''}`}>
                            4
                          </span>
                          Trees
                        </label>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Show trees?</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="checkbox"
                            checked={showTrees}
                            onChange={(e) => setShowTrees(e.target.checked)}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Tree spacing</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={treeSpacing}
                            onChange={(e) => setTreeSpacing(Number(e.target.value))}
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Initial tree height</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={initialTreeHeight}
                            onChange={(e) => setInitialTreeHeight(Number(e.target.value))}
                          />
                          <span className="input-group-text">m</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">Final tree height</label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={finalTreeHeight}
                            onChange={(e) => setFinalTreeHeight(Number(e.target.value))}
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
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Depth</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={arteriesDepth}
                          onChange={(e) => setArteriesDepth(Number(e.target.value))}
                          readOnly
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={arteriesWidth}
                          onChange={(e) => setArteriesWidth(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Front setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={arteriesFrontSetback}
                          onChange={(e) => setArteriesFrontSetback(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Side margins</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={arteriesSideMargins}
                          onChange={(e) => setArteriesSideMargins(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Rear setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={arteriesRearSetback}
                          onChange={(e) => setArteriesRearSetback(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Number of floors</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={arteriesNumFloors}
                          onChange={(e) => setArteriesNumFloors(Number(e.target.value))}
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
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Depth</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={secondariesDepth}
                          onChange={(e) => setSecondariesDepth(Number(e.target.value))}
                          readOnly
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={secondariesWidth}
                          onChange={(e) => setSecondariesWidth(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Front setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={secondariesFrontSetback}
                          onChange={(e) => setSecondariesFrontSetback(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Side margins</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={secondariesSideMargins}
                          onChange={(e) => setSecondariesSideMargins(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Rear setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={secondariesRearSetback}
                          onChange={(e) => setSecondariesRearSetback(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Number of floors</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={secondariesNumFloors}
                          onChange={(e) => setSecondariesNumFloors(Number(e.target.value))}
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
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Depth</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={localsDepth}
                          onChange={(e) => setLocalsDepth(Number(e.target.value))}
                          readOnly
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={localsWidth}
                          onChange={(e) => setLocalsWidth(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Front setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={localsFrontSetback}
                          onChange={(e) => setLocalsFrontSetback(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Side margins</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={localsSideMargins}
                          onChange={(e) => setLocalsSideMargins(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Rear setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={localsRearSetback}
                          onChange={(e) => setLocalsRearSetback(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Number of floors</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={localsNumFloors}
                          onChange={(e) => setLocalsNumFloors(Number(e.target.value))}
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
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Access path width (on grid)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={type1AccessPathWidth}
                          onChange={(e) => setType1AccessPathWidth(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Internal path width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={type1InternalPathWidth}
                          onChange={(e) => setType1InternalPathWidth(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Open space width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={type1OpenSpaceWidth}
                          onChange={(e) => setType1OpenSpaceWidth(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Open space length</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={type1OpenSpaceLength}
                          onChange={(e) => setType1OpenSpaceLength(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Lot width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={type1LotWidth}
                          onChange={(e) => setType1LotWidth(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Front setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={type1FrontSetback}
                          onChange={(e) => setType1FrontSetback(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Side margins</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={type1SideMargins}
                          onChange={(e) => setType1SideMargins(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Rear setback</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={type1RearSetback}
                          onChange={(e) => setType1RearSetback(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Number of floors</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={type1NumFloors}
                          onChange={(e) => setType1NumFloors(Number(e.target.value))}
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
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Internal path width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={type2InternalPathWidth}
                          onChange={(e) => setType2InternalPathWidth(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Cul-de-sac width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={type2CulDeSacWidth}
                          onChange={(e) => setType2CulDeSacWidth(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Lot width</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={type2LotWidth}
                          onChange={(e) => setType2LotWidth(Number(e.target.value))}
                        />
                        <span className="input-group-text">m</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Lot depth (behind cul-de-sac)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={type2LotDepth}
                          onChange={(e) => setType2LotDepth(Number(e.target.value))}
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
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Density (floor) bonus at intersection</label>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">With artery</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={bonusWithArtery}
                          onChange={(e) => setBonusWithArtery(Number(e.target.value))}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">With Secondary</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={bonusWithSecondary}
                          onChange={(e) => setBonusWithSecondary(Number(e.target.value))}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Width local</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={bonusWithLocal}
                          onChange={(e) => setBonusWithLocal(Number(e.target.value))}
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
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">
                        Make partitions fire-proof via 6m margins
                      </label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="checkbox"
                          checked={fireProof}
                          onChange={(e) => setFireProof(e.target.checked)}
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
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
                          <span className={`circle-number-sm${isActive('3-0') ? ' active' : ''}`}>
                            1
                          </span>
                          Corner with other artery
                        </label>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={arteriesCornerArteryWidth}
                            onChange={(e) => setArteriesCornerArteryWidth(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={arteriesCornerArteryDepth}
                            onChange={(e) => setArteriesCornerArteryDepth(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={arteriesCornerArteryFloors}
                            onChange={(e) => setArteriesCornerArteryFloors(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
                          <span className={`circle-number-sm${isActive('3-0') ? ' active' : ''}`}>
                            2
                          </span>
                          Corner with secondary
                        </label>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={arteriesCornerSecondaryWidth}
                            onChange={(e) =>
                              setArteriesCornerSecondaryWidth(Number(e.target.value))
                            }
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={arteriesCornerSecondaryDepth}
                            onChange={(e) =>
                              setArteriesCornerSecondaryDepth(Number(e.target.value))
                            }
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={arteriesCornerSecondaryFloors}
                            onChange={(e) =>
                              setArteriesCornerSecondaryFloors(Number(e.target.value))
                            }
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
                          <span className={`circle-number-sm${isActive('3-0') ? ' active' : ''}`}>
                            3
                          </span>
                          Corner with tertiary
                        </label>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={arteriesCornerTertiaryWidth}
                            onChange={(e) => setArteriesCornerTertiaryWidth(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={arteriesCornerTertiaryDepth}
                            onChange={(e) => setArteriesCornerTertiaryDepth(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={arteriesCornerTertiaryFloors}
                            onChange={(e) =>
                              setArteriesCornerTertiaryFloors(Number(e.target.value))
                            }
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
                          <span className={`circle-number-sm${isActive('3-0') ? ' active' : ''}`}>
                            4
                          </span>
                          Regular lot
                        </label>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={arteriesRegularWidth}
                            onChange={(e) => setArteriesRegularWidth(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={arteriesRegularDepth}
                            onChange={(e) => setArteriesRegularDepth(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={arteriesRegularFloors}
                            onChange={(e) => setArteriesRegularFloors(Number(e.target.value))}
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
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
                          <span className={`circle-number-sm${isActive('3-1') ? ' active' : ''}`}>
                            1
                          </span>
                          Corner with other secondary
                        </label>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={secondariesCornerSecondaryWidth}
                            onChange={(e) =>
                              setSecondariesCornerSecondaryWidth(Number(e.target.value))
                            }
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={secondariesCornerSecondaryDepth}
                            onChange={(e) =>
                              setSecondariesCornerSecondaryDepth(Number(e.target.value))
                            }
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={secondariesCornerSecondaryFloors}
                            onChange={(e) =>
                              setSecondariesCornerSecondaryFloors(Number(e.target.value))
                            }
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
                          <span className={`circle-number-sm${isActive('3-1') ? ' active' : ''}`}>
                            2
                          </span>
                          Corner with tertiary
                        </label>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={secondariesCornerTertiaryWidth}
                            onChange={(e) =>
                              setSecondariesCornerTertiaryWidth(Number(e.target.value))
                            }
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={secondariesCornerTertiaryDepth}
                            onChange={(e) =>
                              setSecondariesCornerTertiaryDepth(Number(e.target.value))
                            }
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={secondariesCornerTertiaryFloors}
                            onChange={(e) =>
                              setSecondariesCornerTertiaryFloors(Number(e.target.value))
                            }
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
                          <span className={`circle-number-sm${isActive('3-1') ? ' active' : ''}`}>
                            3
                          </span>
                          Regular lot
                        </label>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={secondariesRegularWidth}
                            onChange={(e) => setSecondariesRegularWidth(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={secondariesRegularDepth}
                            onChange={(e) => setSecondariesRegularDepth(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={secondariesRegularFloors}
                            onChange={(e) => setSecondariesRegularFloors(Number(e.target.value))}
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
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
                          <span className={`circle-number-sm${isActive('3-2') ? ' active' : ''}`}>
                            1
                          </span>
                          Corner with other local
                        </label>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={localsCornerLocalWidth}
                            onChange={(e) => setLocalsCornerLocalWidth(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={localsCornerLocalDepth}
                            onChange={(e) => setLocalsCornerLocalDepth(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={localsCornerLocalFloors}
                            onChange={(e) => setLocalsCornerLocalFloors(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm">
                          <span className={`circle-number-sm${isActive('3-2') ? ' active' : ''}`}>
                            2
                          </span>
                          Regular lot
                        </label>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial width (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={localsRegularWidth}
                            onChange={(e) => setLocalsRegularWidth(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial depth (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={localsRegularDepth}
                            onChange={(e) => setLocalsRegularDepth(Number(e.target.value))}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb10">
                      <Col>
                        <label className="font-label-sm ml30">
                          Initial floors (share of permissable)
                        </label>
                      </Col>
                      <Col>
                        <div className="input-group">
                          <input
                            type="number"
                            step="1"
                            className="form-control"
                            value={localsRegularFloors}
                            onChange={(e) => setLocalsRegularFloors(Number(e.target.value))}
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
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Initial width (share of permissable)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={offGridType1Width}
                          onChange={(e) => setOffGridType1Width(Number(e.target.value))}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Initial depth (share of permissable)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={offGridType1Depth}
                          onChange={(e) => setOffGridType1Depth(Number(e.target.value))}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Initial floors (share of permissable)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={offGridType1Floors}
                          onChange={(e) => setOffGridType1Floors(Number(e.target.value))}
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
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Initial width (share of permissable)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={offGridType2Width}
                          onChange={(e) => setOffGridType2Width(Number(e.target.value))}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Initial depth (share of permissable)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={offGridType2Depth}
                          onChange={(e) => setOffGridType2Depth(Number(e.target.value))}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb10">
                    <Col>
                      <label className="font-label-sm">Initial floors (share of permissable)</label>
                    </Col>
                    <Col>
                      <div className="input-group">
                        <input
                          type="number"
                          step="1"
                          className="form-control"
                          value={offGridType2Floors}
                          onChange={(e) => setOffGridType2Floors(Number(e.target.value))}
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
      <div className="txt-center mt20">
        <button className="btn btn-primary">Apply</button>
      </div>
    </Container>
  );
}

export default MapInputControls;
