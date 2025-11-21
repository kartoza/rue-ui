import React from 'react';
import { useS1DB } from '../../../../redux/selectors/luckySheet.ts';
import { Box } from '@chakra-ui/react';
import { financeClass, formatCurrency } from '../../../../utils/format.ts';

const CityScaleProforma: React.FC = () => {
  const s1db = useS1DB();

  if (!s1db) {
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
          <td>Off-site costs</td>
          <td>{formatCurrency(s1db.b4)}</td>
        </tr>
        <tr>
          <td>Off-site revenues</td>
          <td>{formatCurrency(s1db.b5)}</td>
        </tr>
        <tr>
          <td>Off-site surplus (loss)</td>
          <td>{formatCurrency(s1db.b6)}</td>
        </tr>
        <tr className={financeClass(s1db.b7)}>
          <td>Off-site costs, project-borne</td>
          <td>{formatCurrency(s1db.b7)}</td>
        </tr>
        <tr>
          <td></td>
          <td style={{ opacity: 0 }}>A</td>
        </tr>
        <tr>
          <td>{s1db.a9}</td>
          <td>{formatCurrency(s1db.b9)}</td>
        </tr>
        <tr>
          <td>{s1db.a10}</td>
          <td>{formatCurrency(s1db.b10)}</td>
        </tr>
        <tr>
          <td>{s1db.a11}</td>
          <td>{formatCurrency(s1db.b11)}</td>
        </tr>
        <tr>
          <td>{s1db.a12}</td>
          <td>{formatCurrency(s1db.b12)}</td>
        </tr>
        <tr>
          <td>{s1db.a13}</td>
          <td>{formatCurrency(s1db.b13)}</td>
        </tr>
        <tr className={financeClass(s1db.b14)}>
          <td>Land costs, subtotal</td>
          <td>{formatCurrency(s1db.b14)}</td>
        </tr>
        <tr>
          <td></td>
          <td style={{ opacity: 0 }}>A</td>
        </tr>
        <tr className={financeClass(s1db.b16) + ' dark'}>
          <td>Site-related costs, total</td>
          <td>{formatCurrency(s1db.b16)}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default CityScaleProforma;
