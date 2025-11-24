import React from 'react';
import { useS4DB } from '../../../../redux/selectors/luckySheet.ts';
import { Box } from '@chakra-ui/react';
import { financeClass, formatCurrency } from '../../../../utils/format.ts';

const StarterBuildingsProforma: React.FC = () => {
  const s4db = useS4DB();

  if (!s4db) {
    return <Box className="NoData">No Data</Box>;
  }
  return (
    <>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <td>Serviced lots, withOUT construction</td>
            <td>{s4db.s3} lots</td>
          </tr>
          <tr>
            <th>Costs and revenues</th>
            <th>Base-year amount</th>
          </tr>
          <tr>
            <td>Serviced lots, on arteries</td>
            <td>{formatCurrency(s4db.s5)}</td>
          </tr>
          <tr>
            <td>in off-grid clusters, from arteries</td>
            <td>{formatCurrency(s4db.s6)}</td>
          </tr>
          <tr>
            <td>Serviced lots, on secondaries</td>
            <td>{formatCurrency(s4db.s7)}</td>
          </tr>
          <tr>
            <td>in off-grid clusters, from secondaries</td>
            <td>{formatCurrency(s4db.s8)}</td>
          </tr>
          <tr>
            <td>Serviced lots, on locals</td>
            <td>{formatCurrency(s4db.s9)}</td>
          </tr>
          <tr>
            <td>in off-grid clusters, from locals</td>
            <td>{formatCurrency(s4db.s10)}</td>
          </tr>
          <tr className={financeClass(s4db.s11)}>
            <td>Sales of serviced lots, subtotal</td>
            <td>{formatCurrency(s4db.s11)}</td>
          </tr>
          <tr>
            <td>Serviced lots, with starters</td>
            <td>{s4db.s13} lots</td>
          </tr>
          <tr>
            <th>Costs and revenues</th>
            <th>Base-year amount</th>
          </tr>
          <tr>
            <td>Serviced lots</td>
            <td>{formatCurrency(s4db.s15)}</td>
          </tr>
          <tr>
            <td>Construction</td>
            <td>{formatCurrency(s4db.s16)}</td>
          </tr>
          <tr>
            <td>Interest</td>
            <td>{formatCurrency(s4db.s17)}</td>
          </tr>
          <tr className={financeClass(s4db.s18)}>
            <td>Costs, total</td>
            <td>{formatCurrency(s4db.s18)}</td>
          </tr>
          <tr>
            <td>Revenues (sales), commercial floor area</td>
            <td>{formatCurrency(s4db.s19)}</td>
          </tr>
          <tr>
            <td>Revenues (sales), residential floor area</td>
            <td>{formatCurrency(s4db.s20)}</td>
          </tr>
          <tr className={financeClass(s4db.s21)}>
            <td>Revenues, total</td>
            <td>{formatCurrency(s4db.s21)}</td>
          </tr>
          <tr className={financeClass(s4db.s22) + ' dark'}>
            <td>Project surplus (loss), per lot</td>
            <td>{formatCurrency(s4db.s22)}</td>
          </tr>
          <tr>
            <td>Financial efficiency (surplus/costs)</td>
            <td>{(s4db.s23 * 100).toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default StarterBuildingsProforma;
