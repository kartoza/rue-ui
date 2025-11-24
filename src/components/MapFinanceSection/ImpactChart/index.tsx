import React, { useEffect, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { Radar } from '@ant-design/charts';
import { Box } from '@chakra-ui/react';

import { useSpider } from '../../../redux/selectors/luckySheet.ts';

interface ChartData {
  key: string;
  item: string;
  value: number;
}

const Chart: React.FC = () => {
  const spider = useSpider();
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!spider) return;

    setData([
      {
        key: 'd5',
        item: 'Density, initial',
        value: Math.round(spider.d5 * 100) / 100,
      },
      {
        key: 'd7',
        item: 'Land\nconsumption',
        value: Math.round(spider.d7 * 100) / 100,
      },
      {
        key: 'd10',
        item: 'Public\nspace',
        value: Math.round(spider.d10 * 100) / 100,
      },
      {
        key: 'd12',
        item: 'Neighborhood\nfinance',
        value: Math.round(spider.d12 * 100) / 100,
      },
      {
        key: 'd13',
        item: 'Cluster\nfinance',
        value: Math.round(spider.d13 * 100) / 100,
      },
      {
        key: 'd14',
        item: 'Building\nfinance',
        value: Math.round(spider.d14 * 100) / 100,
      },
      {
        key: 'd16',
        item: 'Affordability\nownership',
        value: Math.round(spider.d16 * 100) / 100,
      },
      {
        key: 'd17',
        item: 'Affordability\nrental',
        value: Math.round(spider.d17 * 100) / 100,
      },
    ]);
  }, [spider]);

  const config = {
    height: 250,
    width: 410,
    data: data,
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

  if (!spider || !data.length) {
    return (
      <Box className="NoData" style={{ height: '100%' }}>
        No Data
      </Box>
    );
  }
  return <Radar {...config} />;
};

export default function ImpactChart() {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Impact</Accordion.Header>
        <Accordion.Body>
          <div style={{ width: '100%', height: 250 }}>
            <Chart />
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
