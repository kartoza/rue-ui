import type { FC } from 'react';

const DemographicForecast: FC = () => {
  return (
    <>
      <table className="table table-bordered">
        <colgroup>
          <col />
        </colgroup>
        <thead>
          <tr>
            <th>Initial Dwellings</th>
            <th>0 units</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>population</td>
            <td>0 people</td>
          </tr>
          <tr>
            <td>density, gross (all site)</td>
            <td>0 p/ha</td>
          </tr>
          <tr>
            <td>density, net (private land)</td>
            <td>0 p/ha</td>
          </tr>
        </tbody>
      </table>

      <table className="table table-bordered">
        <colgroup>
          <col />
        </colgroup>
        <thead>
          <tr>
            <th>Consolidated Dwellings</th>
            <th>0 units</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>population</td>
            <td>0 people</td>
          </tr>
          <tr>
            <td>density, gross (all site)</td>
            <td>0 p/ha</td>
          </tr>
          <tr>
            <td>density, net (private land)</td>
            <td>0 p/ha</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default DemographicForecast;
