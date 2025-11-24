import React, { type ChangeEvent, useState } from 'react';
import { useS3DB } from '../../../../redux/selectors/luckySheet.ts';
import { Box } from '@chakra-ui/react';
import { financeClass, formatCurrency } from '../../../../utils/format.ts';

const OffGridClustersProforma: React.FC = () => {
  const s3db = useS3DB();
  const [selectedColumn, setSelectedColumn] = useState<string>('f');

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedColumn(e.target.value);
  };

  if (!s3db) {
    return <Box className="NoData">No Data</Box>;
  }

  const cell = function (row: number) {
    return s3db[selectedColumn + row.toString()];
  };

  return (
    <>
      <div style={{ padding: '1rem 1rem 1rem 2rem' }}>
        <select className="form-control" value={selectedColumn} onChange={handleChange}>
          <option value="b">On arteries</option>
          <option value="c">On secondaries</option>
          <option value="d">On locals, single</option>
          <option value="e">On locals, multiple</option>
          <option value="f">Total</option>
        </select>
      </div>
      <div className="table-container">
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>Number of clusters</td>
              <td>{cell(4)}</td>
            </tr>
            <tr>
              <th>Costs and revenues, all clusters</th>
              <th>Base-year amount</th>
            </tr>
            <tr>
              <td>Serviced land, all clusters</td>
              <td>{formatCurrency(cell(6))}</td>
            </tr>
            <tr>
              <td>Semi-private (collective) space, all clusters</td>
              <td>{formatCurrency(cell(7))}</td>
            </tr>
            <tr className={financeClass(cell(8))}>
              <td>Total costs, all clusters</td>
              <td>{formatCurrency(cell(8))}</td>
            </tr>
            <tr>
              <td>Revenues from private lots, all clusters</td>
              <td>{formatCurrency(cell(9))}</td>
            </tr>
            <tr>
              <td>Other revenues, all clusters</td>
              <td>{formatCurrency(cell(10))}</td>
            </tr>
            <tr className={financeClass(cell(11))}>
              <td>Total revenue, all clusters</td>
              <td>{formatCurrency(cell(11))}</td>
            </tr>
            <tr className={financeClass(cell(13)) + ' dark'}>
              <td>Total surplus (loss), all clusters</td>
              <td>{formatCurrency(cell(13))}</td>
            </tr>
            <tr>
              <td>Financial efficiency (surplus/costs)</td>
              <td>{(cell(14) * 100).toFixed(2)}%</td>
            </tr>
            <tr>
              <td style={{ opacity: 0 }}>A</td>
            </tr>
            <tr>
              <td>Number of clusters</td>
              <td>1 of {cell(17)}</td>
            </tr>
            <tr>
              <th>Costs and revenues, individual cluster</th>
              <th>Base-year amount</th>
            </tr>
            <tr>
              <td>Serviced land</td>
              <td>{formatCurrency(cell(19))}</td>
            </tr>
            <tr>
              <td>Semi-private (collective) space</td>
              <td>{formatCurrency(cell(20))}</td>
            </tr>
            <tr className={financeClass(cell(21))}>
              <td>Cost, total</td>
              <td>{formatCurrency(cell(21))}</td>
            </tr>
            <tr>
              <td>Revenues from private lots</td>
              <td>{formatCurrency(cell(22))}</td>
            </tr>
            <tr>
              <td>Other revenues</td>
              <td>{formatCurrency(cell(23))}</td>
            </tr>
            <tr className={financeClass(cell(24))}>
              <td>Revenue, total</td>
              <td>{formatCurrency(cell(24))}</td>
            </tr>
            <tr className={financeClass(cell(26)) + ' dark'}>
              <td>Project surplus (loss)</td>
              <td>{formatCurrency(cell(26))}</td>
            </tr>
            <tr>
              <td>Financial efficiency (surplus/costs)</td>
              <td>{(cell(27) * 100).toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OffGridClustersProforma;
