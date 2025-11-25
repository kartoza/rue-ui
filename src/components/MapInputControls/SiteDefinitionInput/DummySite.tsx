import Accordion from 'react-bootstrap/Accordion';
import { Col, Row } from 'react-bootstrap';
import { useState } from 'react';

interface Props {
  activeKeys: string[];
}

export default function DummySite({ activeKeys }: Props) {
  // City - Location
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  // City - Geometry
  const [rotation, setRotation] = useState<number>(0);
  const [front, setFront] = useState<number>(0);
  const [rear, setRear] = useState<number>(0);
  const [rearShift, setRearShift] = useState<number>(0);
  const [depth, setDepth] = useState<number>(0);

  const isActive = (key: string) => activeKeys.includes(key);
  return (
    <>
      <Accordion.Item eventKey="0-1">
        <Accordion.Header>
          <span className={`circle-number-md${isActive('0-1') ? ' active' : ''}`}>2</span>
          Location
        </Accordion.Header>
        <Accordion.Body>
          <Row>
            <Col>
              <label>
                <span className={`circle-number-sm${isActive('0-1') ? ' active' : ''}`}>1</span>
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
                <span className={`circle-number-sm${isActive('0-1') ? ' active' : ''}`}>2</span>
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
          <span className={`circle-number-md${isActive('0-2') ? ' active' : ''}`}>3</span>
          Geometry
        </Accordion.Header>
        <Accordion.Body>
          <Row>
            <Col>
              <label>
                <span className={`circle-number-sm${isActive('0-2') ? ' active' : ''}`}>1</span>
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
                <span className={`circle-number-sm${isActive('0-2') ? ' active' : ''}`}>2</span>
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
                <span className={`circle-number-sm${isActive('0-2') ? ' active' : ''}`}>3</span>
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
                <span className={`circle-number-sm${isActive('0-2') ? ' active' : ''}`}>4</span>
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
                <span className={`circle-number-sm${isActive('0-2') ? ' active' : ''}`}>5</span>
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
  );
}
