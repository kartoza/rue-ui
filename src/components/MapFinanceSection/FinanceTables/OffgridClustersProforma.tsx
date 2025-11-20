import type { FC } from 'react';
import './style.scss';

const OffgridClustersProforma: FC = () => {
  //TO DO: add tables for individual clusters?

  return (
    <>
      <p>Number of clusters: 0</p>
      <table className="table table-bordered">
        <colgroup>
          <col />
        </colgroup>
        <thead>
          <tr>
            <th>Costs and revenues, all clusters</th>
            <th>Base-year amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Serviced land, all clusters</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Semi-private (collective) space, all clusters</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Total costs, all clusters</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Revenues from private lots, all clusters</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Other revenues, all clusters</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Total revenue, all clusters</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Total surplus (loss), all clusters</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Financial efficiency (surplus/costs)</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default OffgridClustersProforma;
