import React, { type FC } from 'react';
import { Box } from '@chakra-ui/react';
import { financeClass, formatCurrency } from '../../../../utils/format.ts';
import { useS2DB } from '../../../../redux/selectors/luckySheet.ts';

const NeighborhoodScaleProforma: FC = () => {
  const s2db = useS2DB();

  if (!s2db) {
    return <Box className="NoData">No Data</Box>;
  }

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Item</th>
          <th>Base-year amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Land and site-related costs</td>
          <td>{formatCurrency(s2db.b4)}</td>
        </tr>
        <tr>
          <td>Arteries (main roads)</td>
          <td>{formatCurrency(s2db.b5)}</td>
        </tr>
        <tr>
          <td>Secondaries (distributor roads)</td>
          <td>{formatCurrency(s2db.b6)}</td>
        </tr>
        <tr>
          <td>Tertiaries (access and local roads)</td>
          <td>{formatCurrency(s2db.b7)}</td>
        </tr>
        <tr>
          <td>Public Spaces</td>
          <td>{formatCurrency(s2db.b8)}</td>
        </tr>
        <tr className={financeClass(s2db.b9)}>
          <td>Costs, total</td>
          <td>{formatCurrency(s2db.b9)}</td>
        </tr>
        <tr>
          <td>Revenues from private lands on arteries</td>
          <td>{formatCurrency(s2db.b10)}</td>
        </tr>
        <tr>
          <td>on secondaries</td>
          <td>{formatCurrency(s2db.b11)}</td>
        </tr>
        <tr>
          <td>on tertiaries</td>
          <td>{formatCurrency(s2db.b12)}</td>
        </tr>
        <tr>
          <td>in off-grid clusters</td>
          <td>{formatCurrency(s2db.b13)}</td>
        </tr>
        <tr>
          <td>Revenues from private lands, subtotal</td>
          <td>{formatCurrency(s2db.b14)}</td>
        </tr>
        <tr>
          <td>Value of public lands</td>
          <td>{formatCurrency(s2db.b15)}</td>
        </tr>
        <tr className={financeClass(s2db.b16)}>
          <td>Revenues, total</td>
          <td>{formatCurrency(s2db.b16)}</td>
        </tr>
        <tr className={financeClass(s2db.b18) + ' dark'}>
          <td>Project surplus (loss)</td>
          <td>{formatCurrency(s2db.b18)}</td>
        </tr>
        <tr>
          <td>Financial efficiency (surplus/costs)</td>
          <td>{(s2db.b19 * 100).toFixed(2)}%</td>
        </tr>
      </tbody>
    </table>
  );
};

export default NeighborhoodScaleProforma;
