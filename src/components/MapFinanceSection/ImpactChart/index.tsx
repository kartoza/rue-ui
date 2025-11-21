import { Accordion, Col, Container, Row } from 'react-bootstrap';
import { Radar } from '@ant-design/charts';
import { useEffect, useState } from 'react';

interface ChartData {
  key: string;
  item: string;
  value: number;
}

export default function ImpactChart() {
  // Use state to hold dummy data
  const [dummyData, setChartData] = useState<ChartData[]>([
    { key: 'r5', item: 'Density, initial', value: 0 },
    { key: 'r7', item: 'Land\nconsumption', value: 0 },
    { key: 'r10', item: 'Public\nspace', value: 0 },
    { key: 'r12', item: 'Neighborhood\nfinance', value: 0 },
    { key: 'r13', item: 'Cluster\nfinance', value: 0 },
    { key: 'r14', item: 'Building\nfinance', value: 0 },
    { key: 'r16', item: 'Affordability\nownership', value: 0 },
    { key: 'r17', item: 'Affordability\nrental', value: 0 },
  ]);

  useEffect(() => {
    // Set dummy data values (could randomize or hardcode)
    setChartData([
      { key: 'r5', item: 'Density, initial', value: 5.2 },
      { key: 'r7', item: 'Land\nconsumption', value: 3.8 },
      { key: 'r10', item: 'Public\nspace', value: 7.1 },
      { key: 'r12', item: 'Neighborhood\nfinance', value: 4.5 },
      { key: 'r13', item: 'Cluster\nfinance', value: 6.0 },
      { key: 'r14', item: 'Building\nfinance', value: 2.9 },
      { key: 'r16', item: 'Affordability\nownership', value: 8.3 },
      { key: 'r17', item: 'Affordability\nrental', value: 1.7 },
    ]);
  }, []);

  const config = {
    height: 250,
    data: dummyData,
    xField: 'item',
    yField: 'value',
    angleAxis: {
      label: { style: { fontSize: 14, fill: 'darkgreen' } },
    },
    line: { visible: true },
    point: {
      visible: true,
      shape: 'circle',
    },
  };

  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Impact</Accordion.Header>
        <Accordion.Body>
          <Container fluid className="mt-3">
            <Row>
              <Col>
                <Radar {...config} />
              </Col>
            </Row>
          </Container>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
