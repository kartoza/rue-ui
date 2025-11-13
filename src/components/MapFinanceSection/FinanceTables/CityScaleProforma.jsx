import React from 'react';
import { Container } from 'react-bootstrap';
import './style.scss';

function CityScaleProforma() {
  return (
    <Container fluid>
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
            <td>Off-site costs</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Off-site revenues</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Off-site surplus (loss)</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Off-site costs, project-borne</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Existing public roads: 0.00 ha </td>
            <td>0</td>
          </tr>
          <tr>
            <td>Environmental zone: 0.00 ha </td>
            <td>0</td>
          </tr>
          <tr>
            <td>Social reservation: 0.00 ha</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Agricultural lands: 0.00 ha</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Urban lands: 0.00 ha </td>
            <td>0</td>
          </tr>
          <tr>
            <td>Land costs, subtotal</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Site-related costs, total</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </Container>
  );
}

export default CityScaleProforma;
