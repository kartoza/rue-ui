import type { FC } from 'react';
import './style.scss';

const NeighborhoodScaleProforma: FC = () => {
  return (
    <table className="table table-bordered">
      <colgroup>
        <col />
      </colgroup>
      <thead>
        <tr>
          <th>Item</th>
          <th>Base-year amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Land and site-related costs</td>
          <td>0</td>
        </tr>
        <tr>
          <td>Arteries (main roads)</td>
          <td>0</td>
        </tr>
        <tr>
          <td>Secondaries (distributor roads)</td>
          <td>0</td>
        </tr>
        <tr>
          <td>Tertiaries (access and local roads)</td>
          <td>0</td>
        </tr>
        <tr>
          <td>Public Spaces</td>
          <td>0</td>
        </tr>
        <tr>
          <td>Costs, total</td>
          <td>0</td>
        </tr>
        <tr>
          <td>Revenues from private lands on arteries</td>
          <td>0</td>
        </tr>
        <tr>
          <td>on secondaries</td>
          <td>0</td>
        </tr>
        <tr>
          <td>on tertiaries</td>
          <td>0</td>
        </tr>
        <tr>
          <td>in off-grid clusters</td>
          <td>0</td>
        </tr>
        <tr>
          <td>Revenues from private lands, subtotal</td>
          <td>0</td>
        </tr>
        <tr>
          <td>Value of public lands</td>
          <td>0</td>
        </tr>
        <tr>
          <td>Revenues, total</td>
          <td>0</td>
        </tr>
        <tr>
          <td>Project surplus (loss)</td>
          <td>0</td>
        </tr>
        <tr>
          <td>Financial efficiency (surplus/costs)</td>
          <td>0</td>
        </tr>
      </tbody>
    </table>
  );
};

export default NeighborhoodScaleProforma;
