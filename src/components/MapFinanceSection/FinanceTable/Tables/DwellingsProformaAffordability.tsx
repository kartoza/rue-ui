import React from 'react';
import { useS5DB } from '../../../../redux/selectors/luckySheet.ts';
import { Box } from '@chakra-ui/react';
import { financeClass, formatCurrency } from '../../../../utils/format.ts';

const DwellingsProformaAffordability: React.FC = () => {
  const s5db = useS5DB();

  if (!s5db) {
    return <Box className="NoData">No Data</Box>;
  }
  return (
    <div className="table-container">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>lot category, by location</th>
            <th>Total OR min. to max.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Serviced lots WITH starters</td>
            <td>{s5db.s4} lots</td>
          </tr>
          <tr>
            <td>Starter units, project-built</td>
            <td>{s5db.s5} units</td>
          </tr>
          <tr>
            <td>starter dwelling main units (owned), average gross area</td>
            <td>
              {s5db.s7.toFixed(0)} m2/unit to {s5db.u7.toFixed(0)} m2/unit
            </td>
          </tr>
          <tr>
            <th>Costs and revenues</th>
            <th>min to max</th>
          </tr>
          <tr>
            <td>Land cost, attributed to 1 main dwelling unit</td>
            <td>
              {formatCurrency(s5db.s9)} to {formatCurrency(s5db.u9)}
            </td>
          </tr>
          <tr>
            <td>Starter unit cost, attributed to 1 main dwelling unit</td>
            <td>
              {formatCurrency(s5db.s10)} to {formatCurrency(s5db.u10)}
            </td>
          </tr>
          <tr>
            <td>Additional household investment, before move in (if any)</td>
            <td>
              {formatCurrency(s5db.s11)} to {formatCurrency(s5db.u11)}
            </td>
          </tr>
          <tr className="bg-red">
            <td>Total cost, to be financed</td>
            <td>
              {formatCurrency(s5db.s12)} to {formatCurrency(s5db.u12)}
            </td>
          </tr>
          <tr>
            <th>Required monthly payments</th>
            <th>min to max</th>
          </tr>
          <tr>
            <td>Payments for land, if separate</td>
            <td>
              {formatCurrency(s5db.s15)} to {formatCurrency(s5db.u15)}
            </td>
          </tr>
          <tr>
            <td>Payments for starter, if separate</td>
            <td>
              {formatCurrency(s5db.s16)} to {formatCurrency(s5db.u16)}
            </td>
          </tr>
          <tr>
            <td>Payments, remaining</td>
            <td>
              {formatCurrency(s5db.s17)} to {formatCurrency(s5db.u17)}
            </td>
          </tr>
          <tr className="bg-red">
            <td>Payments, total</td>
            <td>
              {formatCurrency(s5db.s18)} to {formatCurrency(s5db.u18)}
            </td>
          </tr>
          <tr className={financeClass(s5db.s20) + ' dark'}>
            <td>Affordability of ownership</td>
            <td>Top {(s5db.s20 * 100).toFixed(2)}%</td>
          </tr>
          <tr className={financeClass(s5db.s21) + ' dark'}>
            <td>Affordability of rental sublets</td>
            <td>Top {(s5db.s21 * 100).toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DwellingsProformaAffordability;
