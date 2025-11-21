import React, { type FC } from 'react';
import { useS6DB } from '../../../../redux/selectors/luckySheet.ts';
import { Box } from '@chakra-ui/react';

const DemographicForecast: FC = () => {
  const s6db = useS6DB();

  if (!s6db) {
    return <Box className="NoData">No Data</Box>;
  }
  return (
    <>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Initial Dwellings</th>
            <th>{s6db.b3}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>population</td>
            <td>{s6db.b4}</td>
          </tr>
          <tr>
            <td>density, gross (all site)</td>
            <td>{s6db.b5}</td>
          </tr>
          <tr>
            <td>density, net (private land)</td>
            <td>{s6db.b6}</td>
          </tr>
        </tbody>
      </table>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Consolidated Dwellings</th>
            <th>{s6db.b8}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>population</td>
            <td>{s6db.b9}</td>
          </tr>
          <tr>
            <td>density, gross (all site)</td>
            <td>{s6db.b10}</td>
          </tr>
          <tr>
            <td>density, net (private land)</td>
            <td>{s6db.b11}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default DemographicForecast;
